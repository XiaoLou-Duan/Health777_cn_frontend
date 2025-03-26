/**
 * mock/data/social/points.js - 积分数据
 * 
 * 包含用户积分记录和排名数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 积分记录
const pointsHistory = [
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 50,
    reason: '完成每日饮食记录',
    createTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 364)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 30,
    reason: '达成每日运动目标',
    createTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 364)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 20,
    reason: '按时服用乳清蛋白',
    createTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 364)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 10,
    reason: '发布社区帖子',
    createTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 363)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 5,
    reason: '评论社区帖子',
    createTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 363)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    type: 'earn',
    points: 100,
    reason: '连续7天完成每日目标',
    createTime: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 362)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    type: 'earn',
    points: 50,
    reason: '完成每日饮食记录',
    createTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 364)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    type: 'earn',
    points: 30,
    reason: '达成每日运动目标',
    createTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 364)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    type: 'earn',
    points: 5,
    reason: '评论社区帖子',
    createTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    expireTime: new Date(new Date().setDate(new Date().getDate() + 363)).toISOString()
  }
];

// 用户积分统计
const pointsStatistics = [
  {
    userId: '1001',
    totalPoints: 215,
    availablePoints: 215,
    expiredPoints: 0,
    usedPoints: 0,
    rank: 1,
    lastUpdateTime: new Date().toISOString()
  },
  {
    userId: '1002',
    totalPoints: 85,
    availablePoints: 85,
    expiredPoints: 0,
    usedPoints: 0,
    rank: 2,
    lastUpdateTime: new Date().toISOString()
  },
  {
    userId: '1003',
    totalPoints: 65,
    availablePoints: 65,
    expiredPoints: 0,
    usedPoints: 0,
    rank: 3,
    lastUpdateTime: new Date().toISOString()
  },
  {
    userId: '1004',
    totalPoints: 60,
    availablePoints: 60,
    expiredPoints: 0,
    usedPoints: 0,
    rank: 4,
    lastUpdateTime: new Date().toISOString()
  },
  {
    userId: '1005',
    totalPoints: 45,
    availablePoints: 45,
    expiredPoints: 0,
    usedPoints: 0,
    rank: 5,
    lastUpdateTime: new Date().toISOString()
  }
];

// 积分规则
const pointsRules = [
  {
    id: 'rule001',
    action: 'diet_record',
    description: '完成每日饮食记录',
    points: 50,
    maxTimes: 1,
    period: 'day',
    enabled: true
  },
  {
    id: 'rule002',
    action: 'exercise_goal',
    description: '达成每日运动目标',
    points: 30,
    maxTimes: 1,
    period: 'day',
    enabled: true
  },
  {
    id: 'rule003',
    action: 'protein_intake',
    description: '按时服用乳清蛋白',
    points: 20,
    maxTimes: 2, // 早晚各一次
    period: 'day',
    enabled: true
  },
  {
    id: 'rule004',
    action: 'post_community',
    description: '发布社区帖子',
    points: 10,
    maxTimes: 3,
    period: 'day',
    enabled: true
  },
  {
    id: 'rule005',
    action: 'comment_post',
    description: '评论社区帖子',
    points: 5,
    maxTimes: 5,
    period: 'day',
    enabled: true
  },
  {
    id: 'rule006',
    action: 'continuous_7days',
    description: '连续7天完成每日目标',
    points: 100,
    maxTimes: 1,
    period: 'week',
    enabled: true
  },
  {
    id: 'rule007',
    action: 'continuous_30days',
    description: '连续30天完成每日目标',
    points: 500,
    maxTimes: 1,
    period: 'month',
    enabled: true
  }
];

export default {
  pointsHistory,
  pointsStatistics,
  pointsRules
};
