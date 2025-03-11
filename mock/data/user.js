/**
 * mock/data/user.js - 用户模块模拟数据
 */

// 用户列表
const users = [
  {
    id: '001',
    username: 'test001',
    password: '123456',
    phone: '13800138001',
    nickname: '张大爷',
    avatar: '/static/images/avatar/avatar1.png',
    gender: 1, // 1-男，2-女
    role: 'user',
    status: 1, // 1-正常，0-禁用
    createTime: '2025-01-15T08:30:00.000Z',
    updateTime: '2025-03-01T10:25:00.000Z'
  },
  {
    id: '002',
    username: 'test002',
    password: '123456',
    phone: '13800138002',
    nickname: '李奶奶',
    avatar: '/static/images/avatar/avatar2.png',
    gender: 2,
    role: 'user',
    status: 1,
    createTime: '2025-01-20T09:15:00.000Z',
    updateTime: '2025-02-28T16:40:00.000Z'
  },
  {
    id: '003',
    username: 'doctor001',
    password: '123456',
    phone: '13900139001',
    nickname: '王医生',
    avatar: '/static/images/avatar/avatar3.png',
    gender: 1,
    role: 'doctor',
    status: 1,
    createTime: '2025-01-10T14:20:00.000Z',
    updateTime: '2025-02-25T11:30:00.000Z'
  }
];

// 健康档案
const healthProfiles = [
  {
    userId: '001',
    birthDate: '1955-05-15',
    height: 172,
    weight: 68,
    bmi: 23.0,
    bloodType: 'A',
    medicalHistory: ['高血压', '骨质疏松'],
    allergies: ['青霉素'],
    emergencyContact: {
      name: '张小明',
      relation: '儿子',
      phone: '13800138003'
    },
    sarcopeniaLevel: 2, // 肌少症等级：1-轻度，2-中度，3-重度
    proteinTarget: 88, // 每日蛋白质目标（克）
    exerciseFrequency: 3, // 每周锻炼频率
    walkingStepsTarget: 6000, // 每日步行目标
    updateTime: '2025-02-20T09:45:00.000Z'
  },
  {
    userId: '002',
    birthDate: '1950-08-22',
    height: 158,
    weight: 55,
    bmi: 22.0,
    bloodType: 'O',
    medicalHistory: ['糖尿病', '骨质疏松'],
    allergies: [],
    emergencyContact: {
      name: '李小花',
      relation: '女儿',
      phone: '13800138004'
    },
    sarcopeniaLevel: 1,
    proteinTarget: 72,
    exerciseFrequency: 4,
    walkingStepsTarget: 5000,
    updateTime: '2025-02-18T14:30:00.000Z'
  }
];

// 用户偏好设置
const preferences = [
  {
    userId: '001',
    theme: 'default',
    fontSize: 'large',
    notificationEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    foodPreferences: {
      liked: ['鱼', '鸡肉', '豆腐', '菠菜'],
      disliked: ['牛肉', '香菜']
    },
    exercisePreferences: {
      preferred: ['散步', '太极拳', '健身操'],
      avoided: ['跑步', '举重']
    },
    privacySettings: {
      shareHealthData: true,
      shareSocialData: false
    },
    updateTime: '2025-02-25T16:20:00.000Z'
  },
  {
    userId: '002',
    theme: 'high-contrast',
    fontSize: 'extra-large',
    notificationEnabled: true,
    soundEnabled: true,
    vibrationEnabled: false,
    foodPreferences: {
      liked: ['牛奶', '水果', '米饭', '鱼'],
      disliked: ['辣椒', '大蒜']
    },
    exercisePreferences: {
      preferred: ['轻度瑜伽', '健身操', '散步'],
      avoided: ['跑步', '跳绳']
    },
    privacySettings: {
      shareHealthData: true,
      shareSocialData: true
    },
    updateTime: '2025-02-22T10:15:00.000Z'
  }
];

// 验证码记录
const verificationCodes = [
  {
    phone: '13800138001',
    code: '123456',
    expireTime: new Date(Date.now() + 5 * 60 * 1000)
  },
  {
    phone: '13800138002',
    code: '123456',
    expireTime: new Date(Date.now() + 5 * 60 * 1000)
  }
];

export default {
  users,
  healthProfiles,
  preferences,
  verificationCodes
};
