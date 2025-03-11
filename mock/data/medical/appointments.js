/**
 * mock/data/medical/appointments.js - 医疗预约数据
 * 
 * 包含预约挂号相关数据
 */

import { generateRandomId } from '../../utils/mock-helper';

// 预约时段数据
const timeSlots = [
  {
    id: 'slot001',
    doctorId: 'doctor001',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: '08:30',
    endTime: '09:00',
    status: 'available',
    price: 300,
    slotType: 'online' // online-线上 offline-线下
  },
  {
    id: 'slot002',
    doctorId: 'doctor001',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    status: 'booked',
    price: 300,
    slotType: 'online'
  },
  {
    id: 'slot003',
    doctorId: 'doctor001',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: '09:30',
    endTime: '10:00',
    status: 'available',
    price: 300,
    slotType: 'online'
  },
  {
    id: 'slot004',
    doctorId: 'doctor001',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '14:30',
    status: 'available',
    price: 300,
    slotType: 'offline'
  },
  {
    id: 'slot005',
    doctorId: 'doctor001',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    startTime: '14:30',
    endTime: '15:00',
    status: 'available',
    price: 300,
    slotType: 'offline'
  },
  {
    id: 'slot006',
    doctorId: 'doctor002',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:30',
    status: 'available',
    price: 280,
    slotType: 'online'
  },
  {
    id: 'slot007',
    doctorId: 'doctor002',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '11:00',
    status: 'available',
    price: 280,
    slotType: 'online'
  },
  {
    id: 'slot008',
    doctorId: 'doctor002',
    date: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '15:30',
    status: 'available',
    price: 300,
    slotType: 'offline'
  },
  {
    id: 'slot009',
    doctorId: 'doctor005',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '14:30',
    status: 'available',
    price: 220,
    slotType: 'online'
  },
  {
    id: 'slot010',
    doctorId: 'doctor005',
    date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0],
    startTime: '15:30',
    endTime: '16:00',
    status: 'available',
    price: 240,
    slotType: 'offline'
  }
];

// 预约订单数据
const appointments = [
  {
    id: 'appointment001',
    userId: '1001',
    doctorId: 'doctor001',
    timeSlotId: 'slot002',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    appointmentType: 'online', // online-线上问诊 offline-线下问诊
    status: 'confirmed', // pending-待支付 confirmed-已确认 completed-已完成 canceled-已取消
    price: 300,
    symptomDescription: '最近一个月来，我感觉腿部无力，上楼梯很吃力，怀疑可能是肌少症恶化',
    medicalHistory: '高血压10年，2年前被诊断为肌少症',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    cancelReason: null,
    refundStatus: null,
    remark: '希望医生能给出具体的锻炼和饮食建议'
  },
  {
    id: 'appointment002',
    userId: '1001',
    doctorId: 'doctor002',
    timeSlotId: null,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '15:30',
    appointmentType: 'online',
    status: 'completed',
    price: 280,
    symptomDescription: '需要专业的营养指导，改善肌少症状况',
    medicalHistory: '高血压10年，2年前被诊断为肌少症',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    cancelReason: null,
    refundStatus: null,
    remark: null
  },
  {
    id: 'appointment003',
    userId: '1001',
    doctorId: 'doctor001',
    timeSlotId: null,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '11:00',
    appointmentType: 'online',
    status: 'completed',
    price: 300,
    symptomDescription: '定期复诊，讨论肌少症管理进展',
    medicalHistory: '高血压10年，2年前被诊断为肌少症',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    cancelReason: null,
    refundStatus: null,
    remark: null
  },
  {
    id: 'appointment004',
    userId: '1001',
    doctorId: 'doctor003',
    timeSlotId: null,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '14:30',
    appointmentType: 'offline',
    status: 'canceled',
    price: 260,
    symptomDescription: '希望获得专业康复训练指导',
    medicalHistory: '高血压10年，2年前被诊断为肌少症',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 22)).toISOString(),
    cancelReason: '当日身体不适，无法前往',
    refundStatus: 'refunded',
    remark: null
  }
];

// 可选就诊类型
const consultationTypes = [
  {
    id: 'consult_type_001',
    name: '首次问诊',
    description: '适合首次咨询特定疾病或症状',
    duration: 30,
    priceIncrease: 0 // 相对于医生基础价格的增加金额
  },
  {
    id: 'consult_type_002',
    name: '复诊',
    description: '适合已确诊并需要跟进治疗的患者',
    duration: 20,
    priceIncrease: -50
  },
  {
    id: 'consult_type_003',
    name: '专项会诊',
    description: '针对疑难复杂疾病的专家团队会诊',
    duration: 40,
    priceIncrease: 100
  },
  {
    id: 'consult_type_004',
    name: '家庭医生签约服务',
    description: '提供长期、连续的健康管理服务',
    duration: 30,
    priceIncrease: 0
  }
];

// 预约评价
const appointmentReviews = [
  {
    id: generateRandomId(),
    appointmentId: 'appointment002',
    userId: '1001',
    doctorId: 'doctor002',
    rating: 5,
    content: '李医生非常专业，给我制定了详细的营养补充方案，对我的肌少症改善很有帮助。',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    status: 'published', // draft-草稿 published-已发布 hidden-已隐藏
    doctorReply: '谢谢您的信任，祝您健康！我们会继续跟进您的营养改善情况。'
  },
  {
    id: generateRandomId(),
    appointmentId: 'appointment003',
    userId: '1001',
    doctorId: 'doctor001',
    rating: 5,
    content: '张医生非常耐心，详细解答了我所有的问题，对于肌少症的治疗建议非常实用。',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    status: 'published',
    doctorReply: '感谢您的评价！希望您能继续坚持我们讨论的锻炼和饮食方案，期待您的下次复诊。'
  }
];

export default {
  timeSlots,
  appointments,
  consultationTypes,
  appointmentReviews
};
