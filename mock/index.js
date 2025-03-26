/**
 * mock/index.js - Mock服务入口文件
 * 
 * 该文件负责整合所有模块的Mock服务，并提供统一的入口
 */

import { setupMock } from './utils/mock-helper';
import userApi from './user';
import nutritionApi from './nutrition';
import exerciseApi from './exercise';
import socialApi from './social';
import medicalApi from './medical';
import reminderApi from './reminder';
import apiRoutes from './api';

// 合并所有API
const allApis = {
  ...userApi,
  ...nutritionApi,
  ...exerciseApi,
  ...socialApi,
  ...medicalApi,
  ...reminderApi
};

// 启动Mock服务
export function startMockService() {
  console.log('Starting mock service...');
  // 使用API路由映射
  setupMock(apiRoutes);
  console.log('Mock service started successfully');
}

/**
 * 获取模拟数据
 * @param {string} key - 数据键名
 * @returns {any} 对应的模拟数据
 */
export function getMockData(key) {
  const dataModules = {
    user: require('./data/user').default,
    nutrition: require('./data/nutrition').default,
    exercise: require('./data/exercise').default,
    social: require('./data/social').default,
    medical: require('./data/medical').default,
    reminder: require('./data/reminder/index').default
  };
  
  return key ? dataModules[key] : dataModules;
}

export default {
  startMockService,
  getMockData
};
