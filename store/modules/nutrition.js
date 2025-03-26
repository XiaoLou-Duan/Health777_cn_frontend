/**
 * 营养模块状态管理
 */
import { NUTRITION_API } from '@/config/api.js';

const state = {
  // 今日摄入记录
  todayIntakes: [],
  // 每日蛋白质摄入统计
  proteinStats: {
    daily: [],
    weekly: [],
    monthly: []
  },
  // 食物识别历史
  recognitionHistory: [],
  // 饮食建议
  dietSuggestions: [],
  // 乳清蛋白提醒设置
  wheyProteinReminders: []
};

const getters = {
  // 获取今日摄入记录
  getTodayIntakes: state => state.todayIntakes,
  
  // 计算今日摄入蛋白质总量
  getTodayProteinTotal: state => {
    return state.todayIntakes.reduce((total, item) => {
      return total + (item.protein || 0);
    }, 0);
  },
  
  // 计算今日摄入卡路里总量
  getTodayCalorieTotal: state => {
    return state.todayIntakes.reduce((total, item) => {
      return total + (item.calories || 0);
    }, 0);
  },
  
  // 获取日蛋白质统计
  getDailyProteinStats: state => state.proteinStats.daily,
  
  // 获取周蛋白质统计
  getWeeklyProteinStats: state => state.proteinStats.weekly,
  
  // 获取月蛋白质统计
  getMonthlyProteinStats: state => state.proteinStats.monthly,
  
  // 获取食物识别历史
  getRecognitionHistory: state => state.recognitionHistory,
  
  // 获取饮食建议
  getDietSuggestions: state => state.dietSuggestions,
  
  // 获取乳清蛋白提醒设置
  getWheyProteinReminders: state => state.wheyProteinReminders
};

const mutations = {
  // 设置今日摄入记录
  SET_TODAY_INTAKES(state, intakes) {
    state.todayIntakes = intakes;
  },
  
  // 添加食物摄入记录
  ADD_FOOD_INTAKE(state, food) {
    state.todayIntakes.push(food);
  },
  
  // 删除食物摄入记录
  REMOVE_FOOD_INTAKE(state, id) {
    const index = state.todayIntakes.findIndex(item => item.id === id);
    if (index !== -1) {
      state.todayIntakes.splice(index, 1);
    }
  },
  
  // 设置蛋白质统计数据
  SET_PROTEIN_STATS(state, { type, data }) {
    state.proteinStats[type] = data;
  },
  
  // 设置食物识别历史
  SET_RECOGNITION_HISTORY(state, history) {
    state.recognitionHistory = history;
  },
  
  // 添加食物识别记录
  ADD_RECOGNITION_RECORD(state, record) {
    state.recognitionHistory.unshift(record);
  },
  
  // 设置饮食建议
  SET_DIET_SUGGESTIONS(state, suggestions) {
    state.dietSuggestions = suggestions;
  },
  
  // 设置乳清蛋白提醒
  SET_WHEY_PROTEIN_REMINDERS(state, reminders) {
    state.wheyProteinReminders = reminders;
  },
  
  // 添加乳清蛋白提醒
  ADD_WHEY_PROTEIN_REMINDER(state, reminder) {
    state.wheyProteinReminders.push(reminder);
  },
  
  // 更新乳清蛋白提醒
  UPDATE_WHEY_PROTEIN_REMINDER(state, { id, reminder }) {
    const index = state.wheyProteinReminders.findIndex(item => item.id === id);
    if (index !== -1) {
      state.wheyProteinReminders[index] = { ...state.wheyProteinReminders[index], ...reminder };
    }
  },
  
  // 删除乳清蛋白提醒
  REMOVE_WHEY_PROTEIN_REMINDER(state, id) {
    const index = state.wheyProteinReminders.findIndex(item => item.id === id);
    if (index !== -1) {
      state.wheyProteinReminders.splice(index, 1);
    }
  }
};

const actions = {
  // 获取今日摄入记录
  async getTodayIntakes({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.getTodayIntakes,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_TODAY_INTAKES', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取今日摄入记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 添加食物摄入记录
  async addFoodIntake({ commit, rootState }, food) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.addFoodIntake,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: food
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('ADD_FOOD_INTAKE', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('添加食物摄入记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 删除食物摄入记录
  async removeFoodIntake({ commit, rootState }, id) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${NUTRITION_API.removeFoodIntake}/${id}`,
        method: 'DELETE',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('REMOVE_FOOD_INTAKE', id);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('删除食物摄入记录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取蛋白质统计数据
  async getProteinStats({ commit, rootState }, type = 'daily') {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${NUTRITION_API.getProteinStats}?type=${type}`,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_PROTEIN_STATS', { type, data });
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取蛋白质统计数据失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 识别食物
  async recognizeFood({ commit, rootState }, image) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      // 上传图片
      const uploadRes = await uni.uploadFile({
        url: NUTRITION_API.uploadFoodImage,
        filePath: image,
        name: 'image',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const uploadData = JSON.parse(uploadRes.data);
      
      if (uploadData.code !== 0) {
        return { success: false, message: uploadData.message };
      }
      
      // 识别食物
      const response = await uni.request({
        url: NUTRITION_API.recognizeFood,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: { imageUrl: uploadData.data.url }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        // 添加到识别历史
        const record = {
          id: new Date().getTime(),
          imageUrl: uploadData.data.url,
          recognizedFood: data,
          timestamp: new Date().toISOString()
        };
        
        commit('ADD_RECOGNITION_RECORD', record);
        
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('识别食物失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取食物识别历史
  async getRecognitionHistory({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.getRecognitionHistory,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_RECOGNITION_HISTORY', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取食物识别历史失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取饮食建议
  async getDietSuggestions({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.getDietSuggestions,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_DIET_SUGGESTIONS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取饮食建议失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取乳清蛋白提醒
  async getWheyProteinReminders({ commit, rootState }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.getWheyProteinReminders,
        method: 'GET',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('SET_WHEY_PROTEIN_REMINDERS', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取乳清蛋白提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 添加乳清蛋白提醒
  async addWheyProteinReminder({ commit, rootState }, reminder) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: NUTRITION_API.addWheyProteinReminder,
        method: 'POST',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: reminder
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        commit('ADD_WHEY_PROTEIN_REMINDER', data);
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('添加乳清蛋白提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新乳清蛋白提醒
  async updateWheyProteinReminder({ commit, rootState }, { id, reminder }) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${NUTRITION_API.updateWheyProteinReminder}/${id}`,
        method: 'PUT',
        header: { 'Authorization': `Bearer ${rootState.user.token}` },
        data: reminder
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('UPDATE_WHEY_PROTEIN_REMINDER', { id, reminder });
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新乳清蛋白提醒失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 删除乳清蛋白提醒
  async removeWheyProteinReminder({ commit, rootState }, id) {
    if (!rootState.user.isLoggedIn) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: `${NUTRITION_API.removeWheyProteinReminder}/${id}`,
        method: 'DELETE',
        header: { 'Authorization': `Bearer ${rootState.user.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        commit('REMOVE_WHEY_PROTEIN_REMINDER', id);
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('删除乳清蛋白提醒失败', error);
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
