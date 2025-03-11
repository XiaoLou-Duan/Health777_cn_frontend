/**
 * Vuex 状态管理
 */
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import nutrition from './modules/nutrition';
import exercise from './modules/exercise';
import social from './modules/social';
import medical from './modules/medical';
import { ELDERLY_CONFIG } from '@/config/config.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 全局加载状态
    loading: false,
    // 加载提示文本
    loadingText: '加载中...',
    // 网络状态
    networkType: 'unknown',
    // 网络是否连接
    isConnected: true,
    // 是否为老年人模式
    isElderly: ELDERLY_CONFIG.simplifiedInterface,
    // 主题类型: default, high-contrast, dark
    themeType: 'default',
    // 系统信息
    systemInfo: {},
    // 开发者模式
    devMode: false,
    // Toast信息
    toast: {
      show: false,
      type: 'default',
      message: '',
      duration: 2000
    }
  },
  
  getters: {
    // 是否加载中
    isLoading: state => state.loading,
    // 是否为老年人模式
    isElderly: state => state.isElderly,
    // 获取主题类型
    themeType: state => state.themeType,
    // 是否为高对比度主题
    isHighContrastTheme: state => state.themeType === 'high-contrast',
    // 是否为暗色主题
    isDarkTheme: state => state.themeType === 'dark',
    // 是否连接网络
    isConnected: state => state.isConnected,
    // 获取系统信息
    systemInfo: state => state.systemInfo
  },
  
  mutations: {
    // 设置加载状态
    SET_LOADING(state, { loading, text }) {
      state.loading = loading;
      if (text !== undefined) {
        state.loadingText = text;
      }
    },
    
    // 设置网络类型
    SET_NETWORK_TYPE(state, networkType) {
      state.networkType = networkType;
    },
    
    // 设置网络连接状态
    SET_NETWORK_CONNECTED(state, isConnected) {
      state.isConnected = isConnected;
    },
    
    // 设置老年人模式
    SET_ELDERLY_MODE(state, isElderly) {
      state.isElderly = isElderly;
    },
    
    // 设置主题类型
    SET_THEME_TYPE(state, themeType) {
      state.themeType = themeType;
    },
    
    // 设置系统信息
    SET_SYSTEM_INFO(state, systemInfo) {
      state.systemInfo = systemInfo;
    },
    
    // 设置开发者模式
    SET_DEV_MODE(state, devMode) {
      state.devMode = devMode;
    },
    
    // 显示Toast
    SHOW_TOAST(state, { type, message, duration }) {
      state.toast = {
        show: true,
        type: type || 'default',
        message,
        duration: duration || 2000
      };
    },
    
    // 隐藏Toast
    HIDE_TOAST(state) {
      state.toast.show = false;
    }
  },
  
  actions: {
    // 初始化应用
    initApp({ commit, dispatch }) {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync();
      commit('SET_SYSTEM_INFO', systemInfo);
      
      // 监听网络状态
      uni.getNetworkType({
        success: (res) => {
          commit('SET_NETWORK_TYPE', res.networkType);
          commit('SET_NETWORK_CONNECTED', res.networkType !== 'none');
        }
      });
      
      // 监听网络状态变化
      uni.onNetworkStatusChange((res) => {
        commit('SET_NETWORK_TYPE', res.networkType);
        commit('SET_NETWORK_CONNECTED', res.isConnected);
      });
      
      // 初始化用户模块
      dispatch('user/initUser');
    },
    
    // 显示全局加载
    showLoading({ commit }, text) {
      commit('SET_LOADING', { loading: true, text });
    },
    
    // 隐藏全局加载
    hideLoading({ commit }) {
      commit('SET_LOADING', { loading: false });
    },
    
    // 切换老年人模式
    toggleElderlyMode({ commit, state }) {
      const newMode = !state.isElderly;
      commit('SET_ELDERLY_MODE', newMode);
      
      // 保存到本地存储
      uni.setStorageSync('elderly_mode', newMode);
      
      return newMode;
    },
    
    // 设置主题
    setTheme({ commit }, themeType) {
      commit('SET_THEME_TYPE', themeType);
      
      // 保存到本地存储
      uni.setStorageSync('theme_type', themeType);
      
      return themeType;
    },
    
    // 显示Toast
    showToast({ commit }, { type, message, duration }) {
      commit('SHOW_TOAST', { type, message, duration });
      
      // 自动关闭
      setTimeout(() => {
        commit('HIDE_TOAST');
      }, duration || 2000);
    }
  },
  
  modules: {
    user,
    nutrition,
    exercise,
    social,
    medical
  }
});
