/**
 * mock/data/nutrition.js - 营养模块模拟数据
 */

// 食物库
const foodLibrary = [
  {
    id: 'f001',
    name: '鸡胸肉',
    category: '肉类',
    image: '/static/images/food/chicken-breast.png',
    protein: 25.2, // 每100g蛋白质含量(g)
    calories: 165, // 每100g卡路里(kcal)
    fat: 3.6, // 每100g脂肪含量(g)
    carbs: 0, // 每100g碳水化合物含量(g)
    fiber: 0, // 每100g膳食纤维(g)
    description: '鸡胸肉是优质蛋白质来源，脂肪含量低，适合老年人日常补充蛋白质。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['水煮', '蒸', '炖', '煎'],
    tags: ['高蛋白', '低脂肪', '易消化']
  },
  {
    id: 'f002',
    name: '三文鱼',
    category: '鱼类',
    image: '/static/images/food/salmon.png',
    protein: 20.4,
    calories: 206,
    fat: 13.4,
    carbs: 0,
    fiber: 0,
    description: '三文鱼富含优质蛋白质和欧米伽3脂肪酸，有助于维持骨骼和肌肉健康。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['蒸', '煎', '烤'],
    tags: ['高蛋白', '富含欧米伽3', '抗炎']
  },
  {
    id: 'f003',
    name: '豆腐',
    category: '豆制品',
    image: '/static/images/food/tofu.png',
    protein: 8.1,
    calories: 76,
    fat: 4.2,
    carbs: 1.9,
    fiber: 0.3,
    description: '豆腐是植物蛋白的良好来源，易于消化吸收，适合老年人日常食用。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['蒸', '煮', '炖', '炒'],
    tags: ['植物蛋白', '易消化', '无胆固醇']
  },
  {
    id: 'f004',
    name: '鸡蛋',
    category: '蛋类',
    image: '/static/images/food/egg.png',
    protein: 12.5,
    calories: 143,
    fat: 9.5,
    carbs: 0.7,
    fiber: 0,
    description: '鸡蛋含有全面的氨基酸，是优质蛋白质的来源，蛋白质可利用率高。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['水煮', '蒸', '炒', '煎'],
    tags: ['全面氨基酸', '高生物利用率', '维生素D']
  },
  {
    id: 'f005',
    name: '牛奶',
    category: '乳制品',
    image: '/static/images/food/milk.png',
    protein: 3.3,
    calories: 64,
    fat: 3.6,
    carbs: 4.8,
    fiber: 0,
    description: '牛奶含有优质蛋白质和钙质，有助于维持骨骼健康和肌肉功能。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['直接饮用', '加热'],
    tags: ['优质蛋白', '高钙', '维生素D']
  },
  {
    id: 'f006',
    name: '乳清蛋白粉',
    category: '蛋白质补充剂',
    image: '/static/images/food/whey-protein.png',
    protein: 80,
    calories: 380,
    fat: 3,
    carbs: 8,
    fiber: 0,
    description: '乳清蛋白是高质量的蛋白质补充剂，针对肌少症患者，有助于维持和增加肌肉质量。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['冲调'],
    tags: ['高吸收率', '全面氨基酸', '快速吸收']
  },
  {
    id: 'f007',
    name: '希腊酸奶',
    category: '乳制品',
    image: '/static/images/food/greek-yogurt.png',
    protein: 10,
    calories: 110,
    fat: 5,
    carbs: 3.6,
    fiber: 0,
    description: '希腊酸奶蛋白质含量高，含有益生菌，有助于肠道健康和蛋白质吸收。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['直接食用', '搭配水果'],
    tags: ['高蛋白', '益生菌', '低碳水']
  },
  {
    id: 'f008',
    name: '杏仁',
    category: '坚果',
    image: '/static/images/food/almonds.png',
    protein: 21.2,
    calories: 607,
    fat: 49.4,
    carbs: 21.7,
    fiber: 12.5,
    description: '杏仁富含蛋白质、健康脂肪和纤维，适合作为老年人的零食。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['直接食用', '烘焙'],
    tags: ['健康脂肪', '维生素E', '植物蛋白']
  },
  {
    id: 'f009',
    name: '金枪鱼',
    category: '鱼类',
    image: '/static/images/food/tuna.png',
    protein: 29.9,
    calories: 144,
    fat: 1.1,
    carbs: 0,
    fiber: 0,
    description: '金枪鱼蛋白质含量极高，脂肪含量低，是增加蛋白质摄入的理想选择。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['水煮', '煎', '烤'],
    tags: ['超高蛋白', '低脂肪', '富含欧米伽3']
  },
  {
    id: 'f010',
    name: '菠菜',
    category: '蔬菜',
    image: '/static/images/food/spinach.png',
    protein: 2.9,
    calories: 23,
    fat: 0.4,
    carbs: 3.6,
    fiber: 2.2,
    description: '菠菜虽然蛋白质含量不高，但富含铁质和抗氧化物，配合高蛋白食物一起食用更佳。',
    isRecommended: true,
    sarcopeniaFriendly: true,
    cookingMethods: ['炒', '煮汤', '凉拌'],
    tags: ['富含铁质', '抗氧化', '低热量']
  }
];

// 用户食物摄入记录
const foodIntakes = [
  {
    id: 'intake001',
    userId: '001',
    foodId: 'f001',
    foodName: '鸡胸肉',
    amount: 120, // 克
    protein: 30.24, // 克
    calories: 198, // 卡路里
    mealType: 'lunch', // breakfast, lunch, dinner, snack
    timestamp: '2025-03-01T12:15:00.000Z',
    imageUrl: '/static/images/food/chicken-breast.png',
    notes: '午餐吃的鸡胸肉，搭配了一些蔬菜。'
  },
  {
    id: 'intake002',
    userId: '001',
    foodId: 'f003',
    foodName: '豆腐',
    amount: 150,
    protein: 12.15,
    calories: 114,
    mealType: 'dinner',
    timestamp: '2025-03-01T18:30:00.000Z',
    imageUrl: '/static/images/food/tofu.png',
    notes: '晚餐吃的豆腐，比较好消化。'
  },
  {
    id: 'intake003',
    userId: '001',
    foodId: 'f004',
    foodName: '鸡蛋',
    amount: 100, // 约两个鸡蛋
    protein: 12.5,
    calories: 143,
    mealType: 'breakfast',
    timestamp: '2025-03-01T07:45:00.000Z',
    imageUrl: '/static/images/food/egg.png',
    notes: '早餐煮了两个鸡蛋。'
  },
  {
    id: 'intake004',
    userId: '001',
    foodId: 'f005',
    foodName: '牛奶',
    amount: 250, // 毫升
    protein: 8.25,
    calories: 160,
    mealType: 'breakfast',
    timestamp: '2025-03-01T07:50:00.000Z',
    imageUrl: '/static/images/food/milk.png',
    notes: '早餐喝了一杯牛奶。'
  },
  {
    id: 'intake005',
    userId: '001',
    foodId: 'f006',
    foodName: '乳清蛋白粉',
    amount: 30,
    protein: 24,
    calories: 114,
    mealType: 'snack',
    timestamp: '2025-03-01T15:20:00.000Z',
    imageUrl: '/static/images/food/whey-protein.png',
    notes: '下午加餐补充了一份蛋白粉。'
  },
  {
    id: 'intake006',
    userId: '002',
    foodId: 'f002',
    foodName: '三文鱼',
    amount: 100,
    protein: 20.4,
    calories: 206,
    mealType: 'lunch',
    timestamp: '2025-03-01T12:30:00.000Z',
    imageUrl: '/static/images/food/salmon.png',
    notes: '午餐吃的三文鱼，非常美味。'
  },
  {
    id: 'intake007',
    userId: '002',
    foodId: 'f007',
    foodName: '希腊酸奶',
    amount: 150,
    protein: 15,
    calories: 165,
    mealType: 'breakfast',
    timestamp: '2025-03-01T08:00:00.000Z',
    imageUrl: '/static/images/food/greek-yogurt.png',
    notes: '早餐吃的希腊酸奶，搭配了一些水果。'
  }
];

// 蛋白质摄入统计
const proteinStats = {
  daily: [
    {
      userId: '001',
      date: '2025-03-01',
      target: 88,
      actual: 87.14,
      percentage: 99.02,
      meals: {
        breakfast: 20.75,
        lunch: 30.24,
        dinner: 12.15,
        snack: 24
      }
    },
    {
      userId: '001',
      date: '2025-02-28',
      target: 88,
      actual: 75.32,
      percentage: 85.59,
      meals: {
        breakfast: 18.5,
        lunch: 25.12,
        dinner: 22.7,
        snack: 9
      }
    },
    {
      userId: '001',
      date: '2025-02-27',
      target: 88,
      actual: 92.65,
      percentage: 105.28,
      meals: {
        breakfast: 20.75,
        lunch: 29.9,
        dinner: 30,
        snack: 12
      }
    },
    {
      userId: '002',
      date: '2025-03-01',
      target: 72,
      actual: 55.4,
      percentage: 76.94,
      meals: {
        breakfast: 15,
        lunch: 20.4,
        dinner: 20,
        snack: 0
      }
    }
  ],
  weekly: [
    {
      userId: '001',
      weekStart: '2025-02-24',
      weekEnd: '2025-03-02',
      target: 616, // 7天目标总和
      actual: 576.32,
      percentage: 93.56,
      dailyAverage: 82.33,
      days: [
        { date: '2025-02-24', actual: 80.54 },
        { date: '2025-02-25', actual: 77.42 },
        { date: '2025-02-26', actual: 85.12 },
        { date: '2025-02-27', actual: 92.65 },
        { date: '2025-02-28', actual: 75.32 },
        { date: '2025-03-01', actual: 87.14 },
        { date: '2025-03-02', actual: 78.13 }
      ]
    },
    {
      userId: '002',
      weekStart: '2025-02-24',
      weekEnd: '2025-03-02',
      target: 504, // 7天目标总和
      actual: 435.62,
      percentage: 86.43,
      dailyAverage: 62.23,
      days: [
        { date: '2025-02-24', actual: 58.74 },
        { date: '2025-02-25', actual: 65.32 },
        { date: '2025-02-26', actual: 62.18 },
        { date: '2025-02-27', actual: 69.45 },
        { date: '2025-02-28', actual: 63.23 },
        { date: '2025-03-01', actual: 55.4 },
        { date: '2025-03-02', actual: 61.3 }
      ]
    }
  ],
  monthly: [
    {
      userId: '001',
      month: '2025-02',
      target: 2464, // 28天目标总和
      actual: 2298.56,
      percentage: 93.28,
      dailyAverage: 82.09,
      weeks: [
        { weekStart: '2025-02-03', weekEnd: '2025-02-09', average: 79.32 },
        { weekStart: '2025-02-10', weekEnd: '2025-02-16', average: 83.45 },
        { weekStart: '2025-02-17', weekEnd: '2025-02-23', average: 85.24 },
        { weekStart: '2025-02-24', weekEnd: '2025-03-02', average: 82.33 }
      ]
    },
    {
      userId: '002',
      month: '2025-02',
      target: 2016, // 28天目标总和
      actual: 1762.44,
      percentage: 87.42,
      dailyAverage: 62.94,
      weeks: [
        { weekStart: '2025-02-03', weekEnd: '2025-02-09', average: 60.12 },
        { weekStart: '2025-02-10', weekEnd: '2025-02-16', average: 64.28 },
        { weekStart: '2025-02-17', weekEnd: '2025-02-23', average: 65.12 },
        { weekStart: '2025-02-24', weekEnd: '2025-03-02', average: 62.23 }
      ]
    }
  ]
};

// 食物识别历史
const recognitionHistory = [
  {
    id: 'recog001',
    userId: '001',
    imageUrl: '/static/images/recognition/chicken-meal.png',
    timestamp: '2025-03-01T12:10:00.000Z',
    recognizedFood: [
      {
        name: '鸡胸肉',
        confidence: 0.92,
        amount: 120,
        protein: 30.24,
        calories: 198
      },
      {
        name: '西兰花',
        confidence: 0.85,
        amount: 80,
        protein: 2.24,
        calories: 27.2
      }
    ],
    isAddedToIntake: true
  },
  {
    id: 'recog002',
    userId: '001',
    imageUrl: '/static/images/recognition/tofu-dish.png',
    timestamp: '2025-03-01T18:25:00.000Z',
    recognizedFood: [
      {
        name: '豆腐',
        confidence: 0.88,
        amount: 150,
        protein: 12.15,
        calories: 114
      },
      {
        name: '青菜',
        confidence: 0.83,
        amount: 100,
        protein: 1.8,
        calories: 25
      }
    ],
    isAddedToIntake: true
  },
  {
    id: 'recog003',
    userId: '002',
    imageUrl: '/static/images/recognition/salmon-plate.png',
    timestamp: '2025-03-01T12:25:00.000Z',
    recognizedFood: [
      {
        name: '三文鱼',
        confidence: 0.94,
        amount: 100,
        protein: 20.4,
        calories: 206
      },
      {
        name: '米饭',
        confidence: 0.89,
        amount: 150,
        protein: 4.35,
        calories: 195
      }
    ],
    isAddedToIntake: true
  }
];

// 饮食建议
const dietSuggestions = [
  {
    id: 'sug001',
    userId: '001',
    title: '增加蛋白质摄入的建议',
    content: '根据您最近一周的蛋白质摄入数据，您的蛋白质摄入略低于目标值。建议增加高蛋白食物的摄入，如鸡胸肉、金枪鱼和乳清蛋白。特别是早餐和加餐时可以补充优质蛋白。',
    type: 'protein',
    priority: 'high',
    timestamp: '2025-03-02T08:00:00.000Z',
    recommendedFoods: ['f001', 'f009', 'f006'],
    isRead: false
  },
  {
    id: 'sug002',
    userId: '001',
    title: '增加健康脂肪摄入',
    content: '您的饮食中健康脂肪摄入可能不足。建议适量增加如三文鱼、牛油果、橄榄油等含有健康脂肪的食物，有助于提高蛋白质吸收和利用效率。',
    type: 'fat',
    priority: 'medium',
    timestamp: '2025-03-01T09:30:00.000Z',
    recommendedFoods: ['f002', 'f008'],
    isRead: true
  },
  {
    id: 'sug003',
    userId: '002',
    title: '蛋白质摄入不足警告',
    content: '您最近一周的蛋白质摄入显著低于目标值，这可能会影响您的肌肉健康。建议增加高蛋白食物的摄入，如希腊酸奶、鸡肉和鱼类。如有必要，可考虑在医生指导下使用蛋白质补充剂。',
    type: 'protein',
    priority: 'high',
    timestamp: '2025-03-02T08:15:00.000Z',
    recommendedFoods: ['f001', 'f002', 'f007', 'f006'],
    isRead: false
  }
];

// 乳清蛋白提醒
const wheyProteinReminders = [
  {
    id: 'wpr001',
    userId: '001',
    time: '15:00', // 每天下午3点
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 每天
    enabled: true,
    title: '下午加餐蛋白粉提醒',
    message: '现在是下午加餐时间，记得补充30克乳清蛋白粉，有助于达成每日蛋白质目标。',
    createTime: '2025-02-15T10:00:00.000Z',
    updateTime: '2025-02-20T14:30:00.000Z',
    completionStatus: {
      '2025-03-01': 'completed',
      '2025-02-28': 'completed',
      '2025-02-27': 'missed'
    }
  },
  {
    id: 'wpr002',
    userId: '001',
    time: '21:00', // 每天晚上9点
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 每天
    enabled: true,
    title: '睡前蛋白粉提醒',
    message: '睡前适量补充蛋白质有助于夜间肌肉修复，建议饮用20克乳清蛋白或酪蛋白。',
    createTime: '2025-02-15T10:15:00.000Z',
    updateTime: '2025-02-20T14:35:00.000Z',
    completionStatus: {
      '2025-03-01': 'pending',
      '2025-02-28': 'completed',
      '2025-02-27': 'completed'
    }
  },
  {
    id: 'wpr003',
    userId: '002',
    time: '10:00', // 每天上午10点
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // 每天
    enabled: true,
    title: '上午加餐蛋白粉提醒',
    message: '上午加餐时间到了，建议补充25克乳清蛋白，帮助达成每日蛋白质目标。',
    createTime: '2025-02-18T09:00:00.000Z',
    updateTime: '2025-02-25T11:20:00.000Z',
    completionStatus: {
      '2025-03-01': 'completed',
      '2025-02-28': 'missed',
      '2025-02-27': 'completed'
    }
  }
];

export default {
  foodLibrary,
  foodIntakes,
  proteinStats,
  recognitionHistory,
  dietSuggestions,
  wheyProteinReminders
};
