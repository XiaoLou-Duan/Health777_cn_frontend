/**
 * mock-helper.js - Mock辅助工具
 * 
 * 提供模拟数据服务的辅助函数
 */

// 防抖延迟时间（模拟网络延迟）
const DEBOUNCE_TIME = 300;

/**
 * 设置Mock服务
 * @param {Object} apiMocks - API模拟数据映射对象
 */
export function setupMock(apiMocks) {
  // 拦截uni.request请求
  const originalRequest = uni.request;
  
  uni.request = function(options) {
    const { url, method = 'GET', data, header, success, fail, complete } = options;
    
    // 查找匹配的模拟API
    const mockApi = findMockApi(apiMocks, url, method);
    
    if (mockApi) {
      console.log(`[Mock] 拦截请求: ${method} ${url}`);
      handleMockRequest(mockApi, data, header, success, fail, complete);
      return {}; // 返回一个空对象作为requestTask
    }
    
    // 如果没有匹配的模拟API，使用原始请求
    return originalRequest(options);
  };
}

/**
 * 查找匹配的模拟API
 * @param {Object} apiMocks - API模拟数据映射对象
 * @param {string} url - 请求URL
 * @param {string} method - 请求方法
 * @returns {Object|null} 匹配的模拟API处理函数
 */
function findMockApi(apiMocks, url, method) {
  // 提取路径部分（去除查询参数）
  const urlPath = url.split('?')[0];
  
  // 遍历查找匹配的API
  for (const key in apiMocks) {
    const [mockMethod, mockPath] = key.split(' ');
    
    // 方法相同且路径匹配
    if (mockMethod.toUpperCase() === method.toUpperCase()) {
      // 精确匹配
      if (mockPath === urlPath) {
        return apiMocks[key];
      }
      
      // 带参数的路径匹配（如 /api/user/:id）
      if (mockPath.includes(':') && isPathMatch(mockPath, urlPath)) {
        return apiMocks[key];
      }
    }
  }
  
  return null;
}

/**
 * 检查带参数的路径是否匹配
 * @param {string} mockPath - 模拟API路径（如 /api/user/:id）
 * @param {string} urlPath - 实际请求路径（如 /api/user/123）
 * @returns {boolean} 是否匹配
 */
function isPathMatch(mockPath, urlPath) {
  const mockSegments = mockPath.split('/');
  const urlSegments = urlPath.split('/');
  
  if (mockSegments.length !== urlSegments.length) {
    return false;
  }
  
  for (let i = 0; i < mockSegments.length; i++) {
    const mockSegment = mockSegments[i];
    const urlSegment = urlSegments[i];
    
    // 如果不是参数且不匹配，则返回false
    if (!mockSegment.startsWith(':') && mockSegment !== urlSegment) {
      return false;
    }
  }
  
  return true;
}

/**
 * 处理模拟请求
 * @param {Function} mockApi - 模拟API处理函数
 * @param {Object} data - 请求数据
 * @param {Object} header - 请求头
 * @param {Function} success - 成功回调
 * @param {Function} fail - 失败回调
 * @param {Function} complete - 完成回调
 */
function handleMockRequest(mockApi, data, header, success, fail, complete) {
  // 模拟网络延迟
  setTimeout(() => {
    try {
      // 调用模拟API处理函数
      const response = mockApi({
        body: typeof data === 'string' ? data : JSON.stringify(data),
        headers: header || {},
        query: {},
        params: {}
      });
      
      // 构造响应对象
      const mockResponse = {
        data: response,
        statusCode: 200,
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      
      // 调用成功回调
      if (typeof success === 'function') {
        success(mockResponse);
      }
      
      // 调用完成回调
      if (typeof complete === 'function') {
        complete(mockResponse);
      }
    } catch (error) {
      console.error('[Mock] 处理请求出错', error);
      
      // 构造错误响应
      const errorResponse = {
        data: {
          code: 500,
          message: '服务器内部错误',
          data: null
        },
        statusCode: 500,
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      
      // 调用失败回调
      if (typeof fail === 'function') {
        fail(errorResponse);
      }
      
      // 调用完成回调
      if (typeof complete === 'function') {
        complete(errorResponse);
      }
    }
  }, DEBOUNCE_TIME);
}

/**
 * 生成分页数据
 * @param {Array} list - 完整数据列表
 * @param {Object} query - 查询参数，包含 page, pageSize
 * @returns {Object} 分页结果
 */
export function getPagination(list, query) {
  const page = parseInt(query.page || 1);
  const pageSize = parseInt(query.pageSize || 10);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    list: list.slice(start, end),
    pagination: {
      total: list.length,
      pageSize,
      current: page,
      pages: Math.ceil(list.length / pageSize)
    }
  };
}

/**
 * 生成随机ID
 * @returns {string} 随机ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * 模拟成功响应
 * @param {any} data - 响应数据
 * @returns {Object} 标准响应格式
 */
export function success(data = null) {
  return {
    code: 0,
    message: '操作成功',
    data
  };
}

/**
 * 模拟失败响应
 * @param {string} message - 错误消息
 * @param {number} code - 错误码
 * @returns {Object} 标准响应格式
 */
export function fail(message = '操作失败', code = 1) {
  return {
    code,
    message,
    data: null
  };
}

/**
 * 模拟未授权响应
 * @returns {Object} 标准响应格式
 */
export function unauthorized() {
  return {
    code: 401,
    message: '未授权或登录已过期',
    data: null
  };
}

/**
 * 检查模拟请求是否授权
 * @param {Object} options - 请求选项
 * @returns {boolean} 是否授权
 */
export function isAuthorized(options) {
  const { headers } = options;
  return headers && headers.Authorization && headers.Authorization.startsWith('Bearer ');
}

export default {
  setupMock,
  getPagination,
  generateId,
  success,
  fail,
  unauthorized,
  isAuthorized
};
