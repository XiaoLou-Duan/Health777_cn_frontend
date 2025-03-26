/**
 * config.js - 全局配置
 */

// 应用信息
export const APP_INFO = {
  name: 'HearthGood', // 应用名称
  version: '1.0.0', // 应用版本
  description: '面向肌少症老年人的健康管理应用', // 应用描述
  logo: '/static/images/logo.png' // 应用logo
};

// 开关配置
export const APP_CONFIG = {
  debug: true, // 是否开启调试模式
  mock: true, // 是否使用模拟数据
  cacheEnabled: true, // 是否启用缓存
  statisticsEnabled: true, // 是否启用统计功能
  notificationEnabled: true // 是否启用通知功能
};

// 缓存配置
export const CACHE_CONFIG = {
  userInfoExpire: 7 * 24 * 60 * 60, // 用户信息缓存时间（秒）
  tokenExpire: 7 * 24 * 60 * 60, // token缓存时间（秒）
  maxCacheSize: 10 * 1024 * 1024 // 最大缓存大小（字节）
};

// 通知配置
export const NOTIFICATION_CONFIG = {
  exercise: {
    enabled: true, // 是否启用运动提醒
    interval: 24 * 60 * 60 // 提醒间隔（秒）
  },
  protein: {
    enabled: true, // 是否启用蛋白质提醒
    interval: 4 * 60 * 60 // 提醒间隔（秒）
  },
  appointment: {
    enabled: true, // 是否启用预约提醒
    advance: 24 * 60 * 60 // 提前提醒时间（秒）
  }
};

// 老年人特定配置
export const ELDERLY_CONFIG = {
  largeFont: true, // 是否启用大字体
  highContrast: true, // 是否启用高对比度
  simplifiedInterface: true, // 是否启用简化界面
  voiceAssistant: true, // 是否启用语音助手
  proteinTarget: 1.2, // 蛋白质目标（克/千克体重）
  exerciseTarget: 30 // 运动目标（分钟/天）
};

// 营养相关配置
export const NUTRITION_CONFIG = {
  proteinRange: {
    min: 1.0, // 最小蛋白质摄入量（克/千克体重）
    max: 1.2 // 最大蛋白质摄入量（克/千克体重）
  },
  mealReminders: [ // 用餐提醒时间
    { name: '早餐', time: '07:00' },
    { name: '上午加餐', time: '10:00' },
    { name: '午餐', time: '12:00' },
    { name: '下午加餐', time: '15:00' },
    { name: '晚餐', time: '18:00' }
  ],
  wheyProteinReminders: [ // 乳清蛋白提醒时间
    { name: '早餐后', time: '08:00' },
    { name: '午餐后', time: '13:00' },
    { name: '运动后', time: '17:00' }
  ]
};

// 运动相关配置
export const EXERCISE_CONFIG = {
  dailyTarget: 30, // 每日运动目标（分钟）
  weeklyTarget: 150, // 每周运动目标（分钟）
  exerciseTypes: [ // 运动类型
    { name: '散步', icon: '/static/icons/walk.png', calories: 3 },
    { name: '慢跑', icon: '/static/icons/jog.png', calories: 7 },
    { name: '太极', icon: '/static/icons/taichi.png', calories: 4 },
    { name: '广场舞', icon: '/static/icons/dance.png', calories: 5 },
    { name: '力量训练', icon: '/static/icons/strength.png', calories: 6 }
  ],
  difficultyLevels: [ // 难度等级
    { name: '简单', value: 'easy' },
    { name: '中等', value: 'medium' },
    { name: '困难', value: 'hard' }
  ]
};

// 社交相关配置
export const SOCIAL_CONFIG = {
  pointRules: [ // 积分规则
    { name: '每日登录', points: 5, limit: 'daily' },
    { name: '完成每日运动', points: 10, limit: 'daily' },
    { name: '完成蛋白质摄入目标', points: 10, limit: 'daily' },
    { name: '分享到社区', points: 5, limit: 'none' },
    { name: '邀请好友', points: 20, limit: 'none' }
  ],
  rewards: [ // 奖励列表
    { name: '健康小贴士', points: 50, icon: '/static/icons/tip.png' },
    { name: '运动视频解锁', points: 100, icon: '/static/icons/video.png' },
    { name: '健康食谱', points: 200, icon: '/static/icons/recipe.png' },
    { name: '优惠券', points: 500, icon: '/static/icons/coupon.png' }
  ]
};

// 医患互动相关配置
export const MEDICAL_CONFIG = {
  appointmentTimeSlots: [ // 预约时间段
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
  ],
  messageTypes: [ // 消息类型
    { name: '咨询', value: 'consult' },
    { name: '预约', value: 'appointment' },
    { name: '报告解读', value: 'report' },
    { name: '用药指导', value: 'medication' },
    { name: '其他', value: 'other' }
  ],
  healthMetrics: [ // 健康指标
    { name: '体重', unit: 'kg' },
    { name: '身高', unit: 'cm' },
    { name: '血压', unit: 'mmHg' },
    { name: '血糖', unit: 'mmol/L' },
    { name: '心率', unit: 'bpm' }
  ]
};

export default {
  APP_INFO,
  APP_CONFIG,
  CACHE_CONFIG,
  NOTIFICATION_CONFIG,
  ELDERLY_CONFIG,
  NUTRITION_CONFIG,
  EXERCISE_CONFIG,
  SOCIAL_CONFIG,
  MEDICAL_CONFIG
};
