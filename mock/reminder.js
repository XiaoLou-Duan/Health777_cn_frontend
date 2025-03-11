/**
 * mock/reminder.js - 提醒系统API模拟
 * 
 * 提供提醒系统的API接口模拟
 */

import { 
  mockRequest, 
  successResponse, 
  errorResponse, 
  generateRandomId,
  checkTokenValid
} from './utils/mock-helper';

// 导入提醒系统数据
import reminderData from './data/reminder/index';

/**
 * 获取提醒类型列表
 */
const getReminderTypes = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  return successResponse(reminderData.reminders.reminderTypes);
});

/**
 * 获取用户提醒配置
 */
const getUserReminders = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId } = params.data || {};
  if (!userId) {
    return errorResponse(400, '缺少用户ID参数');
  }
  
  // 根据用户ID筛选提醒
  const userReminders = reminderData.reminders.userReminders.filter(
    reminder => reminder.userId === userId
  );
  
  return successResponse(userReminders);
});

/**
 * 创建提醒
 */
const createReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { 
    userId, typeId, typeName, typeCode, icon, 
    title, content, times, daysOfWeek, isEnabled 
  } = params.data || {};
  
  // 参数验证
  if (!userId || !typeId || !title || !times || !Array.isArray(times) || times.length === 0) {
    return errorResponse(400, '提醒信息不完整');
  }
  
  // 创建新提醒
  const newReminder = {
    id: generateRandomId(),
    userId,
    typeId,
    typeName,
    typeCode,
    icon,
    title,
    content,
    times,
    daysOfWeek: daysOfWeek || [1, 2, 3, 4, 5, 6, 7],
    isEnabled: isEnabled !== undefined ? isEnabled : true,
    createTime: new Date().toISOString()
  };
  
  // 添加到提醒列表中
  reminderData.reminders.userReminders.push(newReminder);
  
  return successResponse(newReminder);
});

/**
 * 更新提醒
 */
const updateReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id, title, content, times, daysOfWeek, isEnabled } = params.data || {};
  
  // 参数验证
  if (!id) {
    return errorResponse(400, '缺少提醒ID');
  }
  
  // 查找提醒
  const reminderIndex = reminderData.reminders.userReminders.findIndex(
    reminder => reminder.id === id
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '提醒不存在');
  }
  
  // 更新提醒信息
  const updatedReminder = {
    ...reminderData.reminders.userReminders[reminderIndex]
  };
  
  if (title !== undefined) {
    updatedReminder.title = title;
  }
  
  if (content !== undefined) {
    updatedReminder.content = content;
  }
  
  if (times !== undefined && Array.isArray(times) && times.length > 0) {
    updatedReminder.times = times;
  }
  
  if (daysOfWeek !== undefined && Array.isArray(daysOfWeek)) {
    updatedReminder.daysOfWeek = daysOfWeek;
  }
  
  if (isEnabled !== undefined) {
    updatedReminder.isEnabled = isEnabled;
  }
  
  // 更新数据
  reminderData.reminders.userReminders[reminderIndex] = updatedReminder;
  
  return successResponse(updatedReminder);
});

/**
 * 删除提醒
 */
const deleteReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.data || {};
  
  // 参数验证
  if (!id) {
    return errorResponse(400, '缺少提醒ID');
  }
  
  // 查找提醒
  const reminderIndex = reminderData.reminders.userReminders.findIndex(
    reminder => reminder.id === id
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '提醒不存在');
  }
  
  // 删除提醒
  const deletedReminder = reminderData.reminders.userReminders.splice(reminderIndex, 1)[0];
  
  return successResponse({ id: deletedReminder.id });
});

/**
 * 获取今日提醒列表
 */
const getTodayReminders = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId, status } = params.data || {};
  
  if (!userId) {
    return errorResponse(400, '缺少用户ID参数');
  }
  
  // 根据用户ID筛选提醒
  let filteredReminders = reminderData.reminders.todayReminders.filter(
    reminder => reminder.userId === userId
  );
  
  // 根据状态筛选
  if (status) {
    filteredReminders = filteredReminders.filter(reminder => reminder.status === status);
  }
  
  return successResponse(filteredReminders);
});

/**
 * 标记提醒为已完成
 */
const completeReminder = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.data || {};
  
  // 参数验证
  if (!id) {
    return errorResponse(400, '缺少提醒ID');
  }
  
  // 查找提醒
  const reminderIndex = reminderData.reminders.todayReminders.findIndex(
    reminder => reminder.id === id
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '提醒不存在');
  }
  
  // 更新提醒状态
  const updatedReminder = {
    ...reminderData.reminders.todayReminders[reminderIndex],
    status: 'completed',
    completedTime: new Date().toISOString(),
    isRead: true
  };
  
  // 更新数据
  reminderData.reminders.todayReminders[reminderIndex] = updatedReminder;
  
  return successResponse(updatedReminder);
});

/**
 * 标记提醒为已读
 */
const markReminderAsRead = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.data || {};
  
  // 参数验证
  if (!id) {
    return errorResponse(400, '缺少提醒ID');
  }
  
  // 查找提醒
  const reminderIndex = reminderData.reminders.todayReminders.findIndex(
    reminder => reminder.id === id
  );
  
  if (reminderIndex === -1) {
    return errorResponse(404, '提醒不存在');
  }
  
  // 更新提醒状态
  const updatedReminder = {
    ...reminderData.reminders.todayReminders[reminderIndex],
    isRead: true
  };
  
  // 更新数据
  reminderData.reminders.todayReminders[reminderIndex] = updatedReminder;
  
  return successResponse(updatedReminder);
});

/**
 * 获取提醒历史记录
 */
const getReminderHistory = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId, startDate, endDate, typeCode, page = 1, pageSize = 20 } = params.data || {};
  
  if (!userId) {
    return errorResponse(400, '缺少用户ID参数');
  }
  
  // 根据用户ID筛选提醒历史
  let filteredHistory = reminderData.history.reminderHistory.filter(
    record => record.userId === userId
  );
  
  // 按日期筛选
  if (startDate) {
    filteredHistory = filteredHistory.filter(
      record => record.scheduledTime.split('T')[0] >= startDate
    );
  }
  
  if (endDate) {
    filteredHistory = filteredHistory.filter(
      record => record.scheduledTime.split('T')[0] <= endDate
    );
  }
  
  // 按类型筛选
  if (typeCode) {
    filteredHistory = filteredHistory.filter(
      record => record.typeCode === typeCode
    );
  }
  
  // 排序：按时间降序
  filteredHistory.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
  
  // 分页
  const total = filteredHistory.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const records = filteredHistory.slice(startIndex, endIndex);
  
  return successResponse({
    records,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  });
});

/**
 * 获取提醒统计数据
 */
const getReminderStats = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId, startDate, endDate } = params.data || {};
  
  if (!userId) {
    return errorResponse(400, '缺少用户ID参数');
  }
  
  // 筛选出用户的历史记录
  const userHistory = reminderData.history.reminderHistory.filter(
    record => record.userId === userId
  );
  
  // 按日期筛选
  let filteredHistory = userHistory;
  
  if (startDate) {
    filteredHistory = filteredHistory.filter(
      record => record.scheduledTime.split('T')[0] >= startDate
    );
  }
  
  if (endDate) {
    filteredHistory = filteredHistory.filter(
      record => record.scheduledTime.split('T')[0] <= endDate
    );
  }
  
  // 重新计算统计数据
  const stats = {
    totalStats: {
      total: filteredHistory.length,
      completed: filteredHistory.filter(h => h.status === 'completed').length,
      missed: filteredHistory.filter(h => h.status === 'missed').length,
      rate: filteredHistory.length > 0 
        ? filteredHistory.filter(h => h.status === 'completed').length / filteredHistory.length 
        : 0
    },
    typeStats: {},
    dailyStats: {}
  };
  
  // 按类型统计
  const typeGroups = filteredHistory.reduce((groups, item) => {
    if (!groups[item.typeCode]) {
      groups[item.typeCode] = [];
    }
    groups[item.typeCode].push(item);
    return groups;
  }, {});
  
  Object.keys(typeGroups).forEach(typeCode => {
    const items = typeGroups[typeCode];
    stats.typeStats[typeCode] = {
      total: items.length,
      completed: items.filter(h => h.status === 'completed').length,
      missed: items.filter(h => h.status === 'missed').length,
      rate: items.length > 0 
        ? items.filter(h => h.status === 'completed').length / items.length 
        : 0
    };
  });
  
  // 按日期统计
  const dateGroups = filteredHistory.reduce((groups, item) => {
    const date = item.scheduledTime.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
  
  Object.keys(dateGroups).forEach(date => {
    const items = dateGroups[date];
    stats.dailyStats[date] = {
      total: items.length,
      completed: items.filter(h => h.status === 'completed').length,
      missed: items.filter(h => h.status === 'missed').length,
      rate: items.length > 0 
        ? items.filter(h => h.status === 'completed').length / items.length 
        : 0
    };
  });
  
  return successResponse(stats);
});

/**
 * 获取提醒设置
 */
const getReminderSettings = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId } = params.data || {};
  
  if (!userId) {
    return errorResponse(400, '缺少用户ID参数');
  }
  
  // 查找用户的提醒设置
  const userSettings = reminderData.settings.reminderSettings.find(
    setting => setting.userId === userId
  );
  
  if (!userSettings) {
    return errorResponse(404, '用户提醒设置不存在');
  }
  
  return successResponse(userSettings.settings);
});

/**
 * 更新提醒设置
 */
const updateReminderSettings = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { userId, settings } = params.data || {};
  
  if (!userId || !settings) {
    return errorResponse(400, '参数不完整');
  }
  
  // 查找用户的提醒设置
  const settingIndex = reminderData.settings.reminderSettings.findIndex(
    setting => setting.userId === userId
  );
  
  if (settingIndex === -1) {
    // 创建新的设置
    const newSetting = {
      userId,
      settings
    };
    reminderData.settings.reminderSettings.push(newSetting);
    return successResponse(settings);
  }
  
  // 更新设置
  reminderData.settings.reminderSettings[settingIndex].settings = {
    ...reminderData.settings.reminderSettings[settingIndex].settings,
    ...settings
  };
  
  return successResponse(reminderData.settings.reminderSettings[settingIndex].settings);
});

// 导出API
export default {
  getReminderTypes,
  getUserReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getTodayReminders,
  completeReminder,
  markReminderAsRead,
  getReminderHistory,
  getReminderStats,
  getReminderSettings,
  updateReminderSettings
};
