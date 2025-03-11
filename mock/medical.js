/**
 * mock/medical.js - 医疗模块API模拟
 * 
 * 提供医疗模块的API接口模拟
 */

import { 
  mockRequest, 
  successResponse, 
  errorResponse, 
  generateRandomId,
  checkTokenValid
} from './utils/mock-helper';

// 导入医疗模块数据
import medicalData from './data/medical/index';

// 获取科室列表
const getDepartments = mockRequest(() => {
  return successResponse(medicalData.doctors.departments);
});

// 获取医生列表
const getDoctors = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { departmentId, keyword, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredDoctors = [...medicalData.doctors.doctors];
  
  // 科室过滤
  if (departmentId) {
    filteredDoctors = filteredDoctors.filter(doctor => doctor.departmentId === departmentId);
  }
  
  // 关键词过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(lowerKeyword) || 
      doctor.specialties.some(s => s.toLowerCase().includes(lowerKeyword)) ||
      doctor.introduction.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 按评分降序排序
  filteredDoctors.sort((a, b) => b.score - a.score);
  
  // 计算分页
  const total = filteredDoctors.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredDoctors.slice(startIndex, endIndex);
  
  // 获取当前用户的关注状态
  const userId = '1001'; // 从token中获取用户ID
  const doctorsWithFollowStatus = list.map(doctor => {
    const isFollowed = medicalData.doctors.userFollowedDoctors.some(
      followRecord => followRecord.userId === userId && followRecord.doctorId === doctor.id
    );
    return { ...doctor, isFollowed };
  });
  
  return successResponse({
    list: doctorsWithFollowStatus,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取医生详情
const getDoctorDetail = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === id);
  
  if (!doctor) {
    return errorResponse(404, '医生不存在');
  }
  
  // 获取当前用户的关注状态
  const userId = '1001'; // 从token中获取用户ID
  const isFollowed = medicalData.doctors.userFollowedDoctors.some(
    followRecord => followRecord.userId === userId && followRecord.doctorId === doctor.id
  );
  
  // 获取医生科室信息
  const department = medicalData.doctors.departments.find(
    dept => dept.id === doctor.departmentId
  );
  
  // 获取医生职称信息
  const title = medicalData.doctors.doctorTitles.find(
    title => title.id === doctor.titleId
  );
  
  return successResponse({ 
    ...doctor, 
    isFollowed,
    department: department ? {
      id: department.id,
      name: department.name
    } : null,
    title: title ? {
      id: title.id,
      name: title.name
    } : null
  });
});

// 关注/取消关注医生
const toggleDoctorFollow = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { id } = params.url.match(/\/(\w+)\/follow$/).slice(1);
  
  // 查找医生
  const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === id);
  if (!doctor) {
    return errorResponse(404, '医生不存在');
  }
  
  // 查找是否已关注
  const followIndex = medicalData.doctors.userFollowedDoctors.findIndex(
    follow => follow.userId === userId && follow.doctorId === id
  );
  
  if (followIndex === -1) {
    // 添加关注
    medicalData.doctors.userFollowedDoctors.push({
      id: generateRandomId(),
      userId,
      doctorId: id,
      followTime: new Date().toISOString(),
      lastConsultTime: null,
      consultCount: 0,
      isRecommended: false
    });
    
    return successResponse({ isFollowed: true }, '关注成功');
  } else {
    // 取消关注
    medicalData.doctors.userFollowedDoctors.splice(followIndex, 1);
    
    return successResponse({ isFollowed: false }, '取消关注成功');
  }
});

// 获取我关注的医生
const getMyFollowedDoctors = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 获取用户关注的医生记录
  const followRecords = medicalData.doctors.userFollowedDoctors.filter(
    record => record.userId === userId
  );
  
  // 获取完整的医生信息
  const followedDoctors = followRecords.map(record => {
    const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === record.doctorId);
    if (!doctor) return null;
    
    // 获取医生科室信息
    const department = medicalData.doctors.departments.find(
      dept => dept.id === doctor.departmentId
    );
    
    return {
      ...record,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        hospital: doctor.hospital,
        departmentName: department ? department.name : '',
        specialties: doctor.specialties
      }
    };
  }).filter(item => item !== null);
  
  // 按最近咨询时间和关注时间排序
  followedDoctors.sort((a, b) => {
    // 首先按最近咨询时间排序，没有咨询的靠后
    if (a.lastConsultTime && b.lastConsultTime) {
      return new Date(b.lastConsultTime) - new Date(a.lastConsultTime);
    }
    if (a.lastConsultTime) return -1;
    if (b.lastConsultTime) return 1;
    
    // 然后按关注时间排序
    return new Date(b.followTime) - new Date(a.followTime);
  });
  
  return successResponse(followedDoctors);
});

// 获取推荐医生
const getRecommendedDoctors = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  // 获取推荐医生记录
  const recommendations = [...medicalData.doctors.doctorRecommendations];
  
  // 按推荐顺序排序
  recommendations.sort((a, b) => a.order - b.order);
  
  // 获取完整的医生信息
  const recommendedDoctors = recommendations.map(rec => {
    const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === rec.doctorId);
    if (!doctor) return null;
    
    // 获取医生科室信息
    const department = medicalData.doctors.departments.find(
      dept => dept.id === doctor.departmentId
    );
    
    // 获取当前用户的关注状态
    const userId = '1001'; // 从token中获取用户ID
    const isFollowed = medicalData.doctors.userFollowedDoctors.some(
      followRecord => followRecord.userId === userId && followRecord.doctorId === doctor.id
    );
    
    return {
      ...rec,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        hospital: doctor.hospital,
        departmentName: department ? department.name : '',
        specialties: doctor.specialties,
        score: doctor.score,
        consultationCount: doctor.consultationCount,
        isFollowed
      }
    };
  }).filter(item => item !== null);
  
  return successResponse(recommendedDoctors);
});

// 获取会话列表
const getMessageSessions = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 获取用户的会话
  const sessions = medicalData.messages.sessions.filter(session => session.userId === userId);
  
  // 合并医生信息
  const sessionsWithDoctorInfo = sessions.map(session => {
    const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === session.doctorId);
    if (!doctor) return session;
    
    return {
      ...session,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      doctorHospital: doctor.hospital,
      isOnline: doctor.isOnline
    };
  });
  
  // 按最后消息时间排序
  sessionsWithDoctorInfo.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  
  return successResponse(sessionsWithDoctorInfo);
});

// 获取会话详情
const getSessionMessages = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)\/messages$/).slice(1);
  const { page = 1, pageSize = 20 } = params.data || {};
  
  // 检查会话是否存在
  const session = medicalData.messages.sessions.find(session => session.id === id);
  if (!session) {
    return errorResponse(404, '会话不存在');
  }
  
  // 获取会话的消息
  let messages = medicalData.messages.messages.filter(message => message.sessionId === id);
  
  // 按时间正序排序
  messages.sort((a, b) => new Date(a.sendTime) - new Date(b.sendTime));
  
  // 计算分页
  const total = messages.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = messages.slice(startIndex, endIndex);
  
  // 更新未读消息状态
  const userId = '1001'; // 从token中获取用户ID
  medicalData.messages.messages.forEach(message => {
    if (message.sessionId === id && message.receiverId === userId && message.readStatus === 'unread') {
      message.readStatus = 'read';
    }
  });
  
  // 更新会话未读数
  const sessionToUpdate = medicalData.messages.sessions.find(s => s.id === id);
  if (sessionToUpdate) {
    sessionToUpdate.unreadCount = 0;
  }
  
  return successResponse({
    list,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 发送消息
const sendMessage = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)\/messages$/).slice(1);
  const { content, type = 'text' } = params.data || {};
  
  if (!content) {
    return errorResponse(400, '消息内容不能为空');
  }
  
  // 检查会话是否存在
  const session = medicalData.messages.sessions.find(session => session.id === id);
  if (!session) {
    return errorResponse(404, '会话不存在');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const doctorId = session.doctorId;
  
  // 创建新消息
  const newMessage = {
    id: generateRandomId(),
    sessionId: id,
    senderId: userId,
    receiverId: doctorId,
    content,
    type,
    sendTime: new Date().toISOString(),
    readStatus: 'unread'
  };
  
  // 添加到数据集
  medicalData.messages.messages.push(newMessage);
  
  // 更新会话最后消息信息
  session.lastMessage = content;
  session.lastMessageTime = new Date().toISOString();
  
  // 模拟医生回复
  setTimeout(() => {
    const replyContent = "感谢您的咨询，我会尽快回复您。";
    
    // 创建医生回复消息
    const replyMessage = {
      id: generateRandomId(),
      sessionId: id,
      senderId: doctorId,
      receiverId: userId,
      content: replyContent,
      type: 'text',
      sendTime: new Date(new Date().getTime() + 60000).toISOString(), // 1分钟后
      readStatus: 'unread'
    };
    
    // 添加到数据集
    medicalData.messages.messages.push(replyMessage);
    
    // 更新会话最后消息信息
    session.lastMessage = replyContent;
    session.lastMessageTime = replyMessage.sendTime;
    session.unreadCount += 1;
  }, 1000);
  
  return successResponse(newMessage);
});

// 获取预约时段
const getDoctorTimeSlots = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { doctorId, date, type } = params.data || {};
  
  if (!doctorId) {
    return errorResponse(400, '医生ID不能为空');
  }
  
  if (!date) {
    return errorResponse(400, '日期不能为空');
  }
  
  let filteredSlots = medicalData.appointments.timeSlots.filter(slot => 
    slot.doctorId === doctorId && slot.date === date
  );
  
  // 按类型过滤
  if (type) {
    filteredSlots = filteredSlots.filter(slot => slot.slotType === type);
  }
  
  // 按时间排序
  filteredSlots.sort((a, b) => {
    if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
  
  return successResponse(filteredSlots);
});

// 创建预约
const createAppointment = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { doctorId, timeSlotId, appointmentType, symptomDescription, medicalHistory, remark } = params.data || {};
  
  if (!doctorId) {
    return errorResponse(400, '医生ID不能为空');
  }
  
  if (!timeSlotId) {
    return errorResponse(400, '时段ID不能为空');
  }
  
  if (!appointmentType) {
    return errorResponse(400, '预约类型不能为空');
  }
  
  if (!symptomDescription) {
    return errorResponse(400, '症状描述不能为空');
  }
  
  // 查找时段
  const timeSlot = medicalData.appointments.timeSlots.find(slot => slot.id === timeSlotId);
  if (!timeSlot) {
    return errorResponse(404, '时段不存在');
  }
  
  if (timeSlot.status !== 'available') {
    return errorResponse(400, '该时段已被预约');
  }
  
  // 更新时段状态
  timeSlot.status = 'booked';
  
  // 创建预约
  const newAppointment = {
    id: 'appointment' + (medicalData.appointments.appointments.length + 1).toString().padStart(3, '0'),
    userId,
    doctorId,
    timeSlotId,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    appointmentType,
    status: 'confirmed', // 实际应该是pending，这里简化处理
    price: timeSlot.price,
    symptomDescription,
    medicalHistory,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancelReason: null,
    refundStatus: null,
    remark
  };
  
  // 添加到数据集
  medicalData.appointments.appointments.push(newAppointment);
  
  return successResponse(newAppointment, '预约成功');
});

// 获取我的预约
const getMyAppointments = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { status, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredAppointments = medicalData.appointments.appointments.filter(
    appointment => appointment.userId === userId
  );
  
  // 按状态过滤
  if (status) {
    filteredAppointments = filteredAppointments.filter(
      appointment => appointment.status === status
    );
  }
  
  // 按日期降序排序
  filteredAppointments.sort((a, b) => {
    if (a.status !== b.status) {
      // 待就诊的排在前面
      if (a.status === 'confirmed') return -1;
      if (b.status === 'confirmed') return 1;
    }
    // 然后按日期排序
    if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
    return a.startTime.localeCompare(b.startTime);
  });
  
  // 计算分页
  const total = filteredAppointments.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredAppointments.slice(startIndex, endIndex);
  
  // 合并医生信息
  const appointmentsWithDoctorInfo = list.map(appointment => {
    const doctor = medicalData.doctors.doctors.find(doctor => doctor.id === appointment.doctorId);
    if (!doctor) return appointment;
    
    // 获取医生科室信息
    const department = medicalData.doctors.departments.find(
      dept => dept.id === doctor.departmentId
    );
    
    return {
      ...appointment,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        hospital: doctor.hospital,
        departmentName: department ? department.name : ''
      }
    };
  });
  
  return successResponse({
    list: appointmentsWithDoctorInfo,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取预约详情
const getAppointmentDetail = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找预约
  const appointment = medicalData.appointments.appointments.find(
    appointment => appointment.id === id
  );
  
  if (!appointment) {
    return errorResponse(404, '预约不存在');
  }
  
  // 获取医生信息
  const doctor = medicalData.doctors.doctors.find(
    doctor => doctor.id === appointment.doctorId
  );
  
  // 获取医生科室信息
  const department = doctor ? medicalData.doctors.departments.find(
    dept => dept.id === doctor.departmentId
  ) : null;
  
  // 获取预约评价
  const review = medicalData.appointments.appointmentReviews.find(
    review => review.appointmentId === id
  );
  
  return successResponse({
    ...appointment,
    doctor: doctor ? {
      id: doctor.id,
      name: doctor.name,
      avatar: doctor.avatar,
      hospital: doctor.hospital,
      departmentName: department ? department.name : '',
      titleName: doctor.titleName
    } : null,
    review
  });
});

// 取消预约
const cancelAppointment = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)\/cancel$/).slice(1);
  const { cancelReason } = params.data || {};
  
  if (!cancelReason) {
    return errorResponse(400, '取消原因不能为空');
  }
  
  // 查找预约
  const appointment = medicalData.appointments.appointments.find(
    appointment => appointment.id === id
  );
  
  if (!appointment) {
    return errorResponse(404, '预约不存在');
  }
  
  if (appointment.status !== 'confirmed') {
    return errorResponse(400, '只有待就诊的预约可以取消');
  }
  
  // 更新预约状态
  appointment.status = 'canceled';
  appointment.cancelReason = cancelReason;
  appointment.updatedAt = new Date().toISOString();
  
  // 更新时段状态
  const timeSlot = medicalData.appointments.timeSlots.find(
    slot => slot.id === appointment.timeSlotId
  );
  
  if (timeSlot) {
    timeSlot.status = 'available';
  }
  
  return successResponse(null, '预约已取消');
});

// 评价预约
const reviewAppointment = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)\/review$/).slice(1);
  const { score, content, tags } = params.data || {};
  
  if (!score) {
    return errorResponse(400, '评分不能为空');
  }
  
  // 查找预约
  const appointment = medicalData.appointments.appointments.find(
    appointment => appointment.id === id
  );
  
  if (!appointment) {
    return errorResponse(404, '预约不存在');
  }
  
  if (appointment.status !== 'completed') {
    return errorResponse(400, '只有已完成的预约可以评价');
  }
  
  // 检查是否已评价
  const existingReview = medicalData.appointments.appointmentReviews.find(
    review => review.appointmentId === id
  );
  
  if (existingReview) {
    return errorResponse(400, '该预约已评价');
  }
  
  // 创建评价
  const newReview = {
    id: generateRandomId(),
    userId: appointment.userId,
    appointmentId: id,
    doctorId: appointment.doctorId,
    score,
    content: content || '',
    tags: tags || [],
    createdAt: new Date().toISOString(),
    isAnonymous: false,
    status: 'visible' // visible-可见 hidden-隐藏 deleted-已删除
  };
  
  // 添加到数据集
  medicalData.appointments.appointmentReviews.push(newReview);
  
  // 更新医生评分
  const doctor = medicalData.doctors.doctors.find(
    doctor => doctor.id === appointment.doctorId
  );
  
  if (doctor) {
    // 获取医生所有评价
    const doctorReviews = medicalData.appointments.appointmentReviews.filter(
      review => review.doctorId === doctor.id && review.status === 'visible'
    );
    
    // 计算新评分
    const totalScore = doctorReviews.reduce((sum, review) => sum + review.score, 0);
    doctor.score = parseFloat((totalScore / doctorReviews.length).toFixed(1));
  }
  
  return successResponse(newReview, '评价成功');
});

// 获取健康档案
const getHealthProfile = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  
  // 查找用户健康档案
  const profile = medicalData.records.healthProfiles.find(
    profile => profile.userId === userId
  );
  
  if (!profile) {
    return errorResponse(404, '健康档案不存在');
  }
  
  return successResponse(profile);
});

// 更新健康档案
const updateHealthProfile = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { height, weight, bloodType, allergies, chronicDiseases, familyHistory, medications, emergencyContact } = params.data || {};
  
  // 查找用户健康档案
  const profile = medicalData.records.healthProfiles.find(
    profile => profile.userId === userId
  );
  
  if (!profile) {
    return errorResponse(404, '健康档案不存在');
  }
  
  // 更新档案
  if (height !== undefined) profile.height = height;
  if (weight !== undefined) profile.weight = weight;
  if (bloodType !== undefined) profile.bloodType = bloodType;
  if (allergies !== undefined) profile.allergies = allergies;
  if (chronicDiseases !== undefined) profile.chronicDiseases = chronicDiseases;
  if (familyHistory !== undefined) profile.familyHistory = familyHistory;
  if (medications !== undefined) profile.medications = medications;
  if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;
  
  // 更新BMI
  if (height && weight) {
    profile.bmi = parseFloat((weight / ((height / 100) * (height / 100))).toFixed(1));
  }
  
  // 更新时间
  profile.lastUpdated = new Date().toISOString();
  
  return successResponse(profile, '健康档案更新成功');
});

// 获取检查类型
const getExaminationTypes = mockRequest(() => {
  return successResponse(medicalData.records.examinationTypes);
});

// 获取检查记录
const getExaminations = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { type, status, startDate, endDate, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredExaminations = medicalData.records.examinations.filter(
    exam => exam.userId === userId
  );
  
  // 按类型过滤
  if (type) {
    filteredExaminations = filteredExaminations.filter(
      exam => exam.examinationTypeId === type
    );
  }
  
  // 按状态过滤
  if (status) {
    filteredExaminations = filteredExaminations.filter(
      exam => exam.status === status
    );
  }
  
  // 按日期过滤
  if (startDate) {
    filteredExaminations = filteredExaminations.filter(
      exam => exam.examinationDate >= startDate
    );
  }
  
  if (endDate) {
    filteredExaminations = filteredExaminations.filter(
      exam => exam.examinationDate <= endDate
    );
  }
  
  // 按日期降序排序
  filteredExaminations.sort((a, b) => 
    new Date(b.examinationDate) - new Date(a.examinationDate)
  );
  
  // 计算分页
  const total = filteredExaminations.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredExaminations.slice(startIndex, endIndex);
  
  // 添加检查类型信息
  const examinationsWithType = list.map(exam => {
    const examType = medicalData.records.examinationTypes.find(
      type => type.id === exam.examinationTypeId
    );
    
    return {
      ...exam,
      typeName: examType ? examType.name : '',
      typeCategory: examType ? examType.category : '',
      unit: examType ? examType.unit : '',
      normalRange: examType ? examType.normalRange : ''
    };
  });
  
  return successResponse({
    list: examinationsWithType,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取检查记录详情
const getExaminationDetail = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找检查记录
  const examination = medicalData.records.examinations.find(
    exam => exam.id === id
  );
  
  if (!examination) {
    return errorResponse(404, '检查记录不存在');
  }
  
  // 获取检查类型信息
  const examType = medicalData.records.examinationTypes.find(
    type => type.id === examination.examinationTypeId
  );
  
  return successResponse({
    ...examination,
    typeName: examType ? examType.name : '',
    typeDescription: examType ? examType.description : '',
    typeCategory: examType ? examType.category : '',
    unit: examType ? examType.unit : '',
    normalRange: examType ? examType.normalRange : ''
  });
});

// 获取处方列表
const getPrescriptions = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const userId = '1001'; // 从token中获取用户ID
  const { status, startDate, endDate, page = 1, pageSize = 10 } = params.data || {};
  
  let filteredPrescriptions = medicalData.records.prescriptions.filter(
    prescription => prescription.userId === userId
  );
  
  // 按状态过滤
  if (status) {
    filteredPrescriptions = filteredPrescriptions.filter(
      prescription => prescription.status === status
    );
  }
  
  // 按日期过滤
  if (startDate) {
    filteredPrescriptions = filteredPrescriptions.filter(
      prescription => prescription.prescriptionDate >= startDate
    );
  }
  
  if (endDate) {
    filteredPrescriptions = filteredPrescriptions.filter(
      prescription => prescription.prescriptionDate <= endDate
    );
  }
  
  // 按日期降序排序
  filteredPrescriptions.sort((a, b) => 
    new Date(b.prescriptionDate) - new Date(a.prescriptionDate)
  );
  
  // 计算分页
  const total = filteredPrescriptions.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredPrescriptions.slice(startIndex, endIndex);
  
  // 添加医生简要信息
  const prescriptionsWithDoctorInfo = list.map(prescription => {
    const doctor = medicalData.doctors.doctors.find(
      doctor => doctor.id === prescription.doctorId
    );
    
    // 计算药品数量
    const medicineCount = prescription.medicines.length;
    
    return {
      ...prescription,
      doctorAvatar: doctor ? doctor.avatar : '',
      medicineCount
    };
  });
  
  return successResponse({
    list: prescriptionsWithDoctorInfo,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pages: Math.ceil(total / pageSize)
    }
  });
});

// 获取处方详情
const getPrescriptionDetail = mockRequest((params) => {
  const token = params.header?.Authorization;
  if (!checkTokenValid(token)) {
    return errorResponse(401, '用户未登录或登录已过期');
  }
  
  const { id } = params.url.match(/\/(\w+)$/).slice(1);
  
  // 查找处方
  const prescription = medicalData.records.prescriptions.find(
    prescription => prescription.id === id
  );
  
  if (!prescription) {
    return errorResponse(404, '处方不存在');
  }
  
  // 获取医生信息
  const doctor = medicalData.doctors.doctors.find(
    doctor => doctor.id === prescription.doctorId
  );
  
  // 获取医生科室信息
  const department = doctor ? medicalData.doctors.departments.find(
    dept => dept.id === doctor.departmentId
  ) : null;
  
  return successResponse({
    ...prescription,
    doctor: doctor ? {
      id: doctor.id,
      name: doctor.name,
      avatar: doctor.avatar,
      hospital: doctor.hospital,
      departmentName: department ? department.name : '',
      titleName: doctor.titleName
    } : null
  });
});

// 导出医疗模块API
export default {
  // 医生相关
  getDepartments,
  getDoctors,
  getDoctorDetail,
  toggleDoctorFollow,
  getMyFollowedDoctors,
  getRecommendedDoctors,
  
  // 消息相关
  getMessageSessions,
  getSessionMessages,
  sendMessage,
  
  // 预约相关
  getDoctorTimeSlots,
  createAppointment,
  getMyAppointments,
  getAppointmentDetail,
  cancelAppointment,
  reviewAppointment,
  
  // 医疗记录相关
  getHealthProfile,
  updateHealthProfile,
  getExaminationTypes,
  getExaminations,
  getExaminationDetail,
  getPrescriptions,
  getPrescriptionDetail
};
