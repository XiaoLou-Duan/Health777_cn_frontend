/**
 * mock/data/exercise/records.js - 运动记录模拟数据
 * 
 * 包含用户的运动历史记录
 */

import { generateRandomId } from '../../utils/mock-helper';

// 生成一个月内的随机日期时间
function randomDateTime(daysAgo = 30) {
  const date = new Date();
  const randomDaysAgo = Math.floor(Math.random() * daysAgo);
  date.setDate(date.getDate() - randomDaysAgo);
  
  // 设置为早上6点到晚上8点之间的随机时间
  const hour = Math.floor(Math.random() * 14) + 6;
  const minute = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, 0, 0);
  
  return date.toISOString();
}

// 生成运动时长（5-60分钟）
function randomDuration() {
  return Math.floor(Math.random() * 56) + 5;
}

// 根据运动类型和时长计算卡路里消耗
function calculateCalories(exerciseId, durationMinutes) {
  // 简化计算，根据不同运动类型设置不同的卡路里消耗率
  const caloriesRate = {
    'e001': 3.5, // 轻度步行
    'e002': 4.0, // 椅子坐立
    'e003': 3.8, // 上肢弹力带训练
    'e004': 3.0, // 太极拳
    'e005': 5.0, // 水中有氧运动
    'e006': 3.0, // 轻度瑜伽
    'e007': 2.5, // 站立平衡训练
    'e008': 4.0, // 下肢弹力带训练
    'e009': 2.8, // 坐姿上肢训练
    'e010': 1.0  // 深呼吸练习
  };
  
  const rate = caloriesRate[exerciseId] || 3.0;
  return Math.round(rate * durationMinutes);
}

// 创建用户(1001)的运动记录
const user1001ExerciseRecords = [];

// 添加2个月的运动记录，平均每周3-5次
const exerciseTypes = ['e001', 'e002', 'e003', 'e004', 'e005', 'e006', 'e007', 'e008', 'e009', 'e010'];
const totalRecords = Math.floor(Math.random() * 16) + 24; // 24-40条记录

for (let i = 0; i < totalRecords; i++) {
  const startTime = randomDateTime(60); // 最近60天内
  const exerciseId = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
  const durationMinutes = randomDuration();
  
  // 计算结束时间
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  
  // 计算卡路里消耗
  const caloriesBurned = calculateCalories(exerciseId, durationMinutes);
  
  user1001ExerciseRecords.push({
    id: generateRandomId(),
    userId: '1001',
    exerciseId,
    startTime,
    endTime: endTime.toISOString(),
    durationMinutes,
    caloriesBurned,
    notes: '',
    moodBefore: Math.floor(Math.random() * 3) + 3, // 3-5，表示中等到良好的心情
    moodAfter: Math.floor(Math.random() * 2) + 4,  // 4-5，表示良好到极好的心情
    fatigueLevel: Math.floor(Math.random() * 3) + 1, // 1-3，表示轻微到中度疲劳
    completed: true,
    isManualEntry: Math.random() > 0.7 // 30%是手动记录
  });
}

// 对记录按时间排序（从新到旧）
user1001ExerciseRecords.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 创建用户(1002)的运动记录
const user1002ExerciseRecords = [];

// 添加1个月的运动记录，平均每周2-3次
const totalRecordsUser1002 = Math.floor(Math.random() * 6) + 8; // 8-14条记录

for (let i = 0; i < totalRecordsUser1002; i++) {
  const startTime = randomDateTime(30); // 最近30天内
  const exerciseId = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
  const durationMinutes = randomDuration();
  
  // 计算结束时间
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  
  // 计算卡路里消耗
  const caloriesBurned = calculateCalories(exerciseId, durationMinutes);
  
  user1002ExerciseRecords.push({
    id: generateRandomId(),
    userId: '1002',
    exerciseId,
    startTime,
    endTime: endTime.toISOString(),
    durationMinutes,
    caloriesBurned,
    notes: '',
    moodBefore: Math.floor(Math.random() * 5) + 1, // 1-5，表示情绪范围更大
    moodAfter: Math.floor(Math.random() * 3) + 3,  // 3-5，表示中等到极好的心情
    fatigueLevel: Math.floor(Math.random() * 3) + 1, // 1-3，表示轻微到中度疲劳
    completed: Math.random() > 0.1, // 90%完成
    isManualEntry: Math.random() > 0.5 // 50%是手动记录
  });
}

// 对记录按时间排序（从新到旧）
user1002ExerciseRecords.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 合并所有用户的运动记录
const exerciseRecords = [...user1001ExerciseRecords, ...user1002ExerciseRecords];

export default exerciseRecords;
