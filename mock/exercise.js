/**
 * mock/exercise.js - 运动模块API模拟
 * 
 * 提供运动模块的API接口模拟
 */

import { 
  mockRequest, 
  successResponse, 
  errorResponse, 
  generateRandomId,
  checkTokenValid
} from './utils/mock-helper';

// 导入运动模块数据
import exerciseData from './data/exercise/index';

// 获取运动库
const getExerciseLibrary = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { keyword, category, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredData = [...exerciseData.exerciseLibrary];
  
  // 关键词过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword) || 
      item.description.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 类别过滤
  if (category) {
    filteredData = filteredData.filter(item => item.category === category);
  }
  
  // 计算分页
  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredData.slice(startIndex, endIndex);
  
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

// 获取运动记录
const getExerciseRecords = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { startDate, endDate } = params.data || {};
  
  let filteredRecords = exerciseData.exerciseRecords.filter(record => record.userId === userId);
  
  // 日期范围过滤
  if (startDate) {
    filteredRecords = filteredRecords.filter(record => {
      const recordDate = record.startTime.split('T')[0];
      return recordDate >= startDate;
    });
  }
  
  if (endDate) {
    filteredRecords = filteredRecords.filter(record => {
      const recordDate = record.startTime.split('T')[0];
      return recordDate <= endDate;
    });
  }
  
  // 按时间倒序排序
  filteredRecords.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  
  return successResponse(filteredRecords);
});

// 添加运动记录
const addExerciseRecord = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const recordData = params.data || {};
  
  if (!recordData.exerciseId) {
    return errorResponse(400, '运动项目ID不能为空');
  }
  
  if (!recordData.startTime) {
    return errorResponse(400, '开始时间不能为空');
  }
  
  if (!recordData.durationMinutes) {
    return errorResponse(400, '运动时长不能为空');
  }
  
  // 创建新记录
  const newRecord = {
    id: generateRandomId(),
    userId,
    ...recordData,
    // 如果没有提供结束时间，则根据开始时间和时长计算
    endTime: recordData.endTime || (() => {
      const end = new Date(recordData.startTime);
      end.setMinutes(end.getMinutes() + parseInt(recordData.durationMinutes));
      return end.toISOString();
    })()
  };
  
  // 添加到数据集
  exerciseData.exerciseRecords.unshift(newRecord);
  
  return successResponse(newRecord);
});

// 更新运动记录
const updateExerciseRecord = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  const recordData = params.data || {};
  
  // 查找记录
  const recordIndex = exerciseData.exerciseRecords.findIndex(
    record => record.id === id && record.userId === userId
  );
  
  if (recordIndex === -1) {
    return errorResponse(404, '未找到该运动记录');
  }
  
  // 更新记录
  exerciseData.exerciseRecords[recordIndex] = {
    ...exerciseData.exerciseRecords[recordIndex],
    ...recordData,
    // 如果更新了开始时间或时长，但没有提供结束时间，则重新计算结束时间
    endTime: recordData.endTime || (recordData.startTime || recordData.durationMinutes) ? (() => {
      const startTime = recordData.startTime || exerciseData.exerciseRecords[recordIndex].startTime;
      const durationMinutes = recordData.durationMinutes || exerciseData.exerciseRecords[recordIndex].durationMinutes;
      const end = new Date(startTime);
      end.setMinutes(end.getMinutes() + parseInt(durationMinutes));
      return end.toISOString();
    })() : exerciseData.exerciseRecords[recordIndex].endTime
  };
  
  return successResponse(null, '运动记录更新成功');
});

// 删除运动记录
const removeExerciseRecord = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找记录
  const recordIndex = exerciseData.exerciseRecords.findIndex(
    record => record.id === id && record.userId === userId
  );
  
  if (recordIndex === -1) {
    return errorResponse(404, '未找到该运动记录');
  }
  
  // 删除记录
  exerciseData.exerciseRecords.splice(recordIndex, 1);
  
  return successResponse(null, '运动记录删除成功');
});

// 获取运动统计
const getExerciseStats = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { type = 'daily' } = params.data || {};
  
  if (!['daily', 'weekly', 'monthly'].includes(type)) {
    return errorResponse(400, '统计类型不正确，应为daily、weekly或monthly');
  }
  
  // 获取对应类型的统计数据
  const filteredStats = exerciseData.exerciseStats[type].filter(stat => stat.userId === userId);
  
  // 按日期/周/月份降序排序
  if (type === 'daily') {
    filteredStats.sort((a, b) => b.date.localeCompare(a.date));
  } else if (type === 'weekly') {
    filteredStats.sort((a, b) => {
      return b.year !== a.year ? b.year - a.year : b.week - a.week;
    });
  } else { // monthly
    filteredStats.sort((a, b) => {
      return b.year !== a.year ? b.year - a.year : b.month - a.month;
    });
  }
  
  return successResponse(filteredStats);
});

// 获取运动计划
const getExercisePlans = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 过滤出用户的运动计划
  const userPlans = exerciseData.exercisePlans.filter(plan => plan.userId === userId);
  
  // 按开始日期降序排序
  userPlans.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  
  return successResponse(userPlans);
});

// 添加运动计划
const addExercisePlan = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const planData = params.data || {};
  
  if (!planData.name) {
    return errorResponse(400, '计划名称不能为空');
  }
  
  if (!planData.startDate) {
    return errorResponse(400, '开始日期不能为空');
  }
  
  // 创建新计划
  const newPlan = {
    id: generateRandomId(),
    userId,
    ...planData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
  
  // 添加到数据集
  exerciseData.exercisePlans.push(newPlan);
  
  return successResponse(newPlan);
});

// 更新运动计划
const updateExercisePlan = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  const planData = params.data || {};
  
  // 查找计划
  const planIndex = exerciseData.exercisePlans.findIndex(
    plan => plan.id === id && plan.userId === userId
  );
  
  if (planIndex === -1) {
    return errorResponse(404, '未找到该运动计划');
  }
  
  // 更新计划
  exerciseData.exercisePlans[planIndex] = {
    ...exerciseData.exercisePlans[planIndex],
    ...planData,
    updatedAt: new Date().toISOString()
  };
  
  return successResponse(null, '运动计划更新成功');
});

// 删除运动计划
const removeExercisePlan = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找计划
  const planIndex = exerciseData.exercisePlans.findIndex(
    plan => plan.id === id && plan.userId === userId
  );
  
  if (planIndex === -1) {
    return errorResponse(404, '未找到该运动计划');
  }
  
  // 删除计划
  exerciseData.exercisePlans.splice(planIndex, 1);
  
  return successResponse(null, '运动计划删除成功');
});

// 获取步数记录
const getStepRecords = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { startDate, endDate } = params.data || {};
  
  let filteredRecords = exerciseData.stepRecords.filter(record => record.userId === userId);
  
  // 日期范围过滤
  if (startDate) {
    filteredRecords = filteredRecords.filter(record => record.date >= startDate);
  }
  
  if (endDate) {
    filteredRecords = filteredRecords.filter(record => record.date <= endDate);
  }
  
  // 按日期降序排序
  filteredRecords.sort((a, b) => b.date.localeCompare(a.date));
  
  return successResponse(filteredRecords);
});

// 更新今日步数
const updateTodaySteps = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { steps } = params.data || {};
  
  if (steps === undefined || steps === null) {
    return errorResponse(400, '步数不能为空');
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // 查找今日记录
  const recordIndex = exerciseData.stepRecords.findIndex(
    record => record.userId === userId && record.date === today
  );
  
  if (recordIndex === -1) {
    // 添加新记录
    const targetSteps = 6000; // 默认目标步数
    exerciseData.stepRecords.push({
      userId,
      date: today,
      steps: parseInt(steps),
      targetSteps,
      reachedTarget: parseInt(steps) >= targetSteps,
      updateTime: new Date().toISOString(),
      source: 'manual',
      deviceType: '手动录入'
    });
  } else {
    // 更新记录
    const record = exerciseData.stepRecords[recordIndex];
    exerciseData.stepRecords[recordIndex] = {
      ...record,
      steps: parseInt(steps),
      reachedTarget: parseInt(steps) >= record.targetSteps,
      updateTime: new Date().toISOString()
    };
  }
  
  return successResponse(null, '今日步数更新成功');
});

// 获取运动提醒
const getExerciseReminders = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 过滤出用户的运动提醒
  const userReminders = exerciseData.exerciseReminders.filter(reminder => reminder.userId === userId);
  
  // 按时间排序
  userReminders.sort((a, b) => {
    // 先按启用状态排序
    if (a.enabled !== b.enabled) return b.enabled ? 1 : -1;
    
    // 再按时间排序
    return a.time.localeCompare(b.time);
  });
  
  return successResponse(userReminders);
});

// 添加运动提醒
const addExerciseReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const reminderData = params.data || {};
  
  if (!reminderData.title) {
    return errorResponse(400, '提醒标题不能为空');
  }
  
  if (!reminderData.time) {
    return errorResponse(400, '提醒时间不能为空');
  }
  
  if (!reminderData.exerciseId) {
    return errorResponse(400, '运动项目不能为空');
  }
  
  if (!reminderData.daysOfWeek || !reminderData.daysOfWeek.length) {
    return errorResponse(400, '重复日期不能为空');
  }
  
  // 创建新提醒
  const newReminder = {
    id: generateRandomId(),
    userId,
    ...reminderData,
    enabled: reminderData.enabled !== false, // 默认启用
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 添加到数据集
  exerciseData.exerciseReminders.push(newReminder);
  
  return successResponse(newReminder);
});

// 更新运动提醒
const updateExerciseReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  const reminderData = params.data || {};
  
  // 查找提醒
  const reminderIndex = exerciseData.exerciseReminders.findIndex(
    reminder => reminder.id === id && reminder.userId === userId
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '未找到该运动提醒');
  }
  
  // 更新提醒
  exerciseData.exerciseReminders[reminderIndex] = {
    ...exerciseData.exerciseReminders[reminderIndex],
    ...reminderData,
    updatedAt: new Date().toISOString()
  };
  
  return successResponse(null, '运动提醒更新成功');
});

// 删除运动提醒
const removeExerciseReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找提醒
  const reminderIndex = exerciseData.exerciseReminders.findIndex(
    reminder => reminder.id === id && reminder.userId === userId
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '未找到该运动提醒');
  }
  
  // 删除提醒
  exerciseData.exerciseReminders.splice(reminderIndex, 1);
  
  return successResponse(null, '运动提醒删除成功');
});

export default {
  getExerciseLibrary,
  getExerciseRecords,
  addExerciseRecord,
  updateExerciseRecord,
  removeExerciseRecord,
  getExerciseStats,
  getExercisePlans,
  addExercisePlan,
  updateExercisePlan,
  removeExercisePlan,
  getStepRecords,
  updateTodaySteps,
  getExerciseReminders,
  addExerciseReminder,
  updateExerciseReminder,
  removeExerciseReminder
};
