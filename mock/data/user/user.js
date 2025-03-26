import { generateRandomId } from '../../utils/index.js';

// 用户数据
export const userData = [
  {
    userId: '1001',
    username: 'zhangsan',
    password: '123456',  // 实际应用中密码应该加密存储
    nickname: '张三',
    avatar: '/static/images/avatar/user1.jpg',
    gender: '男',
    age: 65,
    height: 172,
    weight: 68,
    phone: '13812341234',
    email: 'zhangsan@example.com',
    sarcopeniaStatus: 'mild',  // none, mild, moderate, severe
    chronicDiseases: '高血压，糖尿病',
    allergies: '无',
    registerTime: '2024-12-01',
    lastLoginTime: '2025-03-10'
  },
  {
    userId: '1002',
    username: 'lisi',
    password: '123456',
    nickname: '李四',
    avatar: '/static/images/avatar/user2.jpg',
    gender: '女',
    age: 68,
    height: 158,
    weight: 52,
    phone: '13998765432',
    email: 'lisi@example.com',
    sarcopeniaStatus: 'moderate',
    chronicDiseases: '关节炎',
    allergies: '青霉素',
    registerTime: '2024-12-05',
    lastLoginTime: '2025-03-09'
  },
  {
    userId: '1003',
    username: 'wangwu',
    password: '123456',
    nickname: '王五',
    avatar: '/static/images/avatar/user3.jpg',
    gender: '男',
    age: 72,
    height: 175,
    weight: 70,
    phone: '13566778899',
    email: 'wangwu@example.com',
    sarcopeniaStatus: 'severe',
    chronicDiseases: '冠心病，高血压',
    allergies: '海鲜',
    registerTime: '2024-12-10',
    lastLoginTime: '2025-03-08'
  }
];

// 登录记录
export const loginLogs = [
  {
    id: generateRandomId(),
    userId: '1001',
    loginTime: '2025-03-10 08:30:45',
    loginIP: '192.168.1.100',
    deviceInfo: 'iPhone 13, iOS 15.0'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    loginTime: '2025-03-08 15:22:10',
    loginIP: '192.168.1.100',
    deviceInfo: 'iPhone 13, iOS 15.0'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    loginTime: '2025-03-09 10:15:30',
    loginIP: '192.168.2.200',
    deviceInfo: 'HUAWEI P40, Android 11'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    loginTime: '2025-03-08 19:45:22',
    loginIP: '192.168.3.150',
    deviceInfo: 'Xiaomi 12, MIUI 13'
  }
];

// 用户权限配置
export const userPermissions = [
  {
    userId: '1001',
    role: 'admin',
    permissions: [
      'read',
      'write',
      'delete',
      'admin'
    ]
  },
  {
    userId: '1002',
    role: 'user',
    permissions: [
      'read',
      'write'
    ]
  },
  {
    userId: '1003',
    role: 'user',
    permissions: [
      'read',
      'write'
    ]
  }
];

// 用户反馈记录
export const userFeedback = [
  {
    id: generateRandomId(),
    userId: '1001',
    content: '提醒功能非常好用，帮助我按时服药',
    type: 'praise',
    submitTime: '2025-03-08 14:30:00',
    status: 'read'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    content: '希望运动检测功能能够更准确一些',
    type: 'suggestion',
    submitTime: '2025-03-07 09:15:22',
    status: 'processing'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    content: '食物识别有时候会错误，希望能改进',
    type: 'bug',
    submitTime: '2025-03-06 16:42:10',
    status: 'pending'
  }
];

// 用户通知设置
export const userNotificationSettings = [
  {
    userId: '1001',
    settings: {
      enablePush: true,
      enableSound: true,
      enableVibration: true,
      doNotDisturbTimeStart: '22:00',
      doNotDisturbTimeEnd: '07:00',
      categories: {
        system: true,
        reminder: true,
        community: true,
        message: true
      }
    }
  },
  {
    userId: '1002',
    settings: {
      enablePush: true,
      enableSound: false,
      enableVibration: true,
      doNotDisturbTimeStart: '23:00',
      doNotDisturbTimeEnd: '06:00',
      categories: {
        system: true,
        reminder: true,
        community: false,
        message: true
      }
    }
  },
  {
    userId: '1003',
    settings: {
      enablePush: true,
      enableSound: true,
      enableVibration: false,
      doNotDisturbTimeStart: '21:00',
      doNotDisturbTimeEnd: '08:00',
      categories: {
        system: true,
        reminder: true,
        community: true,
        message: true
      }
    }
  }
];

// 用户隐私设置
export const userPrivacySettings = [
  {
    userId: '1001',
    settings: {
      profileVisibility: 'public',  // public, friends, private
      exerciseDataVisibility: 'friends',
      nutritionDataVisibility: 'private',
      allowDataAnalysis: true,
      allowDataSharing: false
    }
  },
  {
    userId: '1002',
    settings: {
      profileVisibility: 'friends',
      exerciseDataVisibility: 'friends',
      nutritionDataVisibility: 'friends',
      allowDataAnalysis: true,
      allowDataSharing: true
    }
  },
  {
    userId: '1003',
    settings: {
      profileVisibility: 'private',
      exerciseDataVisibility: 'private',
      nutritionDataVisibility: 'private',
      allowDataAnalysis: false,
      allowDataSharing: false
    }
  }
];

// 用户验证码记录
export const verificationCodes = [
  {
    id: generateRandomId(),
    phone: '13812341234',
    code: '123456',
    type: 'change_phone',
    createTime: '2025-03-11 11:30:00',
    expireTime: '2025-03-11 11:35:00',
    used: false
  },
  {
    id: generateRandomId(),
    phone: '13998765432',
    code: '654321',
    type: 'login',
    createTime: '2025-03-11 10:20:00',
    expireTime: '2025-03-11 10:25:00',
    used: true
  },
  {
    id: generateRandomId(),
    phone: '13566778899',
    code: '987654',
    type: 'register',
    createTime: '2025-03-11 09:15:00',
    expireTime: '2025-03-11 09:20:00',
    used: true
  }
];
