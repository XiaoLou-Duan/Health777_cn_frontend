import { generateRandomId } from "../../utils";

// 用户隐私设置数据
export const privacySettings = [
  {
    userId: '1001',
    settings: {
      profileVisibility: 'public', // public, friends, private
      exerciseDataVisibility: 'friends',
      nutritionDataVisibility: 'private',
      allowDataAnalysis: true,
      allowDataSharing: false,
      postVisibility: 'public',
      messagePermission: 'all', // all, friends, none
      shareLocation: 'whenUse' // always, whenUse, never
    },
    lastUpdated: '2025-03-10 14:22:15'
  },
  {
    userId: '1002',
    settings: {
      profileVisibility: 'friends',
      exerciseDataVisibility: 'friends',
      nutritionDataVisibility: 'friends',
      allowDataAnalysis: true,
      allowDataSharing: true,
      postVisibility: 'friends',
      messagePermission: 'friends',
      shareLocation: 'never'
    },
    lastUpdated: '2025-03-09 09:45:30'
  },
  {
    userId: '1003',
    settings: {
      profileVisibility: 'private',
      exerciseDataVisibility: 'private',
      nutritionDataVisibility: 'private',
      allowDataAnalysis: false,
      allowDataSharing: false,
      postVisibility: 'private',
      messagePermission: 'none',
      shareLocation: 'never'
    },
    lastUpdated: '2025-03-08 16:30:22'
  }
];

// 用户数据授权记录
export const dataAuthorizationLogs = [
  {
    id: generateRandomId(),
    userId: '1001',
    authType: 'analysis', // analysis, sharing, thirdParty
    authTime: '2025-03-10 14:22:15',
    isAuthorized: true,
    expiryTime: null, // 无限期或到期时间
    scope: ['profile', 'exercise', 'nutrition']
  },
  {
    id: generateRandomId(),
    userId: '1001',
    authType: 'sharing',
    authTime: '2025-03-10 14:22:15',
    isAuthorized: false,
    expiryTime: null,
    scope: []
  },
  {
    id: generateRandomId(),
    userId: '1002',
    authType: 'thirdParty',
    authTime: '2025-03-09 09:45:30',
    isAuthorized: true,
    expiryTime: '2026-03-09 09:45:30', // 一年有效期
    scope: ['profile'],
    thirdPartyName: '健康研究院'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    authType: 'analysis',
    authTime: '2025-03-08 16:30:22',
    isAuthorized: false,
    expiryTime: null,
    scope: []
  }
];

// 用户隐私设置变更记录
export const privacySettingChangeLogs = [
  {
    id: generateRandomId(),
    userId: '1001',
    changeTime: '2025-03-10 14:22:15',
    settingKey: 'profileVisibility',
    oldValue: 'friends',
    newValue: 'public'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    changeTime: '2025-03-05 11:30:45',
    settingKey: 'allowDataSharing',
    oldValue: 'true',
    newValue: 'false'
  },
  {
    id: generateRandomId(),
    userId: '1002',
    changeTime: '2025-03-09 09:45:30',
    settingKey: 'shareLocation',
    oldValue: 'always',
    newValue: 'never'
  },
  {
    id: generateRandomId(),
    userId: '1003',
    changeTime: '2025-03-08 16:30:22',
    settingKey: 'messagePermission',
    oldValue: 'friends',
    newValue: 'none'
  }
];
