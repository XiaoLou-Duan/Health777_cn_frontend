/**
 * 用户模块状态管理
 */
import { API } from '@/config/api.js';
import AuthService from '@/services/auth';

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
  // 发送短信验证码
  async sendSmsCode({ commit, state }, { phone, scene }) {
    try {
      const response = await AuthService.sendSmsCode({
        phone,
        scene
      });
      
      if (response.code === 0) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '发送验证码失败' };
      }
    } catch (error) {
      console.error('发送验证码失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 初始化用户信息
  initUser({ commit, dispatch }) {
    // 检查是否已登录
    const userInfo = AuthService.getCurrentUser();
    if (userInfo && userInfo.token) {
      // 将 token 和登录状态保存到 Vuex 中
      commit('SET_TOKEN', userInfo.token);
      commit('SET_LOGIN_STATE', true);
      
      // 如果有用户信息，也保存到 Vuex 中
      if (userInfo.userInfo) {
        commit('SET_USER_INFO', userInfo.userInfo);
      }
      
      // 获取最新的用户信息
      dispatch('getUserInfo');
      
      return true;
    }
    return false;
  },
  
  // 用户登录（密码登录）
  async loginByPassword({ commit, dispatch }, { phone, password }) {
    try {
      const response = await AuthService.loginByPassword({ phone, password });
      
      if (response.code === 0) {
        const userData = response.data;
        
        // 保存登录信息到本地存储
        AuthService.saveLoginInfo(userData);
        
        // 更新 Vuex 状态
        commit('SET_TOKEN', userData.accessToken);
        commit('SET_LOGIN_STATE', true);
        
        // 如果响应中包含用户信息，也保存到 Vuex 中
        if (userData.user) {
          commit('SET_USER_INFO', userData.user);
        } else {
          // 获取用户信息
          await dispatch('getUserInfo');
        }
        
        return { success: true, data: userData };
      } else {
        return { success: false, message: response.message || '登录失败' };
      }
    } catch (error) {
      console.error('登录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 手机号登录
  async loginByPhone({ commit, dispatch }, { phone, code }) {
    try {
      const response = await AuthService.loginByPhone({ phone, code });
      
      if (response.code === 0) {
        const userData = response.data;
        
        // 保存登录信息到本地存储
        AuthService.saveLoginInfo(userData);
        
        // 更新 Vuex 状态
        commit('SET_TOKEN', userData.accessToken);
        commit('SET_LOGIN_STATE', true);
        
        // 如果响应中包含用户信息，也保存到 Vuex 中
        if (userData.user) {
          commit('SET_USER_INFO', userData.user);
        } else {
          // 获取用户信息
          await dispatch('getUserInfo');
        }
        
        return { success: true, data: userData };
      } else {
        return { success: false, message: response.message || '登录失败' };
      }
    } catch (error) {
      console.error('手机号登录失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 用户注册
  async register({ commit, dispatch }, { phone, password, code }) {
    try {
      const response = await AuthService.register({ phone, password, code });
      
      if (response.code === 0) {
        // 保存登录信息到本地存储
        AuthService.saveLoginInfo(response.data);
        
        // 更新 Vuex 状态
        commit('SET_TOKEN', response.data.accessToken);
        commit('SET_LOGIN_STATE', true);
        
        // 获取用户信息
        await dispatch('getUserInfo');
        
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '注册失败' };
      }
    } catch (error) {
      console.error('注册失败', error);
      return { success: false, message: '网络错误，请重试' };
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit, state }) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await AuthService.getUserProfile();
      
      if (response.code === 0) {
        // 更新用户信息
        commit('SET_USER_INFO', response.data);
        
        // 如果有健康档案信息，也更新
        if (response.data.healthProfile) {
          commit('SET_HEALTH_PROFILE', response.data.healthProfile);
        }
        
        // 如果有偏好设置，也更新
        if (response.data.preferences) {
          commit('SET_PREFERENCES', response.data.preferences);
        }
        
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '获取用户信息失败' };
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
      const response = await AuthService.updateUserProfile(userInfo);
      
      if (response.code === 0) {
        // 更新用户信息
        commit('UPDATE_USER_INFO', userInfo);
        return { success: true };
      } else {
        return { success: false, message: response.message || '更新用户信息失败' };
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
      // 这里需要根据实际API调整
      const response = await uni.request({
        url: API.USER.HEALTH_INFO,
        method: 'PUT',
        data: healthProfile,
        header: { 'Authorization': `Bearer ${state.token}` }
      });
      
      const { code, message } = response.data;
      
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
      // 这里需要根据实际API调整
      const response = await uni.request({
        url: API.USER.UPDATE_INFO,
        method: 'PUT',
        data: { preferences },
        header: { 'Authorization': `Bearer ${state.token}` }
      });
      
      const { code, message } = response.data;
      
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
  
  // 检查登录状态
  checkLoginStatus({ state, dispatch }) {
    if (state.isLoggedIn && state.token) {
      return true;
    }
    
    // 如果 Vuex 中没有登录状态，尝试从本地存储初始化
    const isInitSuccess = dispatch('initUser');
    return isInitSuccess;
  },
  
  // 用户退出
  logout({ commit }) {
    // 调用退出登录接口
    AuthService.logout().finally(() => {
      // 无论接口是否成功，都清除本地存储和状态
      AuthService.clearLoginInfo();
      commit('CLEAR_USER_INFO');
    });
    
    return { success: true };
  },
  
  // 修改手机号
  async changePhone({ commit, state, dispatch }, { mobile, code, oldCode }) {
    if (!state.token) return { success: false, message: '未登录' };
    
    try {
      const response = await AuthService.changePhone({
        mobile,
        code,
        oldCode
      });
      
      if (response.code === 0) {
        // 更新用户信息中的手机号
        commit('UPDATE_USER_INFO', { mobile });
        
        // 重新获取用户信息，确保数据同步
        await dispatch('getUserInfo');
        
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '修改手机号失败' };
      }
    } catch (error) {
      console.error('修改手机号失败', error);
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
