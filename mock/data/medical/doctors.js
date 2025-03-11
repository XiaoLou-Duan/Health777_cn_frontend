/**
 * mock/data/medical/doctors.js - 医生数据
 * 
 * 包含医生信息和用户关注的医生数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 医生科室分类
const departments = [
  {
    id: 'dept001',
    name: '老年医学科',
    description: '专注于老年人综合健康管理',
    icon: '/static/icons/departments/geriatrics.png'
  },
  {
    id: 'dept002',
    name: '营养科',
    description: '提供专业的营养评估和膳食指导',
    icon: '/static/icons/departments/nutrition.png'
  },
  {
    id: 'dept003',
    name: '康复医学科',
    description: '专注于功能恢复和康复训练',
    icon: '/static/icons/departments/rehabilitation.png'
  },
  {
    id: 'dept004',
    name: '内分泌科',
    description: '处理荷尔蒙相关疾病',
    icon: '/static/icons/departments/endocrinology.png'
  },
  {
    id: 'dept005',
    name: '骨科',
    description: '骨骼、关节和肌肉疾病诊治',
    icon: '/static/icons/departments/orthopedics.png'
  }
];

// 医生职称
const doctorTitles = [
  {
    id: 'title001',
    name: '主任医师',
    level: 5
  },
  {
    id: 'title002',
    name: '副主任医师',
    level: 4
  },
  {
    id: 'title003',
    name: '主治医师',
    level: 3
  },
  {
    id: 'title004',
    name: '住院医师',
    level: 2
  },
  {
    id: 'title005',
    name: '医师',
    level: 1
  }
];

// 医生列表
const doctors = [
  {
    id: 'doctor001',
    name: '张立明',
    avatar: '/static/images/doctors/doctor1.jpg',
    gender: 'male',
    departmentId: 'dept001',
    hospital: '北京老年医学研究所附属医院',
    titleId: 'title001',
    specialties: ['肌少症', '老年综合征', '慢性病管理'],
    introduction: '张立明，男，主任医师，博士生导师，从事老年医学临床与研究工作30余年。擅长肌少症、老年综合征评估与治疗，发表论文100余篇，主持多项国家级科研项目。',
    score: 4.9,
    consultationCount: 2463,
    consultationFee: 300,
    isOnline: true,
    availableTimes: ['周一上午', '周三上午', '周五全天'],
    certificates: [
      '北京医科大学临床医学博士',
      '国家高级营养师',
      '中国老年医学会常务理事'
    ]
  },
  {
    id: 'doctor002',
    name: '李慧芳',
    avatar: '/static/images/doctors/doctor2.jpg',
    gender: 'female',
    departmentId: 'dept002',
    hospital: '上海市第一人民医院',
    titleId: 'title001',
    specialties: ['临床营养', '肌少症营养干预', '老年营养评估'],
    introduction: '李慧芳，女，主任医师，在老年人营养干预领域有20年以上经验，特别擅长肌少症患者的个性化营养方案制定。现任中国营养学会老年营养专业委员会副主任委员。',
    score: 4.8,
    consultationCount: 1865,
    consultationFee: 280,
    isOnline: true,
    availableTimes: ['周二全天', '周四全天', '周六上午'],
    certificates: [
      '中国医科大学营养学博士',
      '美国注册营养师',
      '中国营养学会理事'
    ]
  },
  {
    id: 'doctor003',
    name: '王健',
    avatar: '/static/images/doctors/doctor3.jpg',
    gender: 'male',
    departmentId: 'dept003',
    hospital: '广州市康复医院',
    titleId: 'title002',
    specialties: ['运动康复', '肌肉力量训练', '平衡功能训练'],
    introduction: '王健，男，副主任医师，康复医学博士，擅长老年人肌少症相关的康复训练与指导。曾在美国约翰霍普金斯医院进修，专注于老年人肌肉骨骼系统康复。',
    score: 4.7,
    consultationCount: 1456,
    consultationFee: 260,
    isOnline: false,
    availableTimes: ['周一下午', '周三全天', '周五下午'],
    certificates: [
      '中山大学康复医学博士',
      '美国康复治疗师协会会员',
      '中国康复医学会青年委员'
    ]
  },
  {
    id: 'doctor004',
    name: '陈雅静',
    avatar: '/static/images/doctors/doctor4.jpg',
    gender: 'female',
    departmentId: 'dept004',
    hospital: '北京协和医院',
    titleId: 'title002',
    specialties: ['代谢内分泌疾病', '骨质疏松', '老年内分泌调节'],
    introduction: '陈雅静，女，副主任医师，内分泌代谢病专家，在老年人激素相关疾病和代谢异常方面有丰富经验，特别在肌少症与内分泌失调的关系研究方面取得显著成果。',
    score: 4.9,
    consultationCount: 1785,
    consultationFee: 300,
    isOnline: true,
    availableTimes: ['周二上午', '周四下午', '周日全天'],
    certificates: [
      '北京协和医学院博士',
      '欧洲内分泌学会会员',
      '中华医学会内分泌学会委员'
    ]
  },
  {
    id: 'doctor005',
    name: '赵明朗',
    avatar: '/static/images/doctors/doctor5.jpg',
    gender: 'male',
    departmentId: 'dept005',
    hospital: '上海长征医院',
    titleId: 'title003',
    specialties: ['骨质疏松', '骨关节疾病', '老年骨折预防'],
    introduction: '赵明朗，男，主治医师，骨科医生，专注于老年骨质疏松和骨关节疾病的治疗和预防，对肌少症导致的骨骼问题有独特见解和丰富临床经验。',
    score: 4.6,
    consultationCount: 1230,
    consultationFee: 220,
    isOnline: true,
    availableTimes: ['周一全天', '周三下午', '周六下午'],
    certificates: [
      '复旦大学医学院博士',
      '中国骨质疏松学会会员',
      '上海市骨科医师协会委员'
    ]
  },
  {
    id: 'doctor006',
    name: '郑建华',
    avatar: '/static/images/doctors/doctor6.jpg',
    gender: 'male',
    departmentId: 'dept001',
    hospital: '北京老年医院',
    titleId: 'title003',
    specialties: ['老年综合评估', '肌少症筛查', '慢病管理'],
    introduction: '郑建华，男，主治医师，老年医学专家，在老年慢性病综合管理和评估方面有丰富经验，尤其擅长肌少症早期筛查和干预，长期从事社区老年健康宣教工作。',
    score: 4.7,
    consultationCount: 1367,
    consultationFee: 200,
    isOnline: false,
    availableTimes: ['周二下午', '周四上午', '周日上午'],
    certificates: [
      '首都医科大学老年医学硕士',
      '北京市优秀社区医生',
      '中国老年学会会员'
    ]
  },
  {
    id: 'doctor007',
    name: '刘芳',
    avatar: '/static/images/doctors/doctor7.jpg',
    gender: 'female',
    departmentId: 'dept002',
    hospital: '广州市第一人民医院',
    titleId: 'title003',
    specialties: ['老年营养评估', '营养不良干预', '肌少症膳食指导'],
    introduction: '刘芳，女，主治医师，营养科医生，擅长老年营养评估和指导，尤其在肌少症患者的蛋白质补充和膳食规划方面有独特方法，受到患者广泛好评。',
    score: 4.8,
    consultationCount: 1189,
    consultationFee: 220,
    isOnline: true,
    availableTimes: ['周一上午', '周四全天', '周六全天'],
    certificates: [
      '中山大学营养学硕士',
      '注册营养师',
      '广东省营养学会委员'
    ]
  }
];

// 用户关注的医生
const userFollowedDoctors = [
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor001',
    followTime: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    lastConsultTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    consultCount: 3,
    isRecommended: true
  },
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor002',
    followTime: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    lastConsultTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    consultCount: 2,
    isRecommended: true
  },
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor005',
    followTime: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    lastConsultTime: null,
    consultCount: 0,
    isRecommended: false
  }
];

// 医生推荐
const doctorRecommendations = [
  {
    id: generateRandomId(),
    doctorId: 'doctor001',
    title: '肌少症专家',
    reason: '长期致力于肌少症研究，诊疗经验丰富',
    order: 1
  },
  {
    id: generateRandomId(),
    doctorId: 'doctor002',
    title: '营养干预专家',
    reason: '在肌少症营养干预领域成果显著',
    order: 2
  },
  {
    id: generateRandomId(),
    doctorId: 'doctor003',
    title: '康复训练专家',
    reason: '擅长老年肌少症康复训练方案制定',
    order: 3
  },
  {
    id: generateRandomId(),
    doctorId: 'doctor004',
    title: '代谢疾病专家',
    reason: '肌少症代谢调节研究领域权威',
    order: 4
  }
];

export default {
  departments,
  doctorTitles,
  doctors,
  userFollowedDoctors,
  doctorRecommendations
};
