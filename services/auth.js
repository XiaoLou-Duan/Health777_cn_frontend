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
    return post(API.USER.LOGIN, {
      mobile: data.phone,
      password: data.password
    });
  },

  /**
   * 手机验证码登录
   * @param {Object} data 登录信息
   * @returns {Promise} 登录结果
   */
  loginByPhone(data) {
    return post(API.USER.LOGIN_BY_SMS, {
      mobile: data.phone,
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
      mobile: data.phone,
      scene: data.scene || '1' // 默认登录场景为21
    });
  },

  /**
   * 验证短信验证码
   * @param {Object} data 验证码数据
   * @returns {Promise} 验证结果
   */
  verifySmsCode(data) {
    return post(API.USER.VERIFY_SMS, {
      mobile: data.phone,
      code: data.code,
      scene: data.scene || '1' // 默认登录场景为21
    });
  },

  /**
   * 修改密码
   * @param {Object} data 修改密码数据
   * @returns {Promise} 修改结果
   */
  changePassword(data) {
    return put(API.USER.CHANGE_PASSWORD, {
      password: data.password,
      code: data.code
    });
  },

  /**
   * 重置密码
   * @param {Object} data 重置密码数据
   * @returns {Promise} 重置结果
   */
  resetPassword(data) {
    return put(API.USER.RESET_PASSWORD, {
      mobile: data.mobile,
      code: data.code,
      password: data.password
    });
  },

  /**
   * 修改手机号
   * @param {Object} data 修改手机号数据
   * @returns {Promise} 修改结果
   */
  changePhone(data) {
    return put(API.USER.UPDATE_MOBILE, {
      mobile: data.mobile,
      code: data.code,
      oldCode: data.oldCode
    });
  },

  /**
   * 获取用户资料
   * @param {Object} data 可选参数
   * @returns {Promise} 用户资料
   */
  getUserProfile(data = {}) {
    // 如果有userId参数才传入，否则不传参数
    const params = data.userId ? { userId: data.userId } : {};
    return get(API.USER.GET_INFO, params);
  },

  /**
   * 更新用户资料
   * @param {Object} data 用户资料
   * @returns {Promise} 更新结果
   */
  updateUserProfile(data) {
    return put(API.USER.UPDATE_INFO, {
      nickname: data.nickname,
      avatar: data.avatar,
      sex: data.sex
    });
  },

  /**
   * 刷新令牌
   * @param {String} refreshToken 刷新令牌
   * @returns {Promise} 刷新结果
   */
  refreshToken(refreshToken) {
    return post(API.USER.REFRESH_TOKEN, {
      refreshToken
    });
  },

  /**
   * 退出登录
   * @returns {Promise} 退出结果
   */
  logout() {
    return post(API.USER.LOGOUT);
  },

  /**
   * 保存用户登录信息
   * @param {Object} data 登录返回的数据
   */
  saveLoginInfo(data) {
    // 保存token
    Storage.set('token', data.accessToken);
    
    // 保存刷新令牌
    if (data.refreshToken) {
      Storage.set('refreshToken', data.refreshToken);
    }
    
    // 保存过期时间
    if (data.expiresTime) {
      Storage.set('expiresTime', data.expiresTime);
    }
    
    // 保存用户ID
    if (data.userId) {
      Storage.set('userId', data.userId);
    }
    
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
    Storage.remove('refreshToken');
    Storage.remove('expiresTime');
    Storage.remove('userId');
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
    return {
      userId: Storage.get('userId'),
      token: Storage.get('token'),
      refreshToken: Storage.get('refreshToken'),
      expiresTime: Storage.get('expiresTime'),
      userInfo: Storage.get('userInfo')
    };
  }
};

export default AuthService;
