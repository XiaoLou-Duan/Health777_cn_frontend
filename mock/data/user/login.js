import { generateRandomId } from "../../utils";

// 用户登录数据
export const loginData = {
  // 用于模拟登录响应的数据
  successResponse: {
    code: 0,
    message: 'success',
    data: {
      userId: '1001',
      token: 'mock_token_12345',
      nickName: '健康达人',
      avatar: '/static/images/avatar.png'
    }
  },
  
  // 模拟登录失败的响应
  failResponse: {
    code: 1001,
    message: '用户名或密码错误',
    data: null
  },
  
  // 账号已被锁定
  lockedResponse: {
    code: 1002,
    message: '账号已被锁定，请联系客服',
    data: null
  }
};

// 用户注册数据
export const registerData = {
  // 注册成功响应
  successResponse: {
    code: 0,
    message: 'success',
    data: {
      userId: '1001',
      token: 'mock_token_register_12345',
      nickName: '新用户',
      avatar: '/static/images/default_avatar.png'
    }
  },
  
  // 手机号已被注册
  phoneExistsResponse: {
    code: 1003,
    message: '该手机号已被注册',
    data: null
  },
  
  // 验证码错误
  codeErrorResponse: {
    code: 1004,
    message: '验证码错误',
    data: null
  }
};

// 验证码发送数据
export const verificationCodeData = {
  // 发送成功响应
  successResponse: {
    code: 0,
    message: '验证码发送成功',
    data: null
  },
  
  // 发送频率限制
  limitResponse: {
    code: 1005,
    message: '发送过于频繁，请稍后再试',
    data: null
  }
};

// 登录日志数据
export const loginLogsData = [
  {
    id: generateRandomId(),
    userId: '1001',
    loginTime: '2025-03-11 09:30:22',
    loginType: 'password', // password, wechat, apple
    deviceInfo: {
      deviceModel: 'iPhone 15',
      osVersion: 'iOS 18.0',
      appVersion: '1.0.0'
    },
    ipAddress: '192.168.1.100',
    location: '北京市海淀区'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    loginTime: '2025-03-10 18:15:47',
    loginType: 'wechat',
    deviceInfo: {
      deviceModel: 'iPhone 15',
      osVersion: 'iOS 18.0',
      appVersion: '1.0.0'
    },
    ipAddress: '192.168.1.100',
    location: '北京市海淀区'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    loginTime: '2025-03-09 10:45:33',
    loginType: 'password',
    deviceInfo: {
      deviceModel: 'iPhone 15',
      osVersion: 'iOS 18.0',
      appVersion: '1.0.0'
    },
    ipAddress: '192.168.1.100',
    location: '北京市海淀区'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    loginTime: '2025-03-11 11:22:33',
    loginType: 'apple',
    deviceInfo: {
      deviceModel: 'Huawei P50',
      osVersion: 'Android 13',
      appVersion: '1.0.0'
    },
    ipAddress: '192.168.2.200',
    location: '上海市徐汇区'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    loginTime: '2025-03-10 16:40:15',
    loginType: 'password',
    deviceInfo: {
      deviceModel: 'Xiaomi 14',
      osVersion: 'Android 14',
      appVersion: '1.0.0'
    },
    ipAddress: '192.168.3.300',
    location: '广州市天河区'
  }
];
