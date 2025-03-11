/**
 * 用户模块状态管理
 */
import { USER_API } from '@/config/api.js';

const state = {
  // 登录状态
  isLoggedIn: false,
  // 用户令牌
  token: '',
  // 用户信息
  userInfo: null,
  // 健康档案
  healthProfile: null,
  // 偏好设置
  preferences: null
};

const getters = {
  // 是否已登录
  isLoggedIn: state => state.isLoggedIn,
  // 获取用户信息
  getUserInfo: state => state.userInfo,
  // 获取用户健康档案
  getHealthProfile: state => state.healthProfile,
  // 获取用户偏好设置
  getPreferences: state => state.preferences,
  // 获取用户姓名
  getUserName: state => state.userInfo ? state.userInfo.nickname || state.userInfo.username : '游客',
  // 获取用户头像
  getUserAvatar: state => state.userInfo ? state.userInfo.avatar : '/static/images/default-avatar.png',
  // 获取用户年龄
  getUserAge: state => {
    if (!state.healthProfile) return 0;
    const birthDate = new Date(state.healthProfile.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },
  // 获取日蛋白质目标
  getDailyProteinTarget: state => {
    if (!state.healthProfile) return 0;
    // 根据体重计算蛋白质需求量（一般为每公斤体重1.2-1.5g蛋白质）
    const weight = state.healthProfile.weight || 60;
    return Math.round(weight * 1.3);
  }
};

const mutations = {
  // 设置登录状态
  SET_LOGIN_STATE(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  },
  
  // 设置用户令牌
  SET_TOKEN(state, token) {
    state.token = token;
  },
  
  // 设置用户信息
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  
  // 设置健康档案
  SET_HEALTH_PROFILE(state, healthProfile) {
    state.healthProfile = healthProfile;
  },
  
  // 设置偏好设置
  SET_PREFERENCES(state, preferences) {
    state.preferences = preferences;
  },
  
  // 更新用户信息
  UPDATE_USER_INFO(state, userInfo) {
    state.userInfo = { ...state.userInfo, ...userInfo };
  },
  
  // 更新健康档案
  UPDATE_HEALTH_PROFILE(state, healthProfile) {
    state.healthProfile = { ...state.healthProfile, ...healthProfile };
  },
  
  // 更新偏好设置
  UPDATE_PREFERENCES(state, preferences) {
    state.preferences = { ...state.preferences, ...preferences };
  },
  
  // 清除用户信息
  CLEAR_USER_INFO(state) {
    state.isLoggedIn = false;
    state.token = '';
    state.userInfo = null;
    state.healthProfile = null;
    state.preferences = null;
  }
};

const actions = {
  // 初始化用户信息
  initUser({ commit, dispatch }) {
    // 从本地存储获取令牌
    const token = uni.getStorageSync('token');
    if (token) {
      commit('SET_TOKEN', token);
      commit('SET_LOGIN_STATE', true);
      // 获取用户信息
      dispatch('getUserInfo');
    }
  },
  
  // 用户登录
  async login({ commit, dispatch }, { username, password }) {
    try {
      const response = await uni.request({
        url: USER_API.login,
        method: 'POST',
        data: { username, password }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        const { token } = data;
        // 保存令牌
        commit('SET_TOKEN', token);
        uni.setStorageSync('token', token);
        commit('SET_LOGIN_STATE', true);
        
        // 获取用户信息
        await dispatch('getUserInfo');
        
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('登录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 手机号登录
  async loginByPhone({ commit, dispatch }, { phone, code }) {
    try {
      const response = await uni.request({
        url: USER_API.loginByPhone,
        method: 'POST',
        data: { phone, code }
      });
      
      const { code: resCode, data, message } = response.data;
      
      if (resCode === 0 && data) {
        const { token } = data;
        // 保存令牌
        commit('SET_TOKEN', token);
        uni.setStorageSync('token', token);
        commit('SET_LOGIN_STATE', true);
        
        // 获取用户信息
        await dispatch('getUserInfo');
        
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('手机号登录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit, state }) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: USER_API.getUserInfo,
        method: 'GET',
        header: { 'Authorization': `Bearer ${state.token}` }
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0 && data) {
        // 保存用户信息
        commit('SET_USER_INFO', data.userInfo);
        commit('SET_HEALTH_PROFILE', data.healthProfile);
        commit('SET_PREFERENCES', data.preferences);
        
        return { success: true, data };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新用户信息
  async updateUserInfo({ commit, state }, userInfo) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: USER_API.updateUserInfo,
        method: 'POST',
        header: { 'Authorization': `Bearer ${state.token}` },
        data: userInfo
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        // 更新用户信息
        commit('UPDATE_USER_INFO', userInfo);
        
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新用户信息失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新健康档案
  async updateHealthProfile({ commit, state }, healthProfile) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: USER_API.updateHealthProfile,
        method: 'POST',
        header: { 'Authorization': `Bearer ${state.token}` },
        data: healthProfile
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        // 更新健康档案
        commit('UPDATE_HEALTH_PROFILE', healthProfile);
        
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新健康档案失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 更新偏好设置
  async updatePreferences({ commit, state }, preferences) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await uni.request({
        url: USER_API.updatePreferences,
        method: 'POST',
        header: { 'Authorization': `Bearer ${state.token}` },
        data: preferences
      });
      
      const { code, data, message } = response.data;
      
      if (code === 0) {
        // 更新偏好设置
        commit('UPDATE_PREFERENCES', preferences);
        
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('更新偏好设置失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 用户退出
  logout({ commit }) {
    // 清除令牌
    uni.removeStorageSync('token');
    // 清除用户信息
    commit('CLEAR_USER_INFO');
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/login'
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
