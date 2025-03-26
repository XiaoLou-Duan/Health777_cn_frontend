/**
 * auth.js - 用户认证服务
 */
import { API } from '@/config/api';
import { post, get, put } from '@/utils/request';
import Storage from '@/utils/storage';

/**
 * 用户认证服务
 */
const AuthService = {
  /**
   * 用户注册
   * @param {Object} data 注册信息
   * @returns {Promise} 注册结果
   */
  register(data) {
    return post(API.USER.REGISTER, {
      phone: data.phone,
      password: data.password,
      code: data.code
    });
  },

  /**
   * 密码登录
   * @param {Object} data 登录信息
   * @returns {Promise} 登录结果
   */
  loginByPassword(data) {
    return post(API.USER.LOGIN_BY_PASSWORD, {
      phone: data.phone,
      password: data.password
    });
  },

  /**
   * 手机验证码登录
   * @param {Object} data 登录信息
   * @returns {Promise} 登录结果
   */
  loginByPhone(data) {
    return post(API.USER.LOGIN_BY_PHONE, {
      phone: data.phone,
      code: data.code
    });
  },

  /**
   * 发送短信验证码
   * @param {Object} data 发送短信数据
   * @returns {Promise} 发送结果
   */
  sendSmsCode(data) {
    return post(API.USER.SEND_SMS, {
      phone: data.phone,
      type: data.type
    });
  },

  /**
   * 修改密码
   * @param {Object} data 修改密码数据
   * @returns {Promise} 修改结果
   */
  changePassword(data) {
    return post(API.USER.CHANGE_PASSWORD, {
      old_password: data.oldPassword,
      new_password: data.newPassword
    });
  },

  /**
   * 重置密码
   * @param {Object} data 重置密码数据
   * @returns {Promise} 重置结果
   */
  resetPassword(data) {
    return post(API.USER.PASSWORD_RESET, {
      phone: data.phone,
      code: data.code,
      new_password: data.newPassword
    });
  },

  /**
   * 修改手机号
   * @param {Object} data 修改手机号数据
   * @returns {Promise} 修改结果
   */
  changePhone(data) {
    return post(API.USER.PHONE_CHANGE, {
      new_phone: data.newPhone,
      code: data.code
    });
  },

  /**
   * 获取用户资料
   * @returns {Promise} 用户资料
   */
  getUserProfile() {
    return get(API.USER.GET_INFO);
  },

  /**
   * 更新用户资料
   * @param {Object} data 用户资料
   * @returns {Promise} 更新结果
   */
  updateUserProfile(data) {
    return put(API.USER.UPDATE_INFO, data);
  },

  /**
   * 保存用户登录信息
   * @param {Object} data 登录返回的数据
   */
  saveLoginInfo(data) {
    // 保存token
    Storage.set('token', data.access_token);
    
    // 如果有用户信息，保存用户信息
    if (data.user) {
      Storage.set('userInfo', data.user);
    }
  },

  /**
   * 清除用户登录信息
   */
  clearLoginInfo() {
    Storage.remove('token');
    Storage.remove('userInfo');
  },

  /**
   * 检查是否已登录
   * @returns {Boolean} 是否已登录
   */
  isLoggedIn() {
    return !!Storage.get('token');
  },

  /**
   * 获取当前用户信息
   * @returns {Object|null} 用户信息
   */
  getCurrentUser() {
    return Storage.get('userInfo');
  }
};

export default AuthService;
