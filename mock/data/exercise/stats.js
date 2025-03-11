/**
 * mock/data/exercise/stats.js - 运动统计模拟数据
 * 
 * 包含用户的运动统计数据，包括日统计、周统计和月统计
 */

// 生成过去7天的日期数组（从今天开始）
function generatePastDays(count = 7) {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]); // 格式化为 YYYY-MM-DD
  }
  
  return days.reverse(); // 按日期升序排列
}

// 生成过去12周的周数据
function generatePastWeeks(count = 12) {
  const weeks = [];
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const currentYear = today.getFullYear();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i * 7);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    
    weeks.push({
      year,
      week: weekNumber,
      label: `${year}年第${weekNumber}周`
    });
  }
  
  return weeks.reverse(); // 按日期升序排列
}

// 获取日期所在的周数
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// 生成过去12个月的月数据
function generatePastMonths(count = 12) {
  const months = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  for (let i = 0; i < count; i++) {
    const monthIndex = (currentMonth - i + 12) % 12; // 处理跨年情况
    const year = currentYear - Math.floor((i - currentMonth) / 12);
    
    months.push({
      year,
      month: monthIndex + 1,
      label: `${year}年${monthIndex + 1}月`
    });
  }
  
  return months.reverse(); // 按日期升序排列
}

// 生成随机运动数据
function generateRandomExerciseData(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 用户1001的日运动统计
const user1001DailyStats = generatePastDays(30).map(date => {
  const durationMinutes = date.includes(new Date().toISOString().split('T')[0]) 
    ? generateRandomExerciseData(0, 45) // 今天的运动时间可能较少
    : generateRandomExerciseData(0, 60); // 其他日期的运动时间
  
  // 特定日期没有运动记录
  const hasExercise = Math.random() > 0.3; // 70%的天数有运动记录
  
  return {
    userId: '1001',
    date,
    totalDurationMinutes: hasExercise ? durationMinutes : 0,
    totalCaloriesBurned: hasExercise ? Math.round(durationMinutes * 3.8) : 0,
    exerciseCount: hasExercise ? Math.ceil(durationMinutes / 20) : 0,
    exerciseCategories: hasExercise ? generateExerciseCategories(durationMinutes) : [],
    targetReached: hasExercise && durationMinutes >= 30,
    notes: ''
  };
});

// 生成运动类别分布
function generateExerciseCategories(totalDuration) {
  const categories = ['有氧运动', '力量训练', '平衡训练', '柔韧性训练', '呼吸训练'];
  const result = [];
  
  // 确保至少有一个类别
  const mainCategory = categories[Math.floor(Math.random() * 3)]; // 主要集中在前三种
  const mainCategoryDuration = Math.ceil(totalDuration * 0.6); // 主要类别占60%
  
  result.push({
    category: mainCategory,
    durationMinutes: mainCategoryDuration
  });
  
  // 如果总时长足够，添加第二个类别
  if (totalDuration > 15) {
    let secondCategory;
    do {
      secondCategory = categories[Math.floor(Math.random() * categories.length)];
    } while (secondCategory === mainCategory);
    
    const secondCategoryDuration = totalDuration - mainCategoryDuration;
    
    result.push({
      category: secondCategory,
      durationMinutes: secondCategoryDuration
    });
  }
  
  return result;
}

// 用户1001的周运动统计
const user1001WeeklyStats = generatePastWeeks(12).map(weekData => {
  const totalDurationMinutes = generateRandomExerciseData(60, 300);
  const exerciseDays = generateRandomExerciseData(2, 6);
  
  return {
    userId: '1001',
    year: weekData.year,
    week: weekData.week,
    label: weekData.label,
    totalDurationMinutes,
    totalCaloriesBurned: Math.round(totalDurationMinutes * 3.8),
    exerciseDays,
    targetReached: exerciseDays >= 3 && totalDurationMinutes >= 150,
    exerciseCategories: generateExerciseCategories(totalDurationMinutes),
    notes: ''
  };
});

// 用户1001的月运动统计
const user1001MonthlyStats = generatePastMonths(12).map(monthData => {
  const totalDurationMinutes = generateRandomExerciseData(240, 1200);
  const exerciseDays = generateRandomExerciseData(8, 24);
  
  return {
    userId: '1001',
    year: monthData.year,
    month: monthData.month,
    label: monthData.label,
    totalDurationMinutes,
    totalCaloriesBurned: Math.round(totalDurationMinutes * 3.8),
    exerciseDays,
    targetReached: exerciseDays >= 12 && totalDurationMinutes >= 600,
    exerciseCategories: generateExerciseCategories(totalDurationMinutes),
    strengthProgress: generateRandomExerciseData(-5, 15), // 力量变化百分比
    enduranceProgress: generateRandomExerciseData(-5, 15), // 耐力变化百分比
    balanceProgress: generateRandomExerciseData(-5, 15), // 平衡能力变化百分比
    notes: ''
  };
});

// 用户1002的日运动统计（运动量较少）
const user1002DailyStats = generatePastDays(30).map(date => {
  const hasExercise = Math.random() > 0.5; // 50%的天数有运动记录
  const durationMinutes = hasExercise ? generateRandomExerciseData(10, 30) : 0;
  
  return {
    userId: '1002',
    date,
    totalDurationMinutes: durationMinutes,
    totalCaloriesBurned: Math.round(durationMinutes * 3.2),
    exerciseCount: hasExercise ? Math.ceil(durationMinutes / 25) : 0,
    exerciseCategories: hasExercise ? generateExerciseCategories(durationMinutes) : [],
    targetReached: durationMinutes >= 20,
    notes: ''
  };
});

// 用户1002的周运动统计
const user1002WeeklyStats = generatePastWeeks(12).map(weekData => {
  const totalDurationMinutes = generateRandomExerciseData(30, 150);
  const exerciseDays = generateRandomExerciseData(1, 4);
  
  return {
    userId: '1002',
    year: weekData.year,
    week: weekData.week,
    label: weekData.label,
    totalDurationMinutes,
    totalCaloriesBurned: Math.round(totalDurationMinutes * 3.2),
    exerciseDays,
    targetReached: exerciseDays >= 2 && totalDurationMinutes >= 100,
    exerciseCategories: generateExerciseCategories(totalDurationMinutes),
    notes: ''
  };
});

// 用户1002的月运动统计
const user1002MonthlyStats = generatePastMonths(12).map(monthData => {
  const totalDurationMinutes = generateRandomExerciseData(120, 600);
  const exerciseDays = generateRandomExerciseData(4, 16);
  
  return {
    userId: '1002',
    year: monthData.year,
    month: monthData.month,
    label: monthData.label,
    totalDurationMinutes,
    totalCaloriesBurned: Math.round(totalDurationMinutes * 3.2),
    exerciseDays,
    targetReached: exerciseDays >= 8 && totalDurationMinutes >= 400,
    exerciseCategories: generateExerciseCategories(totalDurationMinutes),
    strengthProgress: generateRandomExerciseData(-10, 10), // 力量变化百分比
    enduranceProgress: generateRandomExerciseData(-10, 10), // 耐力变化百分比
    balanceProgress: generateRandomExerciseData(-10, 10), // 平衡能力变化百分比
    notes: ''
  };
});

// 合并所有统计数据
const exerciseStats = {
  daily: [...user1001DailyStats, ...user1002DailyStats],
  weekly: [...user1001WeeklyStats, ...user1002WeeklyStats],
  monthly: [...user1001MonthlyStats, ...user1002MonthlyStats]
};

export default exerciseStats;
