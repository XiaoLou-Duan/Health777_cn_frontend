/**
 * mock/data/exercise/reminders.js - 运动提醒模拟数据
 * 
 * 包含用户的运动提醒设置
 */

import { generateRandomId } from '../../utils/mock-helper';

// 用户1001的运动提醒
const user1001Reminders = [
  {
    id: generateRandomId(),
    userId: '1001',
    title: '晨间椅子运动',
    description: '进行15分钟的椅子坐立运动，增强腿部力量',
    exerciseId: 'e002', // 椅子坐立
    daysOfWeek: [1, 3, 5], // 周一、周三、周五
    time: '08:30',
    duration: 15, // 分钟
    enabled: true,
    notificationTime: 10, // 提前10分钟通知
    repeatNotification: true, // 到时间再次通知
    vibration: true,
    sound: 'gentle',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    title: '午后散步时间',
    description: '进行20分钟的轻度步行，享受户外阳光',
    exerciseId: 'e001', // 轻度步行
    daysOfWeek: [2, 4, 6], // 周二、周四、周六
    time: '15:00',
    duration: 20, // 分钟
    enabled: true,
    notificationTime: 15, // 提前15分钟通知
    repeatNotification: true,
    vibration: true,
    sound: 'birds',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    title: '太极拳练习',
    description: '跟随视频进行30分钟的太极拳练习，提高平衡能力',
    exerciseId: 'e004', // 太极拳
    daysOfWeek: [6], // 周六
    time: '09:30',
    duration: 30, // 分钟
    enabled: true,
    notificationTime: 10, // 提前10分钟通知
    repeatNotification: false,
    vibration: true,
    sound: 'traditional',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    title: '弹力带训练',
    description: '进行15分钟的上肢弹力带训练，增强手臂力量',
    exerciseId: 'e003', // 上肢弹力带训练
    daysOfWeek: [1, 5], // 周一、周五
    time: '16:00',
    duration: 15, // 分钟
    enabled: false, // 暂时禁用
    notificationTime: 10, // 提前10分钟通知
    repeatNotification: false,
    vibration: true,
    sound: 'pop',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    title: '晚间放松练习',
    description: '睡前10分钟的深呼吸练习，帮助放松身心',
    exerciseId: 'e010', // 深呼吸练习
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 每天
    time: '21:30',
    duration: 10, // 分钟
    enabled: true,
    notificationTime: 5, // 提前5分钟通知
    repeatNotification: false,
    vibration: false, // 睡前不振动
    sound: 'soft',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString()
  }
];

// 用户1002的运动提醒
const user1002Reminders = [
  {
    id: generateRandomId(),
    userId: '1002',
    title: '简易早间运动',
    description: '进行10分钟的坐姿上肢训练，唤醒身体',
    exerciseId: 'e009', // 坐姿上肢训练
    daysOfWeek: [1, 3, 5], // 周一、周三、周五
    time: '09:00',
    duration: 10, // 分钟
    enabled: true,
    notificationTime: 10, // 提前10分钟通知
    repeatNotification: true,
    vibration: true,
    sound: 'gentle',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    title: '轻松午后步行',
    description: '进行15分钟的室内轻度步行',
    exerciseId: 'e001', // 轻度步行
    daysOfWeek: [2, 4], // 周二、周四
    time: '14:30',
    duration: 15, // 分钟
    enabled: true,
    notificationTime: 15, // 提前15分钟通知
    repeatNotification: false,
    vibration: true,
    sound: 'birds',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1002',
    title: '椅子坐立练习',
    description: '进行10分钟的椅子坐立运动，增强腿部力量',
    exerciseId: 'e002', // 椅子坐立
    daysOfWeek: [6], // 周六
    time: '10:00',
    duration: 10, // 分钟
    enabled: false, // 暂时禁用
    notificationTime: 10, // 提前10分钟通知
    repeatNotification: false,
    vibration: true,
    sound: 'pop',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  }
];

// 合并所有运动提醒
const exerciseReminders = [...user1001Reminders, ...user1002Reminders];

export default exerciseReminders;
