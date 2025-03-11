/**
 * mock/user.js - 用户模块API模拟
 */
import userData from './data/user';
import { success, fail, unauthorized, isAuthorized, generateId } from './utils/mock-helper';

// 临时令牌存储
const tokens = {
  'test001': 'token_001_' + Date.now(),
  'test002': 'token_002_' + Date.now()
};

/**
 * 用户登录
 */
function login(options) {
  const { body } = options;
  const params = JSON.parse(body || '{}');
  const { username, password } = params;
  
  const user = userData.users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return fail('用户名或密码错误');
  }
  
  if (user.status !== 1) {
    return fail('账号已被禁用');
  }
  
  // 生成或获取令牌
  const token = tokens[username] || (tokens[username] = 'token_' + user.id + '_' + Date.now());
  
  return success({ token });
}

/**
 * 手机号登录
 */
function loginByPhone(options) {
  const { body } = options;
  const params = JSON.parse(body || '{}');
  const { phone, code } = params;
  
  // 验证码验证
  const validCode = userData.verificationCodes.find(vc => 
    vc.phone === phone && 
    vc.code === code && 
    new Date(vc.expireTime) > new Date()
  );
  
  if (!validCode) {
    return fail('验证码错误或已过期');
  }
  
  const user = userData.users.find(u => u.phone === phone);
  
  if (!user) {
    return fail('该手机号未注册');
  }
  
  if (user.status !== 1) {
    return fail('账号已被禁用');
  }
  
  // 生成或获取令牌
  const token = tokens[user.username] || (tokens[user.username] = 'token_' + user.id + '_' + Date.now());
  
  return success({ token });
}

/**
 * 获取验证码
 */
function getVerificationCode(options) {
  const { body } = options;
  const params = JSON.parse(body || '{}');
  const { phone } = params;
  
  if (!phone) {
    return fail('手机号不能为空');
  }
  
  // 模拟生成验证码
  const code = '123456';
  const expireTime = new Date(Date.now() + 5 * 60 * 1000);
  
  // 保存验证码
  const existingIndex = userData.verificationCodes.findIndex(vc => vc.phone === phone);
  if (existingIndex !== -1) {
    userData.verificationCodes[existingIndex] = { phone, code, expireTime };
  } else {
    userData.verificationCodes.push({ phone, code, expireTime });
  }
  
  return success(null);
}

/**
 * 获取用户信息
 */
function getUserInfo(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID（实际应用中会从JWT解析或从会话获取）
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  const user = userData.users.find(u => u.id === userId);
  
  if (!user) {
    return fail('用户不存在');
  }
  
  const healthProfile = userData.healthProfiles.find(hp => hp.userId === userId);
  const preferences = userData.preferences.find(p => p.userId === userId);
  
  // 不返回敏感信息
  const userInfo = { ...user };
  delete userInfo.password;
  
  return success({
    userInfo,
    healthProfile,
    preferences
  });
}

/**
 * 更新用户信息
 */
function updateUserInfo(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const updates = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  const userIndex = userData.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return fail('用户不存在');
  }
  
  // 不允许更新的字段
  const protectedFields = ['id', 'password', 'role', 'status', 'createTime'];
  
  // 过滤掉受保护的字段
  const filteredUpdates = { ...updates };
  protectedFields.forEach(field => delete filteredUpdates[field]);
  
  // 更新用户信息
  userData.users[userIndex] = {
    ...userData.users[userIndex],
    ...filteredUpdates,
    updateTime: new Date().toISOString()
  };
  
  return success(null);
}

/**
 * 更新健康档案
 */
function updateHealthProfile(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const updates = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  const profileIndex = userData.healthProfiles.findIndex(hp => hp.userId === userId);
  
  if (profileIndex === -1) {
    // 创建新的健康档案
    const newProfile = {
      userId,
      ...updates,
      updateTime: new Date().toISOString()
    };
    
    userData.healthProfiles.push(newProfile);
  } else {
    // 更新现有档案
    userData.healthProfiles[profileIndex] = {
      ...userData.healthProfiles[profileIndex],
      ...updates,
      updateTime: new Date().toISOString()
    };
  }
  
  return success(null);
}

/**
 * 更新偏好设置
 */
function updatePreferences(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const updates = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  const preferencesIndex = userData.preferences.findIndex(p => p.userId === userId);
  
  if (preferencesIndex === -1) {
    // 创建新的偏好设置
    const newPreferences = {
      userId,
      ...updates,
      updateTime: new Date().toISOString()
    };
    
    userData.preferences.push(newPreferences);
  } else {
    // 更新现有偏好设置
    userData.preferences[preferencesIndex] = {
      ...userData.preferences[preferencesIndex],
      ...updates,
      updateTime: new Date().toISOString()
    };
  }
  
  return success(null);
}

// API路由映射
export default {
  'POST /api/user/login': login,
  'POST /api/user/login/phone': loginByPhone,
  'POST /api/user/verification-code': getVerificationCode,
  'GET /api/user/info': getUserInfo,
  'POST /api/user/info': updateUserInfo,
  'POST /api/user/health-profile': updateHealthProfile,
  'POST /api/user/preferences': updatePreferences
};
