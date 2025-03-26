/**
 * mock/data/exercise/library.js - 运动库模拟数据
 * 
 * 包含适合老年人特别是肌少症患者的运动项目
 */

// 运动库列表数据
const exerciseLibrary = [
  {
    id: 'e001',
    name: '轻度步行',
    category: '有氧运动',
    image: '/static/images/exercise/walking.png',
    difficulty: 1, // 1-5，难度从低到高
    durationMinutes: 20,
    caloriesPerMinute: 3.5, // 每分钟消耗卡路里
    description: '轻度步行是最基础的有氧运动，适合所有年龄段的老年人，尤其是肌少症患者。在平地上以舒适的速度行走，可以帮助提高心肺功能和下肢力量。',
    sarcopeniaFriendly: true,
    benefits: ['提高心肺功能', '改善下肢力量', '促进血液循环', '减轻关节疼痛'],
    precautions: ['避免在极端天气下进行', '穿着合适的鞋子', '如感到不适请立即停止'],
    equipment: [],
    videoUrl: '/static/videos/exercise/walking.mp4',
    isRecommended: true,
    targetMuscles: ['腿部', '臀部'],
    mets: 2.5 // 代谢当量
  },
  {
    id: 'e002',
    name: '椅子坐立',
    category: '力量训练',
    image: '/static/images/exercise/chair-stand.png',
    difficulty: 2,
    durationMinutes: 10,
    caloriesPerMinute: 4.0,
    description: '椅子坐立运动对增强下肢力量非常有效，特别适合肌少症患者。从坐姿开始，双脚平放地面，尽量不用手臂支撑站起，然后缓慢坐下，重复进行。',
    sarcopeniaFriendly: true,
    benefits: ['增强腿部和核心力量', '改善平衡能力', '促进下肢血液循环', '提高日常活动能力'],
    precautions: ['使用稳固的椅子', '如感到头晕或不适请立即停止', '避免猛烈动作'],
    equipment: ['稳固的椅子'],
    videoUrl: '/static/videos/exercise/chair-stand.mp4',
    isRecommended: true,
    targetMuscles: ['大腿肌群', '臀部肌群', '核心肌群'],
    mets: 3.0
  },
  {
    id: 'e003',
    name: '上肢弹力带训练',
    category: '力量训练',
    image: '/static/images/exercise/resistance-band-arms.png',
    difficulty: 2,
    durationMinutes: 15,
    caloriesPerMinute: 3.8,
    description: '使用弹力带进行上肢训练，可以有效增强手臂肌肉力量，延缓肌少症进展。包括弹力带划船、弹力带二头肌弯举等动作。',
    sarcopeniaFriendly: true,
    benefits: ['增强上肢肌肉力量', '改善肌肉耐力', '促进上肢血液循环', '延缓肌肉流失'],
    precautions: ['选择合适阻力的弹力带', '保持正确姿势', '避免过度拉伸', '控制动作速度'],
    equipment: ['弹力带'],
    videoUrl: '/static/videos/exercise/resistance-band-arms.mp4',
    isRecommended: true,
    targetMuscles: ['二头肌', '三头肌', '肩部肌群', '背部肌群'],
    mets: 2.8
  },
  {
    id: 'e004',
    name: '太极拳',
    category: '平衡训练',
    image: '/static/images/exercise/tai-chi.png',
    difficulty: 3,
    durationMinutes: 30,
    caloriesPerMinute: 3.0,
    description: '太极拳是一种传统的中国武术，动作缓慢而优雅，对提高平衡能力、肌肉控制和心肺功能都有好处。特别适合老年人和肌少症患者。',
    sarcopeniaFriendly: true,
    benefits: ['提高平衡能力', '增强核心力量', '改善肌肉控制', '降低跌倒风险', '减轻压力'],
    precautions: ['初学者建议在指导下学习', '根据自身情况调整动作幅度', '保持呼吸均匀'],
    equipment: [],
    videoUrl: '/static/videos/exercise/tai-chi.mp4',
    isRecommended: true,
    targetMuscles: ['核心肌群', '腿部肌群', '手臂肌群'],
    mets: 2.2
  },
  {
    id: 'e005',
    name: '水中有氧运动',
    category: '有氧运动',
    image: '/static/images/exercise/water-aerobics.png',
    difficulty: 3,
    durationMinutes: 30,
    caloriesPerMinute: 5.0,
    description: '水中有氧运动利用水的浮力减轻关节压力，同时水的阻力可以增加肌肉锻炼效果。适合关节不适或肌少症患者。',
    sarcopeniaFriendly: true,
    benefits: ['全身肌肉锻炼', '减轻关节压力', '提高心肺功能', '增强肌肉耐力', '改善平衡能力'],
    precautions: ['在有救生员的泳池进行', '水温适宜', '避免单独锻炼', '注意水中安全'],
    equipment: ['可选：浮板、水中哑铃'],
    videoUrl: '/static/videos/exercise/water-aerobics.mp4',
    isRecommended: true,
    targetMuscles: ['全身肌群'],
    mets: 3.5
  },
  {
    id: 'e006',
    name: '轻度瑜伽',
    category: '柔韧性训练',
    image: '/static/images/exercise/gentle-yoga.png',
    difficulty: 2,
    durationMinutes: 25,
    caloriesPerMinute: 3.0,
    description: '轻度瑜伽包括简单的瑜伽姿势和呼吸练习，可以提高柔韧性、平衡能力和肌肉控制。适合老年人和肌少症患者的温和锻炼方式。',
    sarcopeniaFriendly: true,
    benefits: ['提高柔韧性', '改善平衡能力', '增强核心力量', '促进身心放松', '改善呼吸功能'],
    precautions: ['根据自身灵活性调整动作', '不要强行保持不舒服的姿势', '呼吸均匀', '使用瑜伽垫'],
    equipment: ['瑜伽垫', '可选：瑜伽砖、瑜伽带'],
    videoUrl: '/static/videos/exercise/gentle-yoga.mp4',
    isRecommended: true,
    targetMuscles: ['核心肌群', '下肢肌群', '上肢肌群'],
    mets: 2.0
  },
  {
    id: 'e007',
    name: '站立平衡训练',
    category: '平衡训练',
    image: '/static/images/exercise/balance-training.png',
    difficulty: 2,
    durationMinutes: 10,
    caloriesPerMinute: 2.5,
    description: '站立平衡训练包括单腿站立、踮脚站立等简单动作，可以有效提高平衡能力和下肢肌肉控制，降低老年人跌倒风险。',
    sarcopeniaFriendly: true,
    benefits: ['提高平衡能力', '增强下肢肌肉', '改善姿势控制', '降低跌倒风险'],
    precautions: ['在稳固物体旁进行以防跌倒', '逐渐增加难度', '如感觉不稳请立即扶住支撑物'],
    equipment: ['可选：扶手或稳固椅子作为支撑'],
    videoUrl: '/static/videos/exercise/balance-training.mp4',
    isRecommended: true,
    targetMuscles: ['腿部肌群', '核心肌群', '踝部肌群'],
    mets: 1.8
  },
  {
    id: 'e008',
    name: '下肢弹力带训练',
    category: '力量训练',
    image: '/static/images/exercise/resistance-band-legs.png',
    difficulty: 3,
    durationMinutes: 15,
    caloriesPerMinute: 4.0,
    description: '使用弹力带进行下肢训练，可以有效增强腿部和臀部肌肉力量，对肌少症患者尤其有益。包括弹力带侧向踏步、腿部伸展等动作。',
    sarcopeniaFriendly: true,
    benefits: ['增强下肢肌肉力量', '改善髋关节灵活性', '增强腿部稳定性', '提高日常活动能力'],
    precautions: ['选择合适阻力的弹力带', '注意保持平衡', '动作缓慢可控', '避免过度拉伸'],
    equipment: ['弹力带'],
    videoUrl: '/static/videos/exercise/resistance-band-legs.mp4',
    isRecommended: true,
    targetMuscles: ['大腿肌群', '臀部肌群', '小腿肌群'],
    mets: 3.0
  },
  {
    id: 'e009',
    name: '坐姿上肢训练',
    category: '力量训练',
    image: '/static/images/exercise/seated-arm-exercise.png',
    difficulty: 1,
    durationMinutes: 15,
    caloriesPerMinute: 2.8,
    description: '坐姿上肢训练是一种适合行动不便或平衡能力较差的老年人的运动。使用轻量哑铃进行简单的上肢力量训练，可以安全有效地增强上肢力量。',
    sarcopeniaFriendly: true,
    benefits: ['增强上肢肌肉力量', '提高手臂耐力', '改善肩部活动度', '延缓肌肉流失'],
    precautions: ['使用适当重量的哑铃', '保持正确坐姿', '动作缓慢可控', '注意呼吸节奏'],
    equipment: ['轻量哑铃', '稳固的椅子'],
    videoUrl: '/static/videos/exercise/seated-arm-exercise.mp4',
    isRecommended: true,
    targetMuscles: ['二头肌', '三头肌', '肩部肌群'],
    mets: 2.0
  },
  {
    id: 'e010',
    name: '深呼吸练习',
    category: '呼吸训练',
    image: '/static/images/exercise/breathing-exercise.png',
    difficulty: 1,
    durationMinutes: 10,
    caloriesPerMinute: 1.0,
    description: '深呼吸练习是一种简单但有效的放松方法，可以改善肺活量、降低压力和焦虑。适合任何年龄和健康状况的老年人。',
    sarcopeniaFriendly: true,
    benefits: ['改善肺活量', '降低压力和焦虑', '促进放松', '改善睡眠质量', '辅助其他运动恢复'],
    precautions: ['采取舒适坐姿或躺姿', '呼吸自然不勉强', '如感到头晕请恢复正常呼吸'],
    equipment: [],
    videoUrl: '/static/videos/exercise/breathing-exercise.mp4',
    isRecommended: true,
    targetMuscles: ['呼吸肌'],
    mets: 1.0
  }
];

// 运动类别
const exerciseCategories = [
  { id: 'cat1', name: '有氧运动', description: '提高心肺功能的运动' },
  { id: 'cat2', name: '力量训练', description: '增强肌肉力量的运动' },
  { id: 'cat3', name: '平衡训练', description: '提高平衡能力的运动' },
  { id: 'cat4', name: '柔韧性训练', description: '提高关节活动度和肌肉伸展性的运动' },
  { id: 'cat5', name: '呼吸训练', description: '提高肺活量和呼吸效率的运动' }
];

// 运动难度等级
const difficultyLevels = [
  { value: 1, label: '非常简单', description: '适合新手和体弱者' },
  { value: 2, label: '简单', description: '适合大多数老年人' },
  { value: 3, label: '中等', description: '适合有一定锻炼基础的老年人' },
  { value: 4, label: '较难', description: '适合锻炼水平较高的老年人' },
  { value: 5, label: '难', description: '适合运动能力强的老年人，需要谨慎尝试' }
];

export default {
  exerciseLibrary,
  exerciseCategories,
  difficultyLevels
};
