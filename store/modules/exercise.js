/**
 * 运动模块状态管理
 */
import { EXERCISE_API } from '@/config/api.js';

const state = {
  // 运动库
  exerciseLibrary: [],
  // 运动记录
  exerciseRecords: [],
  // 运动统计
  exerciseStats: {
    daily: [],
    weekly: [],
    monthly: []
  },
  // 运动计划
  exercisePlans: [],
  // 步数记录
  stepRecords: [],
  // 运动提醒
  exerciseReminders: []
};

const getters = {
  // 获取运动库
  getExerciseLibrary: state => state.exerciseLibrary,
  
  // 获取运动记录
  getExerciseRecords: state => state.exerciseRecords,
  
  // 获取今日运动记录
  getTodayExerciseRecords: state => {
    const today = new Date().toISOString().split('T')[0];
    return state.exerciseRecords.filter(record => {
      const recordDate = new Date(record.startTime).toISOString().split('T')[0];
      return recordDate === today;
    });
  },
  
  // 计算今日消耗卡路里
  getTodayCalorieBurned: state => {
    const today = new Date().toISOString().split('T')[0];
    return state.exerciseRecords.reduce((total, record) => {
      const recordDate = new Date(record.startTime).toISOString().split('T')[0];
      if (recordDate === today) {
        return total + (record.caloriesBurned || 0);
      }
      return total;
    }, 0);
  },
  
  // 计算今日运动时长（分钟）
  getTodayExerciseDuration: state => {
    const today = new Date().toISOString().split('T')[0];
    return state.exerciseRecords.reduce((total, record) => {
      const recordDate = new Date(record.startTime).toISOString().split('T')[0];
      if (recordDate === today) {
        return total + (record.durationMinutes || 0);
      }
      return total;
    }, 0);
  },
  
  // 获取日运动统计
  getDailyExerciseStats: state => state.exerciseStats.daily,
  
  // 获取周运动统计
  getWeeklyExerciseStats: state => state.exerciseStats.weekly,
  
  // 获取月运动统计
  getMonthlyExerciseStats: state => state.exerciseStats.monthly,
  
  // 获取运动计划
  getExercisePlans: state => state.exercisePlans,
  
  // 获取当前生效的运动计划
  getActiveExercisePlans: state => {
    const now = new Date();
    return state.exercisePlans.filter(plan => {
      const startDate = new Date(plan.startDate);
      const endDate = plan.endDate ? new Date(plan.endDate) : new Date(9999, 11, 31);
      return plan.isActive && startDate <= now && now <= endDate;
    });
  },
  
  // 获取步数记录
  getStepRecords: state => state.stepRecords,
  
  // 获取今日步数
  getTodaySteps: state => {
    const today = new Date().toISOString().split('T')[0];
    const record = state.stepRecords.find(record => record.date === today);
    return record ? record.steps : 0;
  },
  
  // 获取运动提醒
  getExerciseReminders: state => state.exerciseReminders,
  
  // 获取今日运动提醒
  getTodayExerciseReminders: state => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 将0(周日)转为7
    
    return state.exerciseReminders.filter(reminder => {
      return reminder.enabled && reminder.daysOfWeek.includes(dayOfWeek);
    });
  }
};

const mutations = {
  // 设置运动库
  SET_EXERCISE_LIBRARY(state, library) {
    state.exerciseLibrary = library;
  },
  
  // 设置运动记录
  SET_EXERCISE_RECORDS(state, records) {
    state.exerciseRecords = records;
  },
  
  // 添加运动记录
  ADD_EXERCISE_RECORD(state, record) {
    state.exerciseRecords.push(record);
  },
  
  // 更新运动记录
  UPDATE_EXERCISE_RECORD(state, { id, record }) {
    const index = state.exerciseRecords.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exerciseRecords[index] = { ...state.exerciseRecords[index], ...record };
    }
  },
  
  // 删除运动记录
  REMOVE_EXERCISE_RECORD(state, id) {
    const index = state.exerciseRecords.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exerciseRecords.splice(index, 1);
    }
  },
  
  // 设置运动统计
  SET_EXERCISE_STATS(state, { type, data }) {
    state.exerciseStats[type] = data;
  },
  
  // 设置运动计划
  SET_EXERCISE_PLANS(state, plans) {
    state.exercisePlans = plans;
  },
  
  // 添加运动计划
  ADD_EXERCISE_PLAN(state, plan) {
    state.exercisePlans.push(plan);
  },
  
  // 更新运动计划
  UPDATE_EXERCISE_PLAN(state, { id, plan }) {
    const index = state.exercisePlans.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exercisePlans[index] = { ...state.exercisePlans[index], ...plan };
    }
  },
  
  // 删除运动计划
  REMOVE_EXERCISE_PLAN(state, id) {
    const index = state.exercisePlans.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exercisePlans.splice(index, 1);
    }
  },
  
  // 设置步数记录
  SET_STEP_RECORDS(state, records) {
    state.stepRecords = records;
  },
  
  // 更新今日步数
  UPDATE_TODAY_STEPS(state, steps) {
    const today = new Date().toISOString().split('T')[0];
    const index = state.stepRecords.findIndex(record => record.date === today);
    
    if (index !== -1) {
      state.stepRecords[index].steps = steps;
      state.stepRecords[index].updateTime = new Date().toISOString();
    } else {
      state.stepRecords.push({
        date: today,
        steps,
        updateTime: new Date().toISOString()
      });
    }
  },
  
  // 设置运动提醒
  SET_EXERCISE_REMINDERS(state, reminders) {
    state.exerciseReminders = reminders;
  },
  
  // 添加运动提醒
  ADD_EXERCISE_REMINDER(state, reminder) {
    state.exerciseReminders.push(reminder);
  },
  
  // 更新运动提醒
  UPDATE_EXERCISE_REMINDER(state, { id, reminder }) {
    const index = state.exerciseReminders.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exerciseReminders[index] = { ...state.exerciseReminders[index], ...reminder };
    }
  },
  
  // 删除运动提醒
  REMOVE_EXERCISE_REMINDER(state, id) {
    const index = state.exerciseReminders.findIndex(item => item.id === id);
    if (index !== -1) {
      state.exerciseReminders.splice(index, 1);
    }
  }
};

const actions = {
  // 获取运动库
  async getExerciseLibrary({ commit, rootState }, { category, keyword, page = 1, pageSize = 10 } = {}) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      let url = `${EXERCISE_API.getExerciseLibrary}?page=${page}&pageSize=${pageSize}`;
      if (category) url += `&category=${category}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      
      const response = await uni.request({
        url,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        // 只更新运动库，不覆盖分页信息
        commit('SET_EXERCISE_LIBRARY', data.list);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取运动库失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取运动记录
  async getExerciseRecords({ commit, rootState }, { startDate, endDate } = {}) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      let url = EXERCISE_API.getExerciseRecords;
      if (startDate) url += `?startDate=${startDate}`;
      if (endDate) url += `${startDate ? '&' : '?'}endDate=${endDate}`;
      
      const response = await uni.request({
        url,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_EXERCISE_RECORDS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取运动记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 添加运动记录
  async addExerciseRecord({ commit, rootState }, record) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.addExerciseRecord,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: record
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('ADD_EXERCISE_RECORD', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('添加运动记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新运动记录
  async updateExerciseRecord({ commit, rootState }, { id, record }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.updateExerciseRecord}/${id}`,
        method: 'PUT',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: record
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('UPDATE_EXERCISE_RECORD', { id, record });
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新运动记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 删除运动记录
  async removeExerciseRecord({ commit, rootState }, id) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.removeExerciseRecord}/${id}`,
        method: 'DELETE',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('REMOVE_EXERCISE_RECORD', id);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('删除运动记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取运动统计
  async getExerciseStats({ commit, rootState }, type = 'daily') {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.getExerciseStats}?type=${type}`,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_EXERCISE_STATS', { type, data });
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取运动统计失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取运动计划
  async getExercisePlans({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.getExercisePlans,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_EXERCISE_PLANS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取运动计划失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 添加运动计划
  async addExercisePlan({ commit, rootState }, plan) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.addExercisePlan,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: plan
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('ADD_EXERCISE_PLAN', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('添加运动计划失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新运动计划
  async updateExercisePlan({ commit, rootState }, { id, plan }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.updateExercisePlan}/${id}`,
        method: 'PUT',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: plan
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('UPDATE_EXERCISE_PLAN', { id, plan });
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新运动计划失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 删除运动计划
  async removeExercisePlan({ commit, rootState }, id) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.removeExercisePlan}/${id}`,
        method: 'DELETE',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('REMOVE_EXERCISE_PLAN', id);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('删除运动计划失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取步数记录
  async getStepRecords({ commit, rootState }, { startDate, endDate } = {}) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      let url = EXERCISE_API.getStepRecords;
      if (startDate) url += `?startDate=${startDate}`;
      if (endDate) url += `${startDate ? '&' : '?'}endDate=${endDate}`;
      
      const response = await uni.request({
        url,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_STEP_RECORDS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取步数记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新今日步数
  async updateTodaySteps({ commit, rootState }, steps) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.updateTodaySteps,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: { steps }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('UPDATE_TODAY_STEPS', steps);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新今日步数失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取运动提醒
  async getExerciseReminders({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.getExerciseReminders,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_EXERCISE_REMINDERS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取运动提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 添加运动提醒
  async addExerciseReminder({ commit, rootState }, reminder) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: EXERCISE_API.addExerciseReminder,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: reminder
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('ADD_EXERCISE_REMINDER', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('添加运动提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新运动提醒
  async updateExerciseReminder({ commit, rootState }, { id, reminder }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.updateExerciseReminder}/${id}`,
        method: 'PUT',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: reminder
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('UPDATE_EXERCISE_REMINDER', { id, reminder });
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新运动提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 删除运动提醒
  async removeExerciseReminder({ commit, rootState }, id) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${EXERCISE_API.removeExerciseReminder}/${id}`,
        method: 'DELETE',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('REMOVE_EXERCISE_REMINDER', id);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('删除运动提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
