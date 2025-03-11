/**
 * mock/data/social/badges.js - 徽章数据
 * 
 * 包含成就徽章和用户称号数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 徽章类型
const badgeTypes = [
  {
    id: 'badge001',
    type: 'nutrition',
    name: '营养达人',
    description: '完成饮食记录相关成就',
    icon: '/static/icons/badges/nutrition.png'
  },
  {
    id: 'badge002',
    type: 'exercise',
    name: '运动达人',
    description: '完成运动锻炼相关成就',
    icon: '/static/icons/badges/exercise.png'
  },
  {
    id: 'badge003',
    type: 'protein',
    name: '蛋白质专家',
    description: '完成蛋白质摄入相关成就',
    icon: '/static/icons/badges/protein.png'
  },
  {
    id: 'badge004',
    type: 'social',
    name: '社区达人',
    description: '完成社区互动相关成就',
    icon: '/static/icons/badges/social.png'
  },
  {
    id: 'badge005',
    type: 'persistence',
    name: '坚持不懈',
    description: '完成连续打卡相关成就',
    icon: '/static/icons/badges/persistence.png'
  }
];

// 徽章列表
const badgeList = [
  {
    id: 'b001',
    typeId: 'badge001',
    level: 1,
    name: '营养新手',
    description: '完成10次饮食记录',
    requirement: '完成10次饮食记录',
    icon: '/static/icons/badges/nutrition-1.png',
    points: 50
  },
  {
    id: 'b002',
    typeId: 'badge001',
    level: 2,
    name: '营养爱好者',
    description: '完成50次饮食记录',
    requirement: '完成50次饮食记录',
    icon: '/static/icons/badges/nutrition-2.png',
    points: 100
  },
  {
    id: 'b003',
    typeId: 'badge001',
    level: 3,
    name: '营养专家',
    description: '完成100次饮食记录',
    requirement: '完成100次饮食记录',
    icon: '/static/icons/badges/nutrition-3.png',
    points: 200
  },
  {
    id: 'b004',
    typeId: 'badge002',
    level: 1,
    name: '运动新手',
    description: '完成10次运动记录',
    requirement: '完成10次运动记录',
    icon: '/static/icons/badges/exercise-1.png',
    points: 50
  },
  {
    id: 'b005',
    typeId: 'badge002',
    level: 2,
    name: '运动爱好者',
    description: '完成50次运动记录',
    requirement: '完成50次运动记录',
    icon: '/static/icons/badges/exercise-2.png',
    points: 100
  },
  {
    id: 'b006',
    typeId: 'badge002',
    level: 3,
    name: '运动健将',
    description: '完成100次运动记录',
    requirement: '完成100次运动记录',
    icon: '/static/icons/badges/exercise-3.png',
    points: 200
  },
  {
    id: 'b007',
    typeId: 'badge003',
    level: 1,
    name: '蛋白质初学者',
    description: '连续7天达到蛋白质摄入目标',
    requirement: '连续7天达到蛋白质摄入目标',
    icon: '/static/icons/badges/protein-1.png',
    points: 50
  },
  {
    id: 'b008',
    typeId: 'badge003',
    level: 2,
    name: '蛋白质管理师',
    description: '连续30天达到蛋白质摄入目标',
    requirement: '连续30天达到蛋白质摄入目标',
    icon: '/static/icons/badges/protein-2.png',
    points: 150
  },
  {
    id: 'b009',
    typeId: 'badge003',
    level: 3,
    name: '蛋白质大师',
    description: '连续90天达到蛋白质摄入目标',
    requirement: '连续90天达到蛋白质摄入目标',
    icon: '/static/icons/badges/protein-3.png',
    points: 300
  },
  {
    id: 'b010',
    typeId: 'badge004',
    level: 1,
    name: '社区新人',
    description: '发布3篇社区帖子',
    requirement: '发布3篇社区帖子',
    icon: '/static/icons/badges/social-1.png',
    points: 30
  },
  {
    id: 'b011',
    typeId: 'badge004',
    level: 2,
    name: '社区活跃者',
    description: '发布10篇社区帖子并获得20次点赞',
    requirement: '发布10篇社区帖子并获得20次点赞',
    icon: '/static/icons/badges/social-2.png',
    points: 100
  },
  {
    id: 'b012',
    typeId: 'badge004',
    level: 3,
    name: '社区明星',
    description: '发布30篇社区帖子并获得100次点赞',
    requirement: '发布30篇社区帖子并获得100次点赞',
    icon: '/static/icons/badges/social-3.png',
    points: 300
  },
  {
    id: 'b013',
    typeId: 'badge005',
    level: 1,
    name: '坚持一周',
    description: '连续7天登录应用',
    requirement: '连续7天登录应用',
    icon: '/static/icons/badges/persistence-1.png',
    points: 50
  },
  {
    id: 'b014',
    typeId: 'badge005',
    level: 2,
    name: '坚持一月',
    description: '连续30天登录应用',
    requirement: '连续30天登录应用',
    icon: '/static/icons/badges/persistence-2.png',
    points: 150
  },
  {
    id: 'b015',
    typeId: 'badge005',
    level: 3,
    name: '坚持不懈',
    description: '连续100天登录应用',
    requirement: '连续100天登录应用',
    icon: '/static/icons/badges/persistence-3.png',
    points: 500
  }
];

// 用户徽章记录
const userBadges = [
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b001',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    progress: 100,
    currentValue: 10,
    targetValue: 10
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b002',
    achieved: false,
    achievedAt: null,
    progress: 54,
    currentValue: 27,
    targetValue: 50
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b004',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    progress: 100,
    currentValue: 10,
    targetValue: 10
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b005',
    achieved: false,
    achievedAt: null,
    progress: 32,
    currentValue: 16,
    targetValue: 50
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b007',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    progress: 100,
    currentValue: 7,
    targetValue: 7
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b008',
    achieved: false,
    achievedAt: null,
    progress: 40,
    currentValue: 12,
    targetValue: 30
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b010',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    progress: 100,
    currentValue: 3,
    targetValue: 3
  },
  {
    id: generateRandomId(),
    userId: '1001',
    badgeId: 'b013',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
    progress: 100,
    currentValue: 7,
    targetValue: 7
  }
];

// 用户称号列表
const titles = [
  {
    id: 't001',
    name: '健康新手',
    description: '开始健康之旅的新人',
    requirement: '注册并完成个人资料',
    icon: '/static/icons/titles/beginner.png',
    level: 1
  },
  {
    id: 't002',
    name: '健康爱好者',
    description: '持续关注健康的爱好者',
    requirement: '获得5个初级徽章',
    icon: '/static/icons/titles/enthusiast.png',
    level: 2
  },
  {
    id: 't003',
    name: '健康达人',
    description: '在健康管理方面表现出色',
    requirement: '获得10个徽章，其中包括至少3个中级徽章',
    icon: '/static/icons/titles/expert.png',
    level: 3
  },
  {
    id: 't004',
    name: '健康明星',
    description: '在健康社区中备受关注的明星',
    requirement: '获得15个徽章，其中包括至少3个高级徽章',
    icon: '/static/icons/titles/star.png',
    level: 4
  },
  {
    id: 't005',
    name: '健康大师',
    description: '在健康管理方面达到大师水平',
    requirement: '获得全部徽章',
    icon: '/static/icons/titles/master.png',
    level: 5
  }
];

// 用户称号记录
const userTitles = [
  {
    id: generateRandomId(),
    userId: '1001',
    titleId: 't001',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    isActive: false
  },
  {
    id: generateRandomId(),
    userId: '1001',
    titleId: 't002',
    achieved: true,
    achievedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    isActive: true
  }
];

export default {
  badgeTypes,
  badgeList,
  userBadges,
  titles,
  userTitles
};
