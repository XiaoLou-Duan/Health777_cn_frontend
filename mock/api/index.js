/**
 * mock/api/index.js - API路由映射入口
 * 
 * 整合所有模块的API路由映射
 */

import socialRoutes from './social';
import medicalRoutes from './medical';

// 合并所有模块的API路由映射
const apiRoutes = {
  ...socialRoutes,
  ...medicalRoutes
  // 可以在此处添加其他模块的路由映射
  // ...userRoutes,
  // ...nutritionRoutes,
  // ...exerciseRoutes,
  // ...reminderRoutes
};

export default apiRoutes;
