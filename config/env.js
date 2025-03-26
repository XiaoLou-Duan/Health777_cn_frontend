/**
 * env.js - 环境配置
 */

// 环境变量
export const ENV = {
  // 当前环境
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 是否为开发环境
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  
  // 是否为测试环境
  isTest: process.env.NODE_ENV === 'test',
  
  // 是否为生产环境
  isProd: process.env.NODE_ENV === 'production',
  
  // 平台信息
  platform: process.env.UNI_PLATFORM || '',
  
  // 是否为移动端
  isMobile: ['app-plus', 'h5', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq'].includes(process.env.UNI_PLATFORM || ''),
  
  // 是否为iOS系统
  isIOS: () => {
    const systemInfo = uni.getSystemInfoSync();
    return systemInfo.platform === 'ios';
  },
  
  // 是否为Android系统
  isAndroid: () => {
    const systemInfo = uni.getSystemInfoSync();
    return systemInfo.platform === 'android';
  },
  
  // 获取设备信息
  getSystemInfo: () => {
    return uni.getSystemInfoSync();
  }
};

// 服务器环境配置
export const SERVER_ENV = {
  // 开发环境
  development: {
    baseUrl: 'http://localhost:3000/api',
    uploadUrl: 'http://localhost:3000/upload',
    socketUrl: 'ws://localhost:3000',
    staticUrl: 'http://localhost:3000/static'
  },
  
  // 测试环境
  test: {
    baseUrl: 'https://test-api.hearthgood.com/api',
    uploadUrl: 'https://test-api.hearthgood.com/upload',
    socketUrl: 'wss://test-api.hearthgood.com',
    staticUrl: 'https://test-static.hearthgood.com'
  },
  
  // 生产环境
  production: {
    baseUrl: 'https://api.hearthgood.com/api',
    uploadUrl: 'https://api.hearthgood.com/upload',
    socketUrl: 'wss://api.hearthgood.com',
    staticUrl: 'https://static.hearthgood.com'
  }
};

// 获取当前环境的服务器配置
export function getServerConfig() {
  return SERVER_ENV[ENV.NODE_ENV] || SERVER_ENV.development;
}

// 版本信息
export const VERSION = {
  // 应用版本号
  appVersion: '1.0.0',
  
  // API版本号
  apiVersion: 'v1',
  
  // 构建时间
  buildTime: new Date().toISOString()
};

// 调试配置
export const DEBUG = {
  // 是否启用日志
  enableLog: ENV.isDev,
  
  // 日志级别: 'debug', 'info', 'warn', 'error'
  logLevel: ENV.isDev ? 'debug' : 'error',
  
  // 是否启用性能监控
  enablePerformance: ENV.isDev
};

export default {
  ENV,
  SERVER_ENV,
  getServerConfig,
  VERSION,
  DEBUG
};
