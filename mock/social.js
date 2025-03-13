/**
 * mock/social.js - 社交模块API模拟
 * 
 * 提供社交模块的API接口模拟
 */

import { 
  mockRequest, 
  successResponse, 
  errorResponse, 
  generateRandomId,
  checkTokenValid
} from './utils/mock-helper';

// 导入社交模块数据
import socialData from './data/social/index';

// 获取用户积分统计
const getUserPointsStatistics = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  const userStats = socialData.points.pointsStatistics.find(stat => stat.userId === userId);
  
  if (!userStats) {
    return errorResponse(404, '未找到用户积分信息');
  }
  
  return successResponse(userStats);
});

// 获取用户积分历史
const getUserPointsHistory = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { page = 1, pageSize = 10 } = params.data || {};
  
  // 过滤出用户的积分记录
  const userHistory = socialData.points.pointsHistory.filter(record => record.userId === userId);
  
  // 按时间倒序排序
  userHistory.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  // 计算分页
  const total = userHistory.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = userHistory.slice(startIndex, endIndex);
  
  return successResponse({
    list,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取积分排行榜
const getPointsRanking = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { limit = 10 } = params.data || {};
  
  // 按积分降序排序
  const ranking = [...socialData.points.pointsStatistics].sort((a, b) => b.totalPoints - a.totalPoints);
  
  // 限制返回数量
  const limitedRanking = ranking.slice(0, limit);
  
  return successResponse(limitedRanking);
});

// 获取积分规则
const getPointsRules = mockRequest(() => {
  return successResponse(socialData.points.pointsRules);
});

// 获取用户徽章
const getUserBadges = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 获取用户所有徽章记录
  const userBadges = socialData.badges.userBadges.filter(badge => badge.userId === userId);
  
  // 合并徽章详情
  const badgesWithDetails = userBadges.map(userBadge => {
    const badgeDetail = socialData.badges.badgeList.find(badge => badge.id === userBadge.badgeId);
    if (!badgeDetail) return userBadge;
    
    const badgeType = socialData.badges.badgeTypes.find(type => type.id === badgeDetail.typeId);
    
    return {
      ...userBadge,
      name: badgeDetail.name,
      description: badgeDetail.description,
      requirement: badgeDetail.requirement,
      icon: badgeDetail.icon,
      level: badgeDetail.level,
      points: badgeDetail.points,
      type: badgeType ? {
        id: badgeType.id,
        name: badgeType.name,
        icon: badgeType.icon
      } : null
    };
  });
  
  // 按类型和等级排序
  badgesWithDetails.sort((a, b) => {
    if (a.type?.id !== b.type?.id) {
      return a.type?.name.localeCompare(b.type?.name);
    }
    return a.level - b.level;
  });
  
  return successResponse(badgesWithDetails);
});

// 获取徽章类型
const getBadgeTypes = mockRequest(() => {
  return successResponse(socialData.badges.badgeTypes);
});

// 获取用户称号
const getUserTitles = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 获取用户所有称号记录
  const userTitles = socialData.badges.userTitles.filter(title => title.userId === userId);
  
  // 合并称号详情
  const titlesWithDetails = userTitles.map(userTitle => {
    const titleDetail = socialData.badges.titles.find(title => title.id === userTitle.titleId);
    if (!titleDetail) return userTitle;
    
    return {
      ...userTitle,
      name: titleDetail.name,
      description: titleDetail.description,
      requirement: titleDetail.requirement,
      icon: titleDetail.icon,
      level: titleDetail.level
    };
  });
  
  // 按等级排序
  titlesWithDetails.sort((a, b) => a.level - b.level);
  
  return successResponse(titlesWithDetails);
});

// 设置当前称号
const setActiveTitle = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { titleId } = params.data || {};
  
  if (!titleId) {
    return errorResponse(400, '称号ID不能为空');
  }
  
  // 查找用户是否已获得该称号
  const targetTitle = socialData.badges.userTitles.find(
    title => title.userId === userId && title.titleId === titleId
  );
  
  if (!targetTitle) {
    return errorResponse(404, '用户未获得该称号');
  }
  
  // 取消之前的激活称号
  socialData.badges.userTitles.forEach(title => {
    if (title.userId === userId && title.isActive) {
      title.isActive = false;
    }
  });
  
  // 激活新称号
  targetTitle.isActive = true;
  
  return successResponse(null, '称号设置成功');
});

// 获取社区话题列表
const getTopics = mockRequest(() => {
  // 按序号排序
  const sortedTopics = [...socialData.posts.topics].sort((a, b) => a.order - b.order);
  return successResponse(sortedTopics);
});

// 获取热门话题列表
const getHotTopics = mockRequest(() => {
  // 获取话题并添加帖子数量
  const topicsWithCount = socialData.posts.topics.map(topic => {
    const postCount = socialData.posts.posts.filter(post => post.topicId === topic.id).length;
    return {
      ...topic,
      postCount
    };
  });
  
  // 按帖子数量排序
  const sortedTopics = [...topicsWithCount].sort((a, b) => b.postCount - a.postCount);
  
  // 返回前5个热门话题
  return successResponse(sortedTopics.slice(0, 5));
});

// 获取社交用户信息
const getSocialUserInfo = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 获取用户积分统计
  const pointsStats = socialData.points.pointsStatistics.find(stat => stat.userId === userId);
  
  // 获取用户徽章数量
  const badgeCount = socialData.badges.userBadges.filter(badge => badge.userId === userId).length;
  
  // 获取用户当前称号
  const activeTitle = socialData.badges.userTitles.find(title => title.userId === userId && title.isActive);
  let activeTitleInfo = null;
  
  if (activeTitle) {
    const titleDetail = socialData.badges.titles.find(title => title.id === activeTitle.titleId);
    if (titleDetail) {
      activeTitleInfo = {
        id: titleDetail.id,
        name: titleDetail.name,
        icon: titleDetail.icon
      };
    }
  }
  
  // 构建用户信息
  const userInfo = {
    userId,
    nickname: '健康达人',
    avatar: '/static/images/avatar/default.jpg',
    points: pointsStats ? pointsStats.totalPoints : 0,
    level: pointsStats ? Math.floor(pointsStats.totalPoints / 100) + 1 : 1,
    badgeCount,
    activeTitle: activeTitleInfo
  };
  
  return successResponse(userInfo);
});

// 获取推荐帖子
const getRecommendPosts = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  // 获取推荐帖子
  const recommendPosts = socialData.posts.posts.filter(post => post.isRecommend);
  
  // 按时间倒序排序
  recommendPosts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  // 获取话题信息和作者信息
  const postsWithDetails = recommendPosts.map(post => {
    const topic = socialData.posts.topics.find(topic => topic.id === post.topicId);
    
    // 简化内容作为摘要
    const summary = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
    
    return {
      ...post,
      topicName: topic ? topic.name : '',
      topicColor: topic ? topic.color : '#999999',
      summary,
      author: {
        nickname: '健康达人',
        avatar: '/static/images/avatar/default.jpg'
      }
    };
  });
  
  return successResponse(postsWithDetails.slice(0, 3));
});

// 获取帖子列表
const getPosts = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { topicId, keyword, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredPosts = [...socialData.posts.posts];
  
  // 话题过滤
  if (topicId) {
    filteredPosts = filteredPosts.filter(post => post.topicId === topicId);
  }
  
  // 关键词过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(lowerKeyword) || 
      post.content.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 按置顶和时间倒序排序
  filteredPosts.sort((a, b) => {
    if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
    return new Date(b.createTime) - new Date(a.createTime);
  });
  
  // 计算分页
  const total = filteredPosts.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredPosts.slice(startIndex, endIndex);
  
  // 获取当前用户的点赞状态
  const userId = '1001'; // 从token中获取用户ID
  const postsWithLikeStatus = list.map(post => {
    const isLiked = socialData.posts.userLikes.some(
      like => like.userId === userId && like.postId === post.id
    );
    return { ...post, isLiked };
  });
  
  return successResponse({
    list: postsWithLikeStatus,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取帖子详情
const getPostDetail = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  const post = socialData.posts.posts.find(post => post.id === id);
  
  if (!post) {
    return errorResponse(404, '帖子不存在');
  }
  
  // 增加浏览量（实际环境中应该有更好的处理方式）
  post.viewCount += 1;
  
  // 获取当前用户的点赞状态
  const userId = '1001'; // 从token中获取用户ID
  const isLiked = socialData.posts.userLikes.some(
    like => like.userId === userId && like.postId === post.id
  );
  
  return successResponse({ ...post, isLiked });
});

// 发布帖子
const createPost = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { topicId, title, content, images = [] } = params.data || {};
  
  if (!topicId) {
    return errorResponse(400, '话题不能为空');
  }
  
  if (!title) {
    return errorResponse(400, '标题不能为空');
  }
  
  if (!content) {
    return errorResponse(400, '内容不能为空');
  }
  
  // 检查话题是否存在
  const topicExists = socialData.posts.topics.some(topic => topic.id === topicId);
  if (!topicExists) {
    return errorResponse(400, '话题不存在');
  }
  
  // 创建新帖子
  const newPost = {
    id: generateRandomId(),
    userId,
    topicId,
    title,
    content,
    images,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    isTop: false,
    isRecommend: false,
    status: 'published'
  };
  
  // 添加到数据集
  socialData.posts.posts.unshift(newPost);
  
  return successResponse(newPost);
});

// 点赞/取消点赞帖子
const togglePostLike = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)\/like$/).slice(1);
  
  // 查找帖子
  const post = socialData.posts.posts.find(post => post.id === id);
  if (!post) {
    return errorResponse(404, '帖子不存在');
  }
  
  // 查找是否已点赞
  const likeIndex = socialData.posts.userLikes.findIndex(
    like => like.userId === userId && like.postId === id
  );
  
  if (likeIndex === -1) {
    // 添加点赞
    socialData.posts.userLikes.push({
      id: generateRandomId(),
      userId,
      postId: id,
      createTime: new Date().toISOString()
    });
    
    // 增加点赞数
    post.likeCount += 1;
    
    return successResponse({ isLiked: true, likeCount: post.likeCount }, '点赞成功');
  } else {
    // 取消点赞
    socialData.posts.userLikes.splice(likeIndex, 1);
    
    // 减少点赞数
    post.likeCount = Math.max(0, post.likeCount - 1);
    
    return successResponse({ isLiked: false, likeCount: post.likeCount }, '取消点赞成功');
  }
});

// 获取帖子评论
const getPostComments = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)\/comments$/).slice(1);
  const { page = 1, pageSize = 20 } = params.data || {};
  
  // 查找帖子
  const post = socialData.posts.posts.find(post => post.id === id);
  if (!post) {
    return errorResponse(404, '帖子不存在');
  }
  
  // 获取帖子的评论
  let comments = socialData.comments.comments.filter(comment => comment.postId === id);
  
  // 按时间正序排序
  comments.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
  
  // 计算分页
  const total = comments.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = comments.slice(startIndex, endIndex);
  
  // 获取当前用户的点赞状态
  const userId = '1001'; // 从token中获取用户ID
  const commentsWithLikeStatus = list.map(comment => {
    const isLiked = socialData.comments.commentLikes.some(
      like => like.userId === userId && like.commentId === comment.id
    );
    return { ...comment, isLiked };
  });
  
  return successResponse({
    list: commentsWithLikeStatus,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 发表评论
const createComment = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)\/comments$/).slice(1);
  const { content, replyTo } = params.data || {};
  
  if (!content) {
    return errorResponse(400, '评论内容不能为空');
  }
  
  // 查找帖子
  const post = socialData.posts.posts.find(post => post.id === id);
  if (!post) {
    return errorResponse(404, '帖子不存在');
  }
  
  // 创建新评论
  const newComment = {
    id: generateRandomId(),
    postId: id,
    userId,
    content,
    createTime: new Date().toISOString(),
    likeCount: 0,
    replyTo,
    status: 'published'
  };
  
  // 添加到数据集
  socialData.comments.comments.push(newComment);
  
  // 更新帖子评论数
  post.commentCount += 1;
  
  return successResponse(newComment);
});

// 点赞/取消点赞评论
const toggleCommentLike = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/comments\/(\w+)\/like$/).slice(1);
  
  // 查找评论
  const comment = socialData.comments.comments.find(comment => comment.id === id);
  if (!comment) {
    return errorResponse(404, '评论不存在');
  }
  
  // 查找是否已点赞
  const likeIndex = socialData.comments.commentLikes.findIndex(
    like => like.userId === userId && like.commentId === id
  );
  
  if (likeIndex === -1) {
    // 添加点赞
    socialData.comments.commentLikes.push({
      id: generateRandomId(),
      userId,
      commentId: id,
      createTime: new Date().toISOString()
    });
    
    // 增加点赞数
    comment.likeCount += 1;
    
    return successResponse({ isLiked: true, likeCount: comment.likeCount }, '点赞成功');
  } else {
    // 取消点赞
    socialData.comments.commentLikes.splice(likeIndex, 1);
    
    // 减少点赞数
    comment.likeCount = Math.max(0, comment.likeCount - 1);
    
    return successResponse({ isLiked: false, likeCount: comment.likeCount }, '取消点赞成功');
  }
});

export default {
  getUserPointsStatistics,
  getUserPointsHistory,
  getPointsRanking,
  getPointsRules,
  getUserBadges,
  getBadgeTypes,
  getUserTitles,
  setActiveTitle,
  getTopics,
  getHotTopics,
  getSocialUserInfo,
  getRecommendPosts,
  getPosts,
  getPostDetail,
  createPost,
  togglePostLike,
  getPostComments,
  createComment,
  toggleCommentLike
};
