/**
 * mock/data/exercise/steps.js - 步数记录模拟数据
 * 
 * 包含用户的每日步数记录
 */

// 生成过去30天的日期数组（包括今天）
function generatePastDays(count = 30) {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]); // 格式化为 YYYY-MM-DD
  }
  
  return days.reverse(); // 按日期升序排列
}

// 生成随机步数
function generateRandomSteps(min, max, variance = 0.2) {
  const baseValue = Math.floor(Math.random() * (max - min + 1)) + min;
  // 添加一些波动，使数据更自然
  const varianceFactor = 1 + (Math.random() * 2 - 1) * variance;
  return Math.round(baseValue * varianceFactor);
}

// 用户1001的步数记录（活跃的老年人）
const user1001StepRecords = generatePastDays(30).map(date => {
  // 根据日期是否是周末生成不同范围的步数
  const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  
  // 根据是否是今天生成不同的步数数据
  const isToday = date === new Date().toISOString().split('T')[0];
  
  let steps;
  if (isToday) {
    // 今天的步数（假设现在是白天，步数还在累计中）
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      steps = generateRandomSteps(1000, 2500);
    } else if (currentHour < 18) {
      steps = generateRandomSteps(3000, 5000);
    } else {
      steps = generateRandomSteps(4500, 6500);
    }
  } else if (isWeekend) {
    // 周末的步数（可能更少，因为老年人可能在家休息）
    steps = generateRandomSteps(3000, 5500);
  } else {
    // 工作日的步数（可能更多，因为老年人可能有更多活动）
    steps = generateRandomSteps(4500, 7000);
  }
  
  // 随机生成未达标的天数
  const isLowActivity = Math.random() < 0.15; // 15%的天数步数较少
  if (isLowActivity && !isToday) {
    steps = generateRandomSteps(800, 2000);
  }
  
  // 步数目标（固定或随时间逐渐增加）
  const targetSteps = 6000;
  
  // 更新时间
  let updateTime;
  if (isToday) {
    updateTime = new Date().toISOString();
  } else {
    const recordDate = new Date(date);
    recordDate.setHours(21, Math.floor(Math.random() * 60), 0, 0); // 通常在晚上记录最终步数
    updateTime = recordDate.toISOString();
  }
  
  return {
    userId: '1001',
    date,
    steps,
    targetSteps,
    reachedTarget: steps >= targetSteps,
    updateTime,
    source: Math.random() < 0.8 ? 'device' : 'manual', // 80%来自设备，20%手动录入
    deviceType: Math.random() < 0.8 ? '智能手环' : '手机计步器'
  };
});

// 用户1002的步数记录（不太活跃的老年人）
const user1002StepRecords = generatePastDays(30).map(date => {
  // 根据日期是否是周末生成不同范围的步数
  const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  
  // 根据是否是今天生成不同的步数数据
  const isToday = date === new Date().toISOString().split('T')[0];
  
  let steps;
  if (isToday) {
    // 今天的步数（假设现在是白天，步数还在累计中）
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      steps = generateRandomSteps(500, 1500);
    } else if (currentHour < 18) {
      steps = generateRandomSteps(1500, 3000);
    } else {
      steps = generateRandomSteps(2000, 4000);
    }
  } else if (isWeekend) {
    // 周末的步数（可能更少）
    steps = generateRandomSteps(1000, 3000);
  } else {
    // 工作日的步数
    steps = generateRandomSteps(2000, 4500);
  }
  
  // 随机生成未达标的天数
  const isLowActivity = Math.random() < 0.3; // 30%的天数步数较少
  if (isLowActivity && !isToday) {
    steps = generateRandomSteps(500, 1500);
  }
  
  // 随机生成空缺的天数（未记录的数据）
  const isMissingRecord = Math.random() < 0.1; // 10%的天数没有记录
  if (isMissingRecord && !isToday) {
    return null;
  }
  
  // 步数目标（比用户1001低）
  const targetSteps = 4000;
  
  // 更新时间
  let updateTime;
  if (isToday) {
    updateTime = new Date().toISOString();
  } else {
    const recordDate = new Date(date);
    recordDate.setHours(20, Math.floor(Math.random() * 60), 0, 0);
    updateTime = recordDate.toISOString();
  }
  
  return {
    userId: '1002',
    date,
    steps,
    targetSteps,
    reachedTarget: steps >= targetSteps,
    updateTime,
    source: Math.random() < 0.6 ? 'device' : 'manual', // 60%来自设备，40%手动录入
    deviceType: Math.random() < 0.7 ? '智能手环' : '手机计步器'
  };
}).filter(record => record !== null); // 过滤掉空记录

// 合并所有步数记录
const stepRecords = [...user1001StepRecords, ...user1002StepRecords];

export default stepRecords;
