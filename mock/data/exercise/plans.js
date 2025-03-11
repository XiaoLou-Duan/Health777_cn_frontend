/**
 * mock/data/exercise/plans.js - 运动计划模拟数据
 * 
 * 包含用户的个性化运动计划
 */

import { generateRandomId } from '../../utils/mock-helper';

// 获取当前日期
const currentDate = new Date();

// 计算过去或未来的日期
function calculateDate(dayOffset) {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
}

// 用户1001的运动计划 - 活跃的肌少症改善计划
const user1001ActivePlan = {
  id: generateRandomId(),
  userId: '1001',
  name: '肌少症改善计划',
  description: '针对肌少症患者的综合性运动计划，包含力量训练、有氧运动和平衡训练，帮助增强肌肉力量，延缓肌肉流失。',
  startDate: calculateDate(-30), // 30天前开始
  endDate: calculateDate(60),   // 60天后结束
  isActive: true,
  targetExerciseDaysPerWeek: 5,
  targetDurationMinutesPerDay: 30,
  targetCaloriesPerDay: 120,
  difficulty: 2, // 1-5，难度适中
  createdBy: 'system', // system或doctor
  createdAt: calculateDate(-30),
  updatedAt: calculateDate(-10),
  exercises: [
    {
      dayOfWeek: 1, // 周一
      exerciseId: 'e002', // 椅子坐立
      durationMinutes: 15,
      sets: 3,
      reps: 10,
      notes: '每组间休息1分钟，注意保持正确姿势'
    },
    {
      dayOfWeek: 1, // 周一
      exerciseId: 'e003', // 上肢弹力带训练
      durationMinutes: 15,
      sets: 2,
      reps: 12,
      notes: '选择适当阻力的弹力带，动作缓慢可控'
    },
    {
      dayOfWeek: 2, // 周二
      exerciseId: 'e001', // 轻度步行
      durationMinutes: 30,
      sets: 1,
      reps: 1,
      notes: '保持舒适速度，可在室内或户外平地进行'
    },
    {
      dayOfWeek: 3, // 周三
      exerciseId: 'e008', // 下肢弹力带训练
      durationMinutes: 15,
      sets: 3,
      reps: 10,
      notes: '注意保持平衡，可扶住椅子或墙壁进行'
    },
    {
      dayOfWeek: 3, // 周三
      exerciseId: 'e007', // 站立平衡训练
      durationMinutes: 10,
      sets: 2,
      reps: 5,
      notes: '每个姿势保持10-30秒，根据能力调整'
    },
    {
      dayOfWeek: 5, // 周五
      exerciseId: 'e002', // 椅子坐立
      durationMinutes: 15,
      sets: 3,
      reps: 10,
      notes: '每组间休息1分钟，注意保持正确姿势'
    },
    {
      dayOfWeek: 5, // 周五
      exerciseId: 'e009', // 坐姿上肢训练
      durationMinutes: 15,
      sets: 2,
      reps: 12,
      notes: '使用轻量哑铃，动作缓慢可控'
    },
    {
      dayOfWeek: 6, // 周六
      exerciseId: 'e004', // 太极拳
      durationMinutes: 30,
      sets: 1,
      reps: 1,
      notes: '跟随视频指导，注意呼吸和动作协调'
    },
    {
      dayOfWeek: 7, // 周日
      exerciseId: 'e010', // 深呼吸练习
      durationMinutes: 10,
      sets: 1,
      reps: 1,
      notes: '放松心情，专注于呼吸'
    }
  ],
  progress: {
    completedDays: 21,
    totalDays: 35,
    completionRate: 0.6,
    averageDurationMinutes: 28,
    strengthImprovement: 8, // 百分比
    balanceImprovement: 12, // 百分比
    lastUpdated: calculateDate(-1)
  }
};

// 用户1001的运动计划 - 已完成的基础力量训练计划
const user1001CompletedPlan = {
  id: generateRandomId(),
  userId: '1001',
  name: '基础力量训练计划',
  description: '针对肌少症患者的基础力量训练计划，主要针对上肢和下肢大肌群，提高基础力量。',
  startDate: calculateDate(-90), // 90天前开始
  endDate: calculateDate(-30),  // 30天前结束
  isActive: false,
  targetExerciseDaysPerWeek: 3,
  targetDurationMinutesPerDay: 20,
  targetCaloriesPerDay: 80,
  difficulty: 1, // 1-5，基础难度
  createdBy: 'doctor',
  createdAt: calculateDate(-95),
  updatedAt: calculateDate(-30),
  exercises: [
    {
      dayOfWeek: 1, // 周一
      exerciseId: 'e002', // 椅子坐立
      durationMinutes: 10,
      sets: 2,
      reps: 8,
      notes: '动作缓慢，注意呼吸'
    },
    {
      dayOfWeek: 3, // 周三
      exerciseId: 'e009', // 坐姿上肢训练
      durationMinutes: 10,
      sets: 2,
      reps: 10,
      notes: '使用轻量哑铃或水瓶代替'
    },
    {
      dayOfWeek: 5, // 周五
      exerciseId: 'e001', // 轻度步行
      durationMinutes: 20,
      sets: 1,
      reps: 1,
      notes: '慢速行走，注意安全'
    }
  ],
  progress: {
    completedDays: 18,
    totalDays: 21,
    completionRate: 0.86,
    averageDurationMinutes: 18,
    strengthImprovement: 5, // 百分比
    balanceImprovement: 3, // 百分比
    lastUpdated: calculateDate(-30)
  }
};

// 用户1001的运动计划 - 未开始的进阶平衡训练计划
const user1001FuturePlan = {
  id: generateRandomId(),
  userId: '1001',
  name: '进阶平衡训练计划',
  description: '在完成基础力量训练后，进一步提高平衡能力和核心稳定性，降低跌倒风险。',
  startDate: calculateDate(65), // 65天后开始
  endDate: calculateDate(125),  // 125天后结束
  isActive: false,
  targetExerciseDaysPerWeek: 4,
  targetDurationMinutesPerDay: 25,
  targetCaloriesPerDay: 100,
  difficulty: 3, // 1-5，中等难度
  createdBy: 'doctor',
  createdAt: calculateDate(-10),
  updatedAt: calculateDate(-10),
  exercises: [
    {
      dayOfWeek: 1, // 周一
      exerciseId: 'e007', // 站立平衡训练
      durationMinutes: 15,
      sets: 3,
      reps: 6,
      notes: '可在固定物体旁进行，确保安全'
    },
    {
      dayOfWeek: 2, // 周二
      exerciseId: 'e004', // 太极拳
      durationMinutes: 30,
      sets: 1,
      reps: 1,
      notes: '跟随视频指导，放松心情'
    },
    {
      dayOfWeek: 4, // 周四
      exerciseId: 'e007', // 站立平衡训练
      durationMinutes: 15,
      sets: 3,
      reps: 6,
      notes: '可在固定物体旁进行，确保安全'
    },
    {
      dayOfWeek: 6, // 周六
      exerciseId: 'e006', // 轻度瑜伽
      durationMinutes: 25,
      sets: 1,
      reps: 1,
      notes: '注重平衡和核心控制'
    }
  ],
  progress: {
    completedDays: 0,
    totalDays: 0,
    completionRate: 0,
    averageDurationMinutes: 0,
    strengthImprovement: 0,
    balanceImprovement: 0,
    lastUpdated: null
  }
};

// 用户1002的运动计划 - 活跃的初学者运动计划
const user1002ActivePlan = {
  id: generateRandomId(),
  userId: '1002',
  name: '肌少症初学者运动计划',
  description: '针对肌少症初期患者设计的简单运动计划，帮助建立运动习惯，提高日常活动能力。',
  startDate: calculateDate(-15), // 15天前开始
  endDate: calculateDate(45),   // 45天后结束
  isActive: true,
  targetExerciseDaysPerWeek: 3,
  targetDurationMinutesPerDay: 15,
  targetCaloriesPerDay: 60,
  difficulty: 1, // 1-5，基础难度
  createdBy: 'doctor',
  createdAt: calculateDate(-20),
  updatedAt: calculateDate(-15),
  exercises: [
    {
      dayOfWeek: 2, // 周二
      exerciseId: 'e010', // 深呼吸练习
      durationMinutes: 10,
      sets: 1,
      reps: 1,
      notes: '放松心情，专注于呼吸'
    },
    {
      dayOfWeek: 2, // 周二
      exerciseId: 'e009', // 坐姿上肢训练
      durationMinutes: 10,
      sets: 2,
      reps: 8,
      notes: '使用轻量哑铃，动作缓慢可控'
    },
    {
      dayOfWeek: 4, // 周四
      exerciseId: 'e001', // 轻度步行
      durationMinutes: 15,
      sets: 1,
      reps: 1,
      notes: '保持舒适速度，可在室内进行'
    },
    {
      dayOfWeek: 6, // 周六
      exerciseId: 'e002', // 椅子坐立
      durationMinutes: 10,
      sets: 2,
      reps: 8,
      notes: '每组间休息1-2分钟，注意保持正确姿势'
    }
  ],
  progress: {
    completedDays: 4,
    totalDays: 7,
    completionRate: 0.57,
    averageDurationMinutes: 12,
    strengthImprovement: 2, // 百分比
    balanceImprovement: 1, // 百分比
    lastUpdated: calculateDate(-2)
  }
};

// 合并所有运动计划
const exercisePlans = [
  user1001ActivePlan,
  user1001CompletedPlan,
  user1001FuturePlan,
  user1002ActivePlan
];

export default exercisePlans;
