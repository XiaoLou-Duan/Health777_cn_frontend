/**
 * mock/data/reminder/reminders.js - 提醒数据
 * 
 * 包含各类提醒的数据结构
 */

import { generateRandomId } from '../../utils/mock-helper';

// 提醒类型
const reminderTypes = [
  {
    id: 'type001',
    code: 'food_record',
    name: '饮食记录',
    description: '记录每日三餐饮食情况',
    icon: '/static/icons/reminders/food.png',
    importance: 'high',
    defaultTimes: ['08:00', '12:00', '18:00']
  },
  {
    id: 'type002',
    code: 'protein_intake',
    name: '乳清蛋白摄入',
    description: '每日乳清蛋白补充提醒',
    icon: '/static/icons/reminders/protein.png',
    importance: 'high',
    defaultTimes: ['08:00', '17:30']
  },
  {
    id: 'type003',
    code: 'exercise',
    name: '运动提醒',
    description: '每日锻炼提醒',
    icon: '/static/icons/reminders/exercise.png',
    importance: 'high',
    defaultTimes: ['09:30', '16:00']
  },
  {
    id: 'type004',
    code: 'medicine',
    name: '服药提醒',
    description: '按时服用药物提醒',
    icon: '/static/icons/reminders/medicine.png',
    importance: 'high',
    defaultTimes: ['08:00', '12:00', '18:00']
  },
  {
    id: 'type005',
    code: 'water',
    name: '喝水提醒',
    description: '定时补充水分提醒',
    icon: '/static/icons/reminders/water.png',
    importance: 'medium',
    defaultTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
  },
  {
    id: 'type006',
    code: 'appointment',
    name: '预约提醒',
    description: '医生预约提醒',
    icon: '/static/icons/reminders/appointment.png',
    importance: 'high',
    defaultTimes: []
  }
];

// 用户提醒配置
const userReminders = [
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '早餐记录提醒',
    content: '请记得拍照记录您的早餐',
    times: ['08:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 1-7 代表周一到周日
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '午餐记录提醒',
    content: '请记得拍照记录您的午餐',
    times: ['12:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '晚餐记录提醒',
    content: '请记得拍照记录您的晚餐',
    times: ['18:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type002',
    typeName: '乳清蛋白摄入',
    typeCode: 'protein_intake',
    icon: '/static/icons/reminders/protein.png',
    title: '早间乳清蛋白提醒',
    content: '请记得补充您的乳清蛋白',
    times: ['08:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type002',
    typeName: '乳清蛋白摄入',
    typeCode: 'protein_intake',
    icon: '/static/icons/reminders/protein.png',
    title: '晚间乳清蛋白提醒',
    content: '请记得补充您的乳清蛋白',
    times: ['17:30'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type003',
    typeName: '运动提醒',
    typeCode: 'exercise',
    icon: '/static/icons/reminders/exercise.png',
    title: '上午锻炼提醒',
    content: '现在是进行锻炼的好时间',
    times: ['09:30'],
    daysOfWeek: [1, 2, 3, 4, 5],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type003',
    typeName: '运动提醒',
    typeCode: 'exercise',
    icon: '/static/icons/reminders/exercise.png',
    title: '下午锻炼提醒',
    content: '现在是进行锻炼的好时间',
    times: ['16:00'],
    daysOfWeek: [1, 2, 3, 4, 5],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type004',
    typeName: '服药提醒',
    typeCode: 'medicine',
    icon: '/static/icons/reminders/medicine.png',
    title: '高血压药物提醒',
    content: '请记得服用您的降压药',
    times: ['08:00', '18:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type004',
    typeName: '服药提醒',
    typeCode: 'medicine',
    icon: '/static/icons/reminders/medicine.png',
    title: '钙片提醒',
    content: '请记得服用钙片',
    times: ['12:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString()
  },
  {
    id: generateRandomId(),
    userId: '1001',
    typeId: 'type005',
    typeName: '喝水提醒',
    typeCode: 'water',
    icon: '/static/icons/reminders/water.png',
    title: '喝水提醒',
    content: '请记得补充水分',
    times: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
    createTime: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString()
  }
];

// 今日提醒列表（已在队列中的提醒）
const today = new Date().toISOString().split('T')[0];
const todayReminders = [
  {
    id: generateRandomId(),
    reminderId: userReminders[0].id, // 早餐记录提醒
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '早餐记录提醒',
    content: '请记得拍照记录您的早餐',
    scheduledTime: `${today}T08:00:00.000Z`,
    status: 'completed', // pending-待处理 pushed-已推送 completed-已完成 missed-已错过
    completedTime: `${today}T08:10:15.000Z`,
    isRead: true
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[1].id, // 午餐记录提醒
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '午餐记录提醒',
    content: '请记得拍照记录您的午餐',
    scheduledTime: `${today}T12:00:00.000Z`,
    status: 'completed',
    completedTime: `${today}T12:05:30.000Z`,
    isRead: true
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[2].id, // 晚餐记录提醒
    userId: '1001',
    typeId: 'type001',
    typeName: '饮食记录',
    typeCode: 'food_record',
    icon: '/static/icons/reminders/food.png',
    title: '晚餐记录提醒',
    content: '请记得拍照记录您的晚餐',
    scheduledTime: `${today}T18:00:00.000Z`,
    status: 'pending',
    completedTime: null,
    isRead: false
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[3].id, // 早间乳清蛋白提醒
    userId: '1001',
    typeId: 'type002',
    typeName: '乳清蛋白摄入',
    typeCode: 'protein_intake',
    icon: '/static/icons/reminders/protein.png',
    title: '早间乳清蛋白提醒',
    content: '请记得补充您的乳清蛋白',
    scheduledTime: `${today}T08:00:00.000Z`,
    status: 'completed',
    completedTime: `${today}T08:15:20.000Z`,
    isRead: true
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[4].id, // 晚间乳清蛋白提醒
    userId: '1001',
    typeId: 'type002',
    typeName: '乳清蛋白摄入',
    typeCode: 'protein_intake',
    icon: '/static/icons/reminders/protein.png',
    title: '晚间乳清蛋白提醒',
    content: '请记得补充您的乳清蛋白',
    scheduledTime: `${today}T17:30:00.000Z`,
    status: 'pending',
    completedTime: null,
    isRead: false
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[5].id, // 上午锻炼提醒
    userId: '1001',
    typeId: 'type003',
    typeName: '运动提醒',
    typeCode: 'exercise',
    icon: '/static/icons/reminders/exercise.png',
    title: '上午锻炼提醒',
    content: '现在是进行锻炼的好时间',
    scheduledTime: `${today}T09:30:00.000Z`,
    status: 'missed',
    completedTime: null,
    isRead: true
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[6].id, // 下午锻炼提醒
    userId: '1001',
    typeId: 'type003',
    typeName: '运动提醒',
    typeCode: 'exercise',
    icon: '/static/icons/reminders/exercise.png',
    title: '下午锻炼提醒',
    content: '现在是进行锻炼的好时间',
    scheduledTime: `${today}T16:00:00.000Z`,
    status: 'pending',
    completedTime: null,
    isRead: false
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[7].id, // 高血压药物提醒
    userId: '1001',
    typeId: 'type004',
    typeName: '服药提醒',
    typeCode: 'medicine',
    icon: '/static/icons/reminders/medicine.png',
    title: '高血压药物提醒',
    content: '请记得服用您的降压药',
    scheduledTime: `${today}T08:00:00.000Z`,
    status: 'completed',
    completedTime: `${today}T08:05:00.000Z`,
    isRead: true
  },
  {
    id: generateRandomId(),
    reminderId: userReminders[7].id, // 高血压药物提醒
    userId: '1001',
    typeId: 'type004',
    typeName: '服药提醒',
    typeCode: 'medicine',
    icon: '/static/icons/reminders/medicine.png',
    title: '高血压药物提醒',
    content: '请记得服用您的降压药',
    scheduledTime: `${today}T18:00:00.000Z`,
    status: 'pending',
    completedTime: null,
    isRead: false
  }
];

export default {
  reminderTypes,
  userReminders,
  todayReminders
};
