/**
 * request.js - HTTP请求封装
 */
import { getApiUrl } from '@/config/api';
import Storage from './storage';
import { publicApiPaths } from '@/utils/permission.js';

// 是否正在刷新token
let isRefreshingToken = false;
// 请求队列，存储待重发请求
let requestQueue = [];

/**
 * 请求拦截器
 * @param {Object} config 请求配置
 * @returns {Object} 处理后的请求配置
 */
function requestInterceptor(config) {
  // 获取token
  const token = Storage.get('token');
  
  // 检查当前请求是否需要登录检测
  // 使用permission.js中定义的公共API路径列表
  const needAuth = !publicApiPaths.some(path => config.url.includes(path));
  
  config.header = {
    ...config.header,
    'Authorization': `Bearer ${token}`
  };
  
  return config;
}

/**
 * 刷新令牌
 * @returns {Promise} 刷新结果
 */
async function refreshToken() {
  const refreshToken = Storage.get('refreshToken');
  if (!refreshToken) {
    return Promise.reject('没有刷新令牌');
  }
  
  try {
    // 使用uni.request直接发送请求，避免循环调用request
    return new Promise((resolve, reject) => {
      uni.request({
        url: getApiUrl('/app-api/member/auth/refresh-token'),
        method: 'POST',
        data: { refreshToken },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 0) {
            resolve(res.data);
          } else {
            reject(res.data.message || '刷新令牌失败');
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * 响应拦截器
 * @param {Object} response 响应数据
 * @param {Object} originalConfig 原始请求配置
 * @returns {Object} 处理后的响应数据
 */
async function responseInterceptor(response, originalConfig) {
  // 检查当前请求是否需要登录检测
  // 使用permission.js中定义的公共API路径列表
  const requestUrl = response.config ? response.config.url : '';
  const needAuth = !publicApiPaths.some(path => requestUrl.includes(path));
  
  // 如果返回的状态码为401，说明 token已过期或无效
  if (response.statusCode === 401 || response.data.code === 401) {
    // 如果是刷新token的请求失败，直接返回错误
    if (requestUrl.includes('/refresh-token')) {
      return handleLogout();
    }
    
    // 如果不是刷新token的请求，尝试刷新token
    if (!isRefreshingToken) {
      isRefreshingToken = true;
      
      try {
        // 获取刷新令牌
        const refreshTokenValue = Storage.get('refreshToken');
        if (!refreshTokenValue) {
          throw new Error('没有刷新令牌');
        }
        
        // 刷新令牌
        const result = await refreshToken();
        
        if (result && result.data) {
          // 更新存储的token信息
          const tokenData = result.data;
          Storage.set('token', tokenData.accessToken);
          if (tokenData.refreshToken) {
            Storage.set('refreshToken', tokenData.refreshToken);
          }
          if (tokenData.expiresTime) {
            Storage.set('expiresTime', tokenData.expiresTime);
          }
          
          // 更新Vuex中的token
          const store = require('@/store').default;
          store.commit('user/SET_TOKEN', tokenData.accessToken);
          
          // 重新发送队列中的请求
          requestQueue.forEach(cb => cb());
          requestQueue = [];
          
          // 重新发送当前请求
          originalConfig.header.Authorization = `Bearer ${tokenData.accessToken}`;
          return request(originalConfig);
        } else {
          throw new Error('刷新令牌失败');
        }
      } catch (error) {
        console.error('刷新令牌失败:', error);
        return handleLogout();
      } finally {
        isRefreshingToken = false;
      }
    } else {
      // 将请求加入队列
      return new Promise(resolve => {
        requestQueue.push(() => {
          originalConfig.header.Authorization = `Bearer ${Storage.get('token')}`;
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
  // 清除本地存储的用户信息和token
  Storage.remove('userInfo');
  Storage.remove('token');
  Storage.remove('refreshToken');
  Storage.remove('expiresTime');
  Storage.remove('userId');
  
  // 清除Vuex中的用户状态
  const store = require('@/store').default;
  store.commit('user/SET_LOGIN_STATE', false);
  store.commit('user/SET_USER_INFO', null);
  store.commit('user/SET_TOKEN', '');
  
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
