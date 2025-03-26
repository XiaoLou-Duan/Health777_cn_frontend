/**
 * mock/data/medical/records.js - 医疗记录数据
 * 
 * 包含健康档案、检查记录和处方数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 用户健康档案
const healthProfiles = [
  {
    id: generateRandomId(),
    userId: '1001',
    name: '李大爷',
    gender: 'male',
    birthdate: '1952-05-15',
    height: 165,
    weight: 58,
    bmi: 21.3,
    bloodType: 'A',
    allergies: ['青霉素', '海鲜'],
    chronicDiseases: ['高血压', '肌少症'],
    familyHistory: ['父亲-糖尿病', '母亲-高血压'],
    medications: [
      {
        name: '厄贝沙坦片',
        dosage: '150mg',
        frequency: '每日一次',
        startDate: '2015-03-10',
        endDate: null
      },
      {
        name: '钙片',
        dosage: '600mg',
        frequency: '每日一次',
        startDate: '2022-01-15',
        endDate: null
      }
    ],
    emergencyContact: {
      name: '李小明',
      relationship: '儿子',
      phone: '13812345678'
    },
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
  }
];

// 检查类型
const examinationTypes = [
  {
    id: 'exam001',
    name: '肌肉质量分析',
    description: '通过生物电阻抗分析测量肌肉质量',
    category: 'physical', // physical-体格检查 laboratory-实验室检查 imaging-影像学检查
    unit: 'kg',
    normalRange: '男性>27.5kg, 女性>16.0kg',
    importance: 'high'
  },
  {
    id: 'exam002',
    name: '握力测试',
    description: '测量手部握力强度',
    category: 'physical',
    unit: 'kg',
    normalRange: '男性>26kg, 女性>18kg',
    importance: 'high'
  },
  {
    id: 'exam003',
    name: '6米步行测试',
    description: '测量行走6米所需时间',
    category: 'physical',
    unit: '秒',
    normalRange: '<6秒',
    importance: 'high'
  },
  {
    id: 'exam004',
    name: '椅子起立测试',
    description: '测量从椅子上站起所需时间',
    category: 'physical',
    unit: '秒',
    normalRange: '<10秒',
    importance: 'high'
  },
  {
    id: 'exam005',
    name: '血清白蛋白',
    description: '检测血清中白蛋白水平',
    category: 'laboratory',
    unit: 'g/L',
    normalRange: '35-55g/L',
    importance: 'medium'
  },
  {
    id: 'exam006',
    name: '血清维生素D',
    description: '检测血清中25-羟基维生素D水平',
    category: 'laboratory',
    unit: 'ng/mL',
    normalRange: '>20ng/mL',
    importance: 'medium'
  },
  {
    id: 'exam007',
    name: '双能X射线吸收测定(DEXA)',
    description: '测量骨密度和全身组成',
    category: 'imaging',
    unit: 'g/cm²',
    normalRange: 'T值>-1.0',
    importance: 'high'
  }
];

// 检查记录
const examinations = [
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam001',
    value: '22.5',
    result: '低于正常水平',
    status: 'abnormal', // normal-正常 abnormal-异常 critical-危急
    doctorId: 'doctor001',
    doctorName: '张立明',
    hospitalName: '北京老年医学研究所附属医院',
    departmentName: '老年医学科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString().split('T')[0],
    reportImages: ['/static/images/medical/examination1.jpg'],
    conclusion: '肌肉质量低于正常水平，符合肌少症诊断标准',
    advice: '建议增加蛋白质摄入和进行适当的抗阻训练'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam002',
    value: '22.5',
    result: '低于正常水平',
    status: 'abnormal',
    doctorId: 'doctor001',
    doctorName: '张立明',
    hospitalName: '北京老年医学研究所附属医院',
    departmentName: '老年医学科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString().split('T')[0],
    reportImages: ['/static/images/medical/examination2.jpg'],
    conclusion: '握力低于正常水平，提示上肢肌力减退',
    advice: '建议进行上肢力量训练，如弹力带练习'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam003',
    value: '7.2',
    result: '低于正常水平',
    status: 'abnormal',
    doctorId: 'doctor001',
    doctorName: '张立明',
    hospitalName: '北京老年医学研究所附属医院',
    departmentName: '老年医学科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString().split('T')[0],
    reportImages: [],
    conclusion: '行走速度慢于正常水平，提示下肢功能减退',
    advice: '建议进行下肢力量训练和平衡训练'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam005',
    value: '38.5',
    result: '正常范围',
    status: 'normal',
    doctorId: 'doctor002',
    doctorName: '李慧芳',
    hospitalName: '上海市第一人民医院',
    departmentName: '营养科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 44)).toISOString().split('T')[0],
    reportImages: ['/static/images/medical/examination3.jpg'],
    conclusion: '血清白蛋白水平正常',
    advice: '维持现有饮食习惯，保持足够蛋白质摄入'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam006',
    value: '17.5',
    result: '低于正常水平',
    status: 'abnormal',
    doctorId: 'doctor002',
    doctorName: '李慧芳',
    hospitalName: '上海市第一人民医院',
    departmentName: '营养科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 44)).toISOString().split('T')[0],
    reportImages: ['/static/images/medical/examination4.jpg'],
    conclusion: '维生素D水平不足',
    advice: '建议补充维生素D，每天800-1000IU，并增加适当日晒'
  },
  {
    id: generateRandomId(),
    userId: '1001',
    examinationTypeId: 'exam007',
    value: '-1.8',
    result: '骨量减少',
    status: 'abnormal',
    doctorId: 'doctor005',
    doctorName: '赵明朗',
    hospitalName: '上海长征医院',
    departmentName: '骨科',
    examinationDate: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0],
    reportDate: new Date(new Date().setDate(new Date().getDate() - 88)).toISOString().split('T')[0],
    reportImages: ['/static/images/medical/examination5.jpg', '/static/images/medical/examination6.jpg'],
    conclusion: '骨密度减低，属于骨量减少状态，有发展为骨质疏松的风险',
    advice: '补充钙剂(800-1000mg/日)和维生素D(800IU/日)，增加负重运动，定期复查骨密度'
  }
];

// 处方数据
const prescriptions = [
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor001',
    doctorName: '张立明',
    hospitalName: '北京老年医学研究所附属医院',
    departmentName: '老年医学科',
    diagnosis: '肌少症',
    prescriptionDate: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString().split('T')[0],
    expiryDate: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString().split('T')[0],
    status: 'completed', // valid-有效 expired-已过期 canceled-已取消 completed-已完成
    medicines: [
      {
        name: '乳清蛋白粉',
        specification: '30g/袋',
        dosage: '1袋',
        frequency: '每日两次',
        method: '温水冲服',
        duration: '30天',
        quantity: '60袋',
        notes: '餐后半小时服用'
      },
      {
        name: '复合维生素D3钙片',
        specification: '钙600mg+维生素D 200IU/片',
        dosage: '1片',
        frequency: '每日一次',
        method: '口服',
        duration: '30天',
        quantity: '30片',
        notes: '餐后服用'
      }
    ],
    advices: [
      '增加蛋白质摄入，每天至少摄入1.2-1.5g/kg体重的蛋白质',
      '加强下肢力量训练，每天进行椅子坐立运动10-15次，每天3组',
      '保持适当有氧运动，如散步，每天20-30分钟',
      '定期复查肌肉质量和功能评估'
    ],
    prescriptionImages: ['/static/images/medical/prescription1.jpg']
  },
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor005',
    doctorName: '赵明朗',
    hospitalName: '上海长征医院',
    departmentName: '骨科',
    diagnosis: '骨量减少',
    prescriptionDate: new Date(new Date().setDate(new Date().getDate() - 88)).toISOString().split('T')[0],
    expiryDate: new Date(new Date().setDate(new Date().getDate() - 58)).toISOString().split('T')[0],
    status: 'completed',
    medicines: [
      {
        name: '碳酸钙D3片',
        specification: '钙500mg+维生素D 200IU/片',
        dosage: '1片',
        frequency: '每日两次',
        method: '口服',
        duration: '30天',
        quantity: '60片',
        notes: '餐后服用'
      }
    ],
    advices: [
      '进行适当的负重运动，如散步、轻度负重锻炼',
      '避免过度弯腰和提重物',
      '保持均衡饮食，多吃富含钙的食物如牛奶、豆制品',
      '定期复查骨密度，6个月后复查'
    ],
    prescriptionImages: ['/static/images/medical/prescription2.jpg']
  },
  {
    id: generateRandomId(),
    userId: '1001',
    doctorId: 'doctor001',
    doctorName: '张立明',
    hospitalName: '北京老年医学研究所附属医院',
    departmentName: '老年医学科',
    diagnosis: '肌少症',
    prescriptionDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0],
    status: 'valid',
    medicines: [
      {
        name: '乳清蛋白粉',
        specification: '30g/袋',
        dosage: '1袋',
        frequency: '每日两次',
        method: '温水冲服',
        duration: '30天',
        quantity: '60袋',
        notes: '餐后半小时服用'
      },
      {
        name: '复合维生素D3钙片',
        specification: '钙600mg+维生素D 400IU/片',
        dosage: '1片',
        frequency: '每日一次',
        method: '口服',
        duration: '30天',
        quantity: '30片',
        notes: '餐后服用'
      }
    ],
    advices: [
      '继续增加蛋白质摄入，每天至少摄入1.2-1.5g/kg体重的蛋白质',
      '加强下肢力量训练，增加到椅子坐立运动15-20次，每天3组',
      '增加有氧运动时间，如散步，每天30-40分钟',
      '三个月后复查肌肉质量和功能评估'
    ],
    prescriptionImages: ['/static/images/medical/prescription3.jpg']
  }
];

export default {
  healthProfiles,
  examinationTypes,
  examinations,
  prescriptions
};
