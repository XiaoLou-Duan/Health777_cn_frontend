const baseUrl = {
  dev: 'http://localhost:48080', // 开发环境
  test: 'https://test-api.hearthgood.com', // 测试环境
  prod: 'https://api.hearthgood.com' // 生产环境
};

// 当前环境
const env = process.env.NODE_ENV || 'dev';

// 超时时间
const timeout = 60000;

// 接口URL
export const API = {
  // 用户相关
  USER: {
    LOGIN: '/member/auth/login', // 手机号+密码登录
    LOGIN_BY_SMS: '/member/auth/sms-login', // 短信验证码登录
    REGISTER: '/auth/register', // 注册
    LOGOUT: '/member/auth/logout', // 登出
    GET_INFO: '/member/user/get', // 获取用户信息
    UPDATE_INFO: '/member/user/update', // 更新用户信息
    SEND_SMS: '/member/auth/send-sms-code', // 发送短信验证码
    VERIFY_SMS: '/member/auth/validate-sms-code', // 验证短信验证码
    CHANGE_PASSWORD: '/member/user/update-password', // 修改密码
    UPLOAD_AVATAR: '/user/avatar', // 上传头像
    HEALTH_INFO: '/user/health', // 健康信息
    WECHAT_LOGIN: '/auth/wechat-login', // 微信登录
    APPLE_LOGIN: '/auth/apple-login', // Apple登录
    RESET_PASSWORD: '/member/user/reset-password', // 重置密码
    UPDATE_MOBILE: '/member/user/update-mobile', // 修改手机号
    REFRESH_TOKEN: '/member/auth/refresh-token' // 刷新令牌
  },
  
  // 营养相关
  NUTRITION: {
    FOOD_RECOGNIZE: '/nutrition/food/recognize', // 食物识别
    FOOD_HISTORY: '/nutrition/food/history', // 食物历史
    PROTEIN_ANALYSIS: '/nutrition/protein/analysis', // 蛋白质分析
    PROTEIN_RECORD: '/nutrition/protein/record', // 蛋白质记录
    DIET_SUGGESTION: '/nutrition/diet/suggestion', // 饮食建议
    DIET_PREFERENCE: '/nutrition/diet/preference', // 饮食偏好
    WHEY_PROTEIN: '/nutrition/whey/record', // 乳清蛋白记录
    WHEY_REMINDER: '/nutrition/whey/reminder' // 乳清蛋白提醒
  },
  
  // 运动相关
  EXERCISE: {
    RECORD: '/exercise/record', // 运动记录
    HISTORY: '/exercise/history', // 运动历史
    STATISTICS: '/exercise/statistics', // 运动统计
    VIDEO_LIST: '/exercise/video/list', // 视频列表
    VIDEO_DETAIL: '/exercise/video/detail', // 视频详情
    VIDEO_PROGRESS: '/exercise/video/progress', // 视频进度
    VIDEO_FAVORITE: '/exercise/video/favorite' // 视频收藏
  },
  
  // 社交相关
  SOCIAL: {
    POINTS: '/social/points', // 积分
    POINT_RULES: '/social/points/rules', // 积分规则
    POINT_HISTORY: '/social/points/history', // 积分历史
    REWARDS: '/social/rewards', // 奖励
    REWARD_EXCHANGE: '/social/rewards/exchange', // 奖励兑换
    COMMUNITY_POSTS: '/social/community/posts', // 社区帖子
    COMMUNITY_POST_DETAIL: '/social/community/posts/:id', // 社区帖子详情
    COMMUNITY_COMMENTS: '/social/community/posts/:id/comments', // 社区评论
    COMMUNITY_POST_LIKE: '/social/community/posts/:id/like' // 点赞帖子
  },
  
  // 医患互动相关
  MEDICAL: {
    DOCTOR_LIST: '/medical/doctors', // 医生列表
    DOCTOR_DETAIL: '/medical/doctors/:id', // 医生详情
    APPOINTMENT_LIST: '/medical/appointments', // 预约列表
    APPOINTMENT_CREATE: '/medical/appointments', // 创建预约
    APPOINTMENT_CANCEL: '/medical/appointments/:id/cancel', // 取消预约
    MESSAGE_LIST: '/medical/messages', // 消息列表
    MESSAGE_DETAIL: '/medical/messages/:id', // 消息详情
    MESSAGE_SEND: '/medical/messages', // 发送消息
    HEALTH_REPORT: '/medical/health/report', // 健康报告
    HEALTH_RECORD: '/medical/health/record' // 健康记录
  }
};

/**
 * 获取完整的API URL
 * @param {String} path API路径
 * @returns {String} 完整的API URL
 */
export function getApiUrl(path) {
  if (!path) {
    console.error('路径不能为空');
    return '';
  }
  
  // 当前环境的基础URL
  const base = baseUrl[env] || baseUrl['dev'];
  
  // 确保路径正确格式化
  let apiPath = path;
  if (!apiPath.startsWith('/')) {
    apiPath = `/${apiPath}`;
  }
  
  // 构建完整URL
  return `${base}/app-api${apiPath}`;
}

export default {
  baseUrl,
  env,
  timeout,
  API,
  getApiUrl
};
