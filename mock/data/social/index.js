/**
 * mock/data/social/index.js - 社交模块数据入口
 * 
 * 整合社交模块的所有模拟数据
 */

// 导入社交数据子模块
import points from './points';
import badges from './badges';
import posts from './posts';
import comments from './comments';

// 导出社交数据
export default {
  points,
  badges,
  posts,
  comments
};
