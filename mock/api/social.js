/**
 * mock/api/social.js - 社交模块API路由映射
 * 
 * 定义社交模块的API路由映射
 */

import socialApi from '../social';

// 社交模块API路由映射
export default {
  // 积分相关
  'GET /api/social/points/statistics': socialApi.getUserPointsStatistics,
  'GET /api/social/points/history': socialApi.getUserPointsHistory,
  'GET /api/social/points/ranking': socialApi.getPointsRanking,
  'GET /api/social/points/rules': socialApi.getPointsRules,
  
  // 徽章相关
  'GET /api/social/badges': socialApi.getUserBadges,
  'GET /api/social/badges/types': socialApi.getBadgeTypes,
  'GET /api/social/titles': socialApi.getUserTitles,
  'POST /api/social/titles/active': socialApi.setActiveTitle,
  
  // 社区相关
  'GET /api/social/topics': socialApi.getTopics,
  'GET /api/social/topics/hot': socialApi.getHotTopics,
  'GET /api/social/user/info': socialApi.getSocialUserInfo,
  'GET /api/social/posts/recommend': socialApi.getRecommendPosts,
  'GET /api/social/posts': socialApi.getPosts,
  'GET /api/social/posts/:id': socialApi.getPostDetail,
  'POST /api/social/posts': socialApi.createPost,
  'POST /api/social/posts/:id/like': socialApi.togglePostLike,
  'GET /api/social/posts/:id/comments': socialApi.getPostComments,
  'POST /api/social/posts/:id/comments': socialApi.createComment,
  'POST /api/social/comments/:id/like': socialApi.toggleCommentLike
};
