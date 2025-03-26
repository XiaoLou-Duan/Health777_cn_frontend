/**
 * mock/nutrition.js - 营养模块API模拟
 */
import nutritionData from './data/nutrition';
import { success, fail, unauthorized, isAuthorized, generateId } from './utils/mock-helper';

/**
 * 获取今日摄入记录
 */
function getTodayIntakes(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 获取今天的日期（YYYY-MM-DD格式）
  const today = new Date().toISOString().split('T')[0];
  
  // 筛选当天的摄入记录
  const intakes = nutritionData.foodIntakes.filter(intake => {
    const intakeDate = new Date(intake.timestamp).toISOString().split('T')[0];
    return intake.userId === userId && intakeDate === today;
  });
  
  return success(intakes);
}

/**
 * 添加食物摄入记录
 */
function addFoodIntake(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const food = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 验证必要字段
  if (!food.foodId || !food.amount) {
    return fail('缺少必要字段');
  }
  
  // 查找食物信息
  const foodInfo = nutritionData.foodLibrary.find(f => f.id === food.foodId);
  
  if (!foodInfo) {
    return fail('食物不存在');
  }
  
  // 计算营养成分
  const ratio = food.amount / 100; // 按每100克计算
  
  // 创建摄入记录
  const intake = {
    id: generateId(),
    userId,
    foodId: food.foodId,
    foodName: foodInfo.name,
    amount: food.amount,
    protein: +(foodInfo.protein * ratio).toFixed(2),
    calories: +(foodInfo.calories * ratio).toFixed(2),
    mealType: food.mealType || 'snack',
    timestamp: food.timestamp || new Date().toISOString(),
    imageUrl: foodInfo.image,
    notes: food.notes || ''
  };
  
  // 保存记录
  nutritionData.foodIntakes.push(intake);
  
  return success(intake);
}

/**
 * 删除食物摄入记录
 */
function removeFoodIntake(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 提取ID
  const intakeId = options.url.split('/').pop();
  
  // 查找记录
  const intakeIndex = nutritionData.foodIntakes.findIndex(intake => 
    intake.id === intakeId && intake.userId === userId
  );
  
  if (intakeIndex === -1) {
    return fail('记录不存在或无权删除');
  }
  
  // 删除记录
  nutritionData.foodIntakes.splice(intakeIndex, 1);
  
  return success(null);
}

/**
 * 获取蛋白质统计数据
 */
function getProteinStats(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 查询参数
  const type = new URL('http://example.com' + options.url).searchParams.get('type') || 'daily';
  
  // 获取对应类型的统计数据
  let stats = [];
  
  if (type === 'daily') {
    stats = nutritionData.proteinStats.daily.filter(stat => stat.userId === userId);
  } else if (type === 'weekly') {
    stats = nutritionData.proteinStats.weekly.filter(stat => stat.userId === userId);
  } else if (type === 'monthly') {
    stats = nutritionData.proteinStats.monthly.filter(stat => stat.userId === userId);
  } else {
    return fail('无效的统计类型');
  }
  
  return success(stats);
}

/**
 * 上传食物图片
 */
function uploadFoodImage(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 模拟图片上传
  const imageUrl = `/static/images/uploads/food_${Date.now()}.jpg`;
  
  return success({ url: imageUrl });
}

/**
 * 识别食物
 */
function recognizeFood(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const params = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 验证必要字段
  if (!params.imageUrl) {
    return fail('缺少图片URL');
  }
  
  // 模拟食物识别
  // 随机选择1-3种食物
  const foodCount = Math.floor(Math.random() * 3) + 1;
  const foods = [];
  
  for (let i = 0; i < foodCount; i++) {
    const randomIndex = Math.floor(Math.random() * nutritionData.foodLibrary.length);
    const food = nutritionData.foodLibrary[randomIndex];
    
    // 随机生成食物量和置信度
    const amount = Math.floor(Math.random() * 150) + 50; // 50-200g
    const confidence = +(Math.random() * 0.3 + 0.7).toFixed(2); // 0.7-1.0
    
    // 计算营养成分
    const ratio = amount / 100;
    
    foods.push({
      name: food.name,
      confidence,
      amount,
      protein: +(food.protein * ratio).toFixed(2),
      calories: +(food.calories * ratio).toFixed(2)
    });
  }
  
  return success(foods);
}

/**
 * 获取食物识别历史
 */
function getRecognitionHistory(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 筛选用户的识别历史
  const history = nutritionData.recognitionHistory.filter(record => record.userId === userId);
  
  return success(history);
}

/**
 * 获取食物库
 */
function getFoodLibrary(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 查询参数
  const url = new URL('http://example.com' + options.url);
  const category = url.searchParams.get('category');
  const keyword = url.searchParams.get('keyword');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  
  // 筛选食物
  let foods = [...nutritionData.foodLibrary];
  
  if (category) {
    foods = foods.filter(food => food.category === category);
  }
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    foods = foods.filter(food => 
      food.name.toLowerCase().includes(lowerKeyword) || 
      food.description.toLowerCase().includes(lowerKeyword) ||
      food.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }
  
  // 分页
  const total = foods.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const result = foods.slice(start, end);
  
  return success({
    list: result,
    pagination: {
      total,
      page,
      pageSize,
      pages: Math.ceil(total / pageSize)
    }
  });
}

/**
 * 获取饮食建议
 */
function getDietSuggestions(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 筛选用户的饮食建议
  const suggestions = nutritionData.dietSuggestions.filter(suggestion => suggestion.userId === userId);
  
  return success(suggestions);
}

/**
 * 获取乳清蛋白提醒
 */
function getWheyProteinReminders(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 筛选用户的乳清蛋白提醒
  const reminders = nutritionData.wheyProteinReminders.filter(reminder => reminder.userId === userId);
  
  return success(reminders);
}

/**
 * 添加乳清蛋白提醒
 */
function addWheyProteinReminder(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const reminderData = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 验证必要字段
  if (!reminderData.time || !reminderData.title || !reminderData.message) {
    return fail('缺少必要字段');
  }
  
  // 创建提醒
  const reminder = {
    id: generateId(),
    userId,
    time: reminderData.time,
    daysOfWeek: reminderData.daysOfWeek || [1, 2, 3, 4, 5, 6, 7],
    enabled: reminderData.enabled !== false,
    title: reminderData.title,
    message: reminderData.message,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    completionStatus: {}
  };
  
  // 保存提醒
  nutritionData.wheyProteinReminders.push(reminder);
  
  return success(reminder);
}

/**
 * 更新乳清蛋白提醒
 */
function updateWheyProteinReminder(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  const { body } = options;
  const updates = JSON.parse(body || '{}');
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 提取ID
  const reminderId = options.url.split('/').pop();
  
  // 查找提醒
  const reminderIndex = nutritionData.wheyProteinReminders.findIndex(reminder => 
    reminder.id === reminderId && reminder.userId === userId
  );
  
  if (reminderIndex === -1) {
    return fail('提醒不存在或无权修改');
  }
  
  // 更新提醒
  nutritionData.wheyProteinReminders[reminderIndex] = {
    ...nutritionData.wheyProteinReminders[reminderIndex],
    ...updates,
    updateTime: new Date().toISOString()
  };
  
  return success(null);
}

/**
 * 删除乳清蛋白提醒
 */
function removeWheyProteinReminder(options) {
  if (!isAuthorized(options)) {
    return unauthorized();
  }
  
  // 从令牌解析用户ID
  const token = options.headers.Authorization.split(' ')[1];
  const userId = token.split('_')[1];
  
  // 提取ID
  const reminderId = options.url.split('/').pop();
  
  // 查找提醒
  const reminderIndex = nutritionData.wheyProteinReminders.findIndex(reminder => 
    reminder.id === reminderId && reminder.userId === userId
  );
  
  if (reminderIndex === -1) {
    return fail('提醒不存在或无权删除');
  }
  
  // 删除提醒
  nutritionData.wheyProteinReminders.splice(reminderIndex, 1);
  
  return success(null);
}

// API路由映射
export default {
  'GET /api/nutrition/today-intakes': getTodayIntakes,
  'POST /api/nutrition/food-intake': addFoodIntake,
  'DELETE /api/nutrition/food-intake/:id': removeFoodIntake,
  'GET /api/nutrition/protein-stats': getProteinStats,
  'POST /api/nutrition/upload-food-image': uploadFoodImage,
  'POST /api/nutrition/recognize-food': recognizeFood,
  'GET /api/nutrition/recognition-history': getRecognitionHistory,
  'GET /api/nutrition/food-library': getFoodLibrary,
  'GET /api/nutrition/diet-suggestions': getDietSuggestions,
  'GET /api/nutrition/whey-protein-reminders': getWheyProteinReminders,
  'POST /api/nutrition/whey-protein-reminder': addWheyProteinReminder,
  'PUT /api/nutrition/whey-protein-reminder/:id': updateWheyProteinReminder,
  'DELETE /api/nutrition/whey-protein-reminder/:id': removeWheyProteinReminder
};
