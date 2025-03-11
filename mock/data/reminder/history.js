/**
 * mock/data/reminder/history.js - 提醒历史数据
 * 
 * 提供用户的提醒历史记录数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 生成过去7天的日期数组
const generatePastDays = (days) => {
  const result = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    result.push(pastDate.toISOString().split('T')[0]);
  }
  return result;
};

const pastDays = generatePastDays(7);

// 提醒历史记录 
// 为了方便数据模拟，这里只生成了最近7天的提醒历史数据
const reminderHistory = [];

// 提醒类型的配置数据
const reminderTypeConfigs = [
  {
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    times: ['08:00', '12:00', '18:00'],
    titles: ['早餐记录提醒', '午餐记录提醒', '晚餐记录提醒'],
    contents: ['请记得拍照记录您的早餐', '请记得拍照记录您的午餐', '请记得拍照记录您的晚餐'],
    completionRate: 0.9 // 完成概率
  },
  {
    typeId: 'type002',
    typeName: '乳清蛋白摄入',
    typeCode: 'protein_intake',
    icon: '/static/icons/reminders/protein.png',
    times: ['08:00', '17:30'],
    titles: ['早间乳清蛋白提醒', '晚间乳清蛋白提醒'],
    contents: ['请记得补充您的乳清蛋白', '请记得补充您的乳清蛋白'],
    completionRate: 0.85
  },
  {
    typeId: 'type003',
    typeName: '运动提醒',
    typeCode: 'exercise',
    icon: '/static/icons/reminders/exercise.png',
    times: ['09:30', '16:00'],
    titles: ['上午锻炼提醒', '下午锻炼提醒'],
    contents: ['现在是进行锻炼的好时间', '现在是进行锻炼的好时间'],
    completionRate: 0.7
  },
  {
    typeId: 'type004',
    typeName: '服药提醒',
    typeCode: 'medicine',
    icon: '/static/icons/reminders/medicine.png',
    times: ['08:00', '12:00', '18:00'],
    titles: ['早间服药提醒', '午间服药提醒', '晚间服药提醒'],
    contents: ['请记得服用您的早间药物', '请记得服用您的午间药物', '请记得服用您的晚间药物'],
    completionRate: 0.95
  },
  {
    typeId: 'type005',
    typeName: '喝水提醒',
    typeCode: 'water',
    icon: '/static/icons/reminders/water.png',
    times: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    titles: ['喝水提醒', '喝水提醒', '喝水提醒', '喝水提醒', '喝水提醒', '喝水提醒', '喝水提醒'],
    contents: ['请记得补充水分', '请记得补充水分', '请记得补充水分', '请记得补充水分', '请记得补充水分', '请记得补充水分', '请记得补充水分'],
    completionRate: 0.6
  }
];

// 生成历史提醒数据
pastDays.forEach(date => {
  reminderTypeConfigs.forEach(typeConfig => {
    typeConfig.times.forEach((time, index) => {
      // 随机决定该提醒是否完成
      const isCompleted = Math.random() < typeConfig.completionRate;
      // 生成完成时间（在计划时间后的1-15分钟内）
      const scheduledTime = `${date}T${time}:00.000Z`;
      const scheduledDate = new Date(scheduledTime);
      
      // 随机生成完成时间（如果完成）
      let completedTime = null;
      let status = 'missed';
      
      if (isCompleted) {
        const completedDate = new Date(scheduledDate);
        completedDate.setMinutes(completedDate.getMinutes() + Math.floor(Math.random() * 15) + 1);
        completedTime = completedDate.toISOString();
        status = 'completed';
      }
      
      // 创建提醒历史记录
      reminderHistory.push({
        id: generateRandomId(),
        reminderId: generateRandomId(), // 关联的提醒ID
        userId: '1001',
        typeId: typeConfig.typeId,
        typeName: typeConfig.typeName,
        typeCode: typeConfig.typeCode,
        icon: typeConfig.icon,
        title: typeConfig.titles[index % typeConfig.titles.length],
        content: typeConfig.contents[index % typeConfig.contents.length],
        scheduledTime,
        status,
        completedTime,
        isRead: true
      });
    });
  });
});

// 提醒历史统计数据
// 按类型、日期统计完成率
const calculateCompletionRates = (history) => {
  const result = {
    totalStats: {
      total: 0,
      completed: 0,
      missed: 0,
      rate: 0
    },
    typeStats: {},
    dailyStats: {}
  };
  
  // 统计总数据
  result.totalStats.total = history.length;
  result.totalStats.completed = history.filter(h => h.status === 'completed').length;
  result.totalStats.missed = history.filter(h => h.status === 'missed').length;
  result.totalStats.rate = result.totalStats.total > 0 
    ? result.totalStats.completed / result.totalStats.total 
    : 0;
  
  // 按类型统计
  const typeGroups = history.reduce((groups, item) => {
    if (!groups[item.typeCode]) {
      groups[item.typeCode] = [];
    }
    groups[item.typeCode].push(item);
    return groups;
  }, {});
  
  Object.keys(typeGroups).forEach(typeCode => {
    const items = typeGroups[typeCode];
    result.typeStats[typeCode] = {
      total: items.length,
      completed: items.filter(h => h.status === 'completed').length,
      missed: items.filter(h => h.status === 'missed').length,
      rate: items.length > 0 
        ? items.filter(h => h.status === 'completed').length / items.length 
        : 0
    };
  });
  
  // 按日期统计
  const dateGroups = history.reduce((groups, item) => {
    const date = item.scheduledTime.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
  
  Object.keys(dateGroups).forEach(date => {
    const items = dateGroups[date];
    result.dailyStats[date] = {
      total: items.length,
      completed: items.filter(h => h.status === 'completed').length,
      missed: items.filter(h => h.status === 'missed').length,
      rate: items.length > 0 
        ? items.filter(h => h.status === 'completed').length / items.length 
        : 0
    };
  });
  
  return result;
};

const reminderStats = calculateCompletionRates(reminderHistory);

export default {
  reminderHistory,
  reminderStats
};
