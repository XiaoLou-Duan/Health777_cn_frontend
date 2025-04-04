import { getApiUrl } from '@/config/api';
import Storage from './storage';
import { publicApiPaths } from '@/utils/permission.js';

let isRefreshingToken = false;
let requestQueue = [];

function requestInterceptor(config) {
  const token = Storage.get('token');
  
  // 检查当前请求是否需要登录检测
  // 使用permission.js中定义的公共API路径列表
  const needAuth = !publicApiPaths.some(path => config.url.includes(path));
  
  // 检查token是否即将过期，如果是公共API路径则不检查
  if (needAuth && token) {
    const expiresTime = Storage.get('expiresTime');
    if (expiresTime) {
      // 将expiresTime转换为Date对象
      const expiresDate = new Date(expiresTime);
      const now = new Date();
      
      // 如果token将在5分钟内过期，尝试提前刷新
      const fiveMinutes = 5 * 60 * 1000; // 5分钟，单位毫秒
      if ((expiresDate.getTime() - now.getTime()) < fiveMinutes) {
        // 如果当前没有在刷新token，则尝试刷新
        if (!isRefreshingToken) {
          console.log('Token即将过期，尝试提前刷新');
          refreshToken()
            .then(result => {
              if (result && result.code === 0 && result.data) {
                const tokenData = result.data;
                Storage.set('token', tokenData.accessToken);
                Storage.set('refreshToken', tokenData.refreshToken);
                if (tokenData.expiresTime) {
                  Storage.set('expiresTime', tokenData.expiresTime);
                }
                
                try {
                  const store = require('@/store').default;
                  store.commit('user/SET_TOKEN', tokenData.accessToken);
                } catch (error) {
                  console.error('更新Vuex状态失败:', error);
                }
                
                console.log('Token提前刷新成功');
              }
            })
            .catch(error => {
              console.error('提前刷新Token失败:', error);
              // 失败了也没关系，后续请求会触发正常的刷新流程
            });
        }
      }
    }
  }
  
  config.header = {
    ...config.header,
    'Authorization': `Bearer ${token}`
  };
  
  return config;
}

async function refreshToken() {
  const refreshToken = Storage.get('refreshToken');
  if (!refreshToken) {
    return Promise.reject('没有刷新令牌');
  }
  
  try {
    // 使用uni.request直接发送请求，避免循环调用request
    return new Promise((resolve, reject) => {
      uni.request({
        url: getApiUrl('/member/auth/refresh-token?refreshToken='+refreshToken),
        method: 'POST',
        data: { refreshToken },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            // 确保返回的数据结构符合后续处理的预期
            resolve({
              code: 0,
              data: res.data.data, // 直接返回data部分，包含accessToken, refreshToken等
              message: res.data.message || '刷新令牌成功'
            });
          } else {
            reject(res.data?.message || '刷新令牌失败');
          }
        },
        fail: (err) => {
          console.error('刷新令牌请求失败:', err);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('刷新令牌异常:', error);
    return Promise.reject(error);
  }
}

async function responseInterceptor(response, originalConfig) {
  const requestUrl = originalConfig ? originalConfig.url : '';
  
  // 检查响应状态码
  if (response.data && response.data.code === 401) {
    console.log('收到401响应，请求URL:', requestUrl);
    
    // 如果是刷新token的请求返回401，直接登出
    if (requestUrl.includes('/refresh-token')) {
      console.log('刷新令牌请求失败，执行登出');
      return handleLogout();
    }
    
    // 如果不是刷新token的请求，尝试刷新token
    if (!isRefreshingToken) {
      isRefreshingToken = true;
      console.log('开始刷新令牌流程');
      
      try {
        // 获取刷新令牌
        const refreshTokenValue = Storage.get('refreshToken');
        if (!refreshTokenValue) {
          console.error('本地没有存储刷新令牌');
          throw new Error('没有刷新令牌');
        }
        
        // 刷新令牌
        const result = await refreshToken();
        console.log('刷新令牌结果:', result);
        
        if (result && result.code === 0 && result.data) {
          // 更新存储的token信息
          const tokenData = result.data;
          console.log('获取到新的令牌');
          
          // 存储新的token
          Storage.set('token', tokenData.accessToken);
          Storage.set('refreshToken', tokenData.refreshToken);
          if (tokenData.expiresTime) {
            Storage.set('expiresTime', tokenData.expiresTime);
          }
          
          // 更新Vuex中的token，使用动态导入避免循环引用
          try {
            const store = require('@/store').default;
            store.commit('user/SET_TOKEN', tokenData.accessToken);
          } catch (storeError) {
            console.error('更新Vuex状态失败:', storeError);
            // 继续执行，不影响主流程
          }
          
          // 重新发送队列中的请求
          console.log(`处理等待队列中的 ${requestQueue.length} 个请求`);
          requestQueue.forEach(cb => cb(tokenData.accessToken));
          requestQueue = [];
          
          // 重新发送当前请求
          originalConfig.header.Authorization = `Bearer ${tokenData.accessToken}`;
          return request(originalConfig);
        } else {
          console.error('刷新令牌响应格式不正确:', result);
          throw new Error(result?.message || '刷新令牌失败');
        }
      } catch (error) {
        console.error('刷新令牌过程中出错:', error);
        // 清空请求队列，所有等待的请求都会收到登出错误
        requestQueue.forEach(cb => cb(null, error));
        requestQueue = [];
        return handleLogout();
      } finally {
        isRefreshingToken = false;
      }
    } else {
      // 将请求加入队列
      console.log('令牌刷新中，将请求加入队列');
      return new Promise((resolve, reject) => {
        requestQueue.push((newToken, error) => {
          if (error) {
            // 如果刷新令牌过程出错，拒绝该请求
            reject(error);
            return;
          }
          
          if (newToken) {
            // 使用新令牌更新请求头
            originalConfig.header.Authorization = `Bearer ${newToken}`;
          } else {
            // 使用存储中的令牌（以防万一）
            originalConfig.header.Authorization = `Bearer ${Storage.get('token')}`;
          }
          
          // 重新发送请求
          resolve(request(originalConfig));
        });
      });
    }
  }
  
  return response;
}

/**
 * 处理登出
 */
function handleLogout() {
  console.log('执行登出操作');
  
  // 清除本地存储的用户信息和token
  Storage.remove('userInfo');
  Storage.remove('token');
  Storage.remove('refreshToken');
  Storage.remove('expiresTime');
  Storage.remove('userId');
  
  // 清除Vuex中的用户状态，使用try-catch避免可能的循环引用问题
  try {
    const store = require('@/store').default;
    store.commit('user/SET_LOGIN_STATE', false);
    store.commit('user/SET_USER_INFO', null);
    store.commit('user/SET_TOKEN', '');
  } catch (error) {
    console.error('清除Vuex状态失败:', error);
    // 继续执行，不影响主流程
  }
  
  // 如果当前页面不是登录页，则显示提示并跳转
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentRoute = currentPage ? currentPage.route : '';
  
  if (!currentRoute.includes('/pages/login/')) {
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none',
      duration: 1500
    });
    
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/login'
      });
    }, 1500);
  }
  
  return Promise.reject(new Error('登录已过期'));
}

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @returns {Promise} 请求Promise
 */
function request(options) {
  // 处理请求URL
  if (!options.url) {
    console.error('请求URL不能为空');
    return Promise.reject(new Error('请求URL不能为空'));
  }
  
  // 确保请求URL是完整的
  let url;
  if (options.url.startsWith('http')) {
    url = options.url;
  } else {
    url = getApiUrl(options.url);
  }
  
  console.log('请求URL:', url); // 调试日志
  
  // 请求拦截
  const config = requestInterceptor({
    ...options,
    url
  });
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: async (res) => {
        // 响应拦截
        try {
          const interceptedRes = await responseInterceptor(res, config);
          resolve(interceptedRes.data);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * GET请求
 * @param {String} url 请求URL
 * @param {Object} params 请求参数
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export function get(url, params = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  });
}

/**
 * POST请求
 * @param {String} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * PUT请求
 * @param {String} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

/**
 * DELETE请求
 * @param {String} url 请求URL
 * @param {Object} params 请求参数
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export function del(url, params = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data: params,
    ...options
  });
}

export default {
  request,
  get,
  post,
  put,
  del
};
