<template>
  <view class="appointment-container">
    <u-navbar title="预约系统" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 顶部选项卡 -->
      <u-tabs 
        :list="tabList" 
        :current="currentTab"
        @change="switchTab"
        activeStyle="color: #2979ff;font-weight: bold"
        inactiveStyle="color: #666666"
        lineColor="#2979ff"
        :itemStyle="{ height: '80rpx' }"
      ></u-tabs>
      
      <!-- 预约表单 -->
      <view class="appointment-form" v-if="currentTab === 0">
        <view class="form-card">
          <view class="form-title">预约信息</view>
          
          <view class="form-group">
            <view class="form-label">科室选择</view>
            <view class="form-input" @click="showDepartmentPopup = true">
              <text :class="{ placeholder: !selectedDepartment }">{{ selectedDepartment || '请选择科室' }}</text>
              <u-icon name="arrow-right" size="24" color="#999"></u-icon>
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-label">医生选择</view>
            <view class="form-input" @click="showDoctorPopup = true">
              <text :class="{ placeholder: !selectedDoctor }">{{ selectedDoctor || '请选择医生' }}</text>
              <u-icon name="arrow-right" size="24" color="#999"></u-icon>
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-label">预约日期</view>
            <view class="form-input" @click="showCalendarPopup = true">
              <text :class="{ placeholder: !selectedDate }">{{ selectedDate || '请选择日期' }}</text>
              <u-icon name="arrow-right" size="24" color="#999"></u-icon>
            </view>
          </view>
          
          <view class="form-group" v-if="selectedDate">
            <view class="form-label">预约时段</view>
            <view class="time-slots">
              <view 
                class="time-slot-item" 
                v-for="(slot, index) in timeSlots" 
                :key="index"
                :class="{ 
                  'selected': selectedTimeSlot === index,
                  'disabled': slot.status === 'disabled'
                }"
                @click="selectTimeSlot(index, slot)"
              >
                <text class="time-text">{{ slot.time }}</text>
                <text class="status-text">{{ getStatusText(slot.status) }}</text>
              </view>
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-label">就诊人</view>
            <view class="form-input" @click="showPatientPopup = true">
              <text :class="{ placeholder: !selectedPatient }">{{ selectedPatient || '请选择就诊人' }}</text>
              <u-icon name="arrow-right" size="24" color="#999"></u-icon>
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-label">就诊目的</view>
            <u-input 
              v-model="purpose" 
              placeholder="请简要描述就诊目的和症状" 
              type="textarea"
              height="160"
              :border="true"
            ></u-input>
          </view>
        </view>
        
        <view class="form-card payment-card">
          <view class="form-title">支付信息</view>
          
          <view class="payment-info">
            <text class="payment-label">预约挂号费</text>
            <text class="payment-value">¥{{ registrationFee }}</text>
          </view>
          
          <view class="payment-methods">
            <view 
              class="payment-method" 
              v-for="(method, index) in paymentMethods" 
              :key="index"
              :class="{ selected: selectedPaymentMethod === index }"
              @click="selectPaymentMethod(index)"
            >
              <view class="method-info">
                <image :src="method.icon" mode="aspectFit" class="method-icon"></image>
                <text class="method-name">{{ method.name }}</text>
              </view>
              <u-icon name="checkmark-circle" size="32" :color="selectedPaymentMethod === index ? '#2979ff' : '#ddd'"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="submit-section">
          <u-button type="primary" @click="submitAppointment">提交预约</u-button>
        </view>
      </view>
      
      <!-- 我的预约 -->
      <view class="my-appointments" v-if="currentTab === 1">
        <view class="status-filter">
          <view 
            class="status-item" 
            v-for="(status, index) in statusList" 
            :key="index"
            :class="{ active: currentStatus === status.value }"
            @click="switchStatus(status.value)"
          >
            {{ status.name }}
          </view>
        </view>
        
        <view class="appointment-list">
          <view class="appointment-item" v-for="(item, index) in appointmentList" :key="index">
            <view class="appointment-status" :class="getStatusClass(item.status)">{{ getAppointmentStatusText(item.status) }}</view>
            
            <view class="appointment-info">
              <view class="doctor-info">
                <image :src="item.doctorAvatar" mode="aspectFill" class="doctor-avatar"></image>
                <view class="doctor-details">
                  <text class="doctor-name">{{ item.doctorName }}</text>
                  <text class="department-name">{{ item.departmentName }}</text>
                </view>
              </view>
              
              <view class="appointment-time">
                <u-icon name="calendar" size="28" color="#999"></u-icon>
                <text>{{ item.date }} {{ item.timeSlot }}</text>
              </view>
              
              <view class="patient-info">
                <u-icon name="account" size="28" color="#999"></u-icon>
                <text>{{ item.patientName }}</text>
              </view>
            </view>
            
            <view class="appointment-actions" v-if="item.status === 'pending'">
              <u-button type="info" size="mini" @click="cancelAppointment(item.id)">取消预约</u-button>
            </view>
            
            <view class="appointment-actions" v-if="item.status === 'completed'">
              <u-button type="primary" size="mini" @click="viewMedicalRecord(item.id)">查看病历</u-button>
            </view>
          </view>
          
          <view class="empty-list" v-if="appointmentList.length === 0">
            <u-empty mode="list" text="暂无预约记录" marginTop="40"></u-empty>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 科室选择弹窗 -->
    <u-popup v-model="showDepartmentPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">选择科室</text>
          <u-icon name="close" color="#999" size="28" @click="showDepartmentPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <view 
            class="popup-item" 
            v-for="(department, index) in departmentList" 
            :key="index"
            @click="selectDepartment(department)"
          >
            <text>{{ department.name }}</text>
            <u-icon name="arrow-right" size="24" color="#ddd"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
    
    <!-- 医生选择弹窗 -->
    <u-popup v-model="showDoctorPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">选择医生</text>
          <u-icon name="close" color="#999" size="28" @click="showDoctorPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <view 
            class="popup-item doctor-popup-item" 
            v-for="(doctor, index) in doctorList" 
            :key="index"
            @click="selectDoctor(doctor)"
          >
            <view class="doctor-popup-info">
              <image :src="doctor.avatar" mode="aspectFill" class="doctor-popup-avatar"></image>
              <view class="doctor-popup-details">
                <text class="doctor-popup-name">{{ doctor.name }}</text>
                <text class="doctor-popup-title">{{ doctor.title }}</text>
              </view>
            </view>
            <u-icon name="arrow-right" size="24" color="#ddd"></u-icon>
          </view>
          
          <view class="empty-popup" v-if="doctorList.length === 0">
            <text>请先选择科室</text>
          </view>
        </view>
      </view>
    </u-popup>
    
    <!-- 日期选择弹窗 -->
    <u-popup v-model="showCalendarPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">选择日期</text>
          <u-icon name="close" color="#999" size="28" @click="showCalendarPopup = false"></u-icon>
        </view>
        <view class="calendar-wrapper">
          <u-calendar 
            :show="showCalendarPopup" 
            mode="single" 
            @confirm="confirmDate"
            startText="开始日期"
            endText="结束日期"
            confirmText="确认"
            :monthNum="3"
          ></u-calendar>
        </view>
      </view>
    </u-popup>
    
    <!-- 就诊人选择弹窗 -->
    <u-popup v-model="showPatientPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">选择就诊人</text>
          <u-icon name="close" color="#999" size="28" @click="showPatientPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <view 
            class="popup-item patient-popup-item" 
            v-for="(patient, index) in patientList" 
            :key="index"
            @click="selectPatient(patient)"
          >
            <view class="patient-popup-info">
              <text class="patient-popup-name">{{ patient.name }}</text>
              <text class="patient-popup-id">{{ patient.idCard }}</text>
            </view>
            <u-icon name="checkmark-circle" size="32" :color="selectedPatientId === patient.id ? '#2979ff' : '#ddd'"></u-icon>
          </view>
          
          <view class="add-patient" @click="addNewPatient">
            <u-icon name="plus" size="28" color="#2979ff"></u-icon>
            <text>添加就诊人</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        { name: '预约挂号' },
        { name: '我的预约' }
      ],
      currentTab: 0,
      
      // 预约表单数据
      departmentList: [],
      selectedDepartment: '',
      selectedDepartmentId: '',
      
      doctorList: [],
      selectedDoctor: '',
      selectedDoctorId: '',
      
      selectedDate: '',
      timeSlots: [],
      selectedTimeSlot: -1,
      
      patientList: [],
      selectedPatient: '',
      selectedPatientId: '',
      
      purpose: '',
      
      registrationFee: 0,
      paymentMethods: [
        { name: '微信支付', icon: '/static/icons/wechat-pay.png' },
        { name: '支付宝', icon: '/static/icons/alipay.png' },
        { name: '医保支付', icon: '/static/icons/medical-insurance.png' }
      ],
      selectedPaymentMethod: 0,
      
      // 弹窗控制
      showDepartmentPopup: false,
      showDoctorPopup: false,
      showCalendarPopup: false,
      showPatientPopup: false,
      
      // 我的预约数据
      statusList: [
        { name: '全部', value: 'all' },
        { name: '待就诊', value: 'pending' },
        { name: '已完成', value: 'completed' },
        { name: '已取消', value: 'cancelled' }
      ],
      currentStatus: 'all',
      appointmentList: []
    }
  },
  onLoad() {
    this.loadDepartments();
    this.loadPatients();
    this.loadAppointments();
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
      if (index === 1) {
        this.loadAppointments();
      }
    },
    
    // 科室相关
    loadDepartments() {
      uni.request({
        url: '/api/medical/departments',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.departmentList = res.data.data;
          }
        }
      });
    },
    selectDepartment(department) {
      this.selectedDepartment = department.name;
      this.selectedDepartmentId = department.id;
      this.showDepartmentPopup = false;
      
      // 清空已选择的医生
      this.selectedDoctor = '';
      this.selectedDoctorId = '';
      
      // 加载该科室的医生
      this.loadDoctorsByDepartment(department.id);
    },
    
    // 医生相关
    loadDoctorsByDepartment(departmentId) {
      uni.request({
        url: '/api/medical/doctors',
        method: 'GET',
        data: {
          departmentId: departmentId
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.doctorList = res.data.data;
          }
        }
      });
    },
    selectDoctor(doctor) {
      this.selectedDoctor = doctor.name;
      this.selectedDoctorId = doctor.id;
      this.registrationFee = doctor.registrationFee || 0;
      this.showDoctorPopup = false;
    },
    
    // 日期和时段相关
    confirmDate(e) {
      this.selectedDate = e.result;
      this.showCalendarPopup = false;
      
      // 加载选定日期的时间段
      this.loadTimeSlots();
    },
    loadTimeSlots() {
      if (!this.selectedDoctorId || !this.selectedDate) return;
      
      uni.request({
        url: '/api/medical/time-slots',
        method: 'GET',
        data: {
          doctorId: this.selectedDoctorId,
          date: this.selectedDate
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.timeSlots = res.data.data;
            this.selectedTimeSlot = -1; // 重置选择
          }
        }
      });
    },
    selectTimeSlot(index, slot) {
      if (slot.status === 'disabled') return;
      this.selectedTimeSlot = index;
    },
    getStatusText(status) {
      switch(status) {
        case 'available': return '可预约';
        case 'few': return '余量少';
        case 'disabled': return '已约满';
        default: return '';
      }
    },
    
    // 就诊人相关
    loadPatients() {
      uni.request({
        url: '/api/medical/patients',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.patientList = res.data.data;
          }
        }
      });
    },
    selectPatient(patient) {
      this.selectedPatient = patient.name;
      this.selectedPatientId = patient.id;
      this.showPatientPopup = false;
    },
    addNewPatient() {
      this.showPatientPopup = false;
      uni.navigateTo({
        url: './patient-manage/patient-manage?action=add'
      });
    },
    
    // 支付方式相关
    selectPaymentMethod(index) {
      this.selectedPaymentMethod = index;
    },
    
    // 提交预约
    submitAppointment() {
      // 验证表单
      if (!this.validateForm()) return;
      
      uni.showLoading({
        title: '提交中...'
      });
      
      const appointmentData = {
        departmentId: this.selectedDepartmentId,
        doctorId: this.selectedDoctorId,
        date: this.selectedDate,
        timeSlotIndex: this.selectedTimeSlot,
        patientId: this.selectedPatientId,
        purpose: this.purpose,
        paymentMethod: this.paymentMethods[this.selectedPaymentMethod].name,
        registrationFee: this.registrationFee
      };
      
      uni.request({
        url: '/api/medical/appointments',
        method: 'POST',
        data: appointmentData,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '预约成功',
              icon: 'success'
            });
            
            // 切换到我的预约标签
            this.currentTab = 1;
            this.loadAppointments();
            
            // 重置表单
            this.resetForm();
          } else {
            uni.showToast({
              title: res.data.message || '预约失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    validateForm() {
      if (!this.selectedDepartmentId) {
        uni.showToast({ title: '请选择科室', icon: 'none' });
        return false;
      }
      
      if (!this.selectedDoctorId) {
        uni.showToast({ title: '请选择医生', icon: 'none' });
        return false;
      }
      
      if (!this.selectedDate) {
        uni.showToast({ title: '请选择预约日期', icon: 'none' });
        return false;
      }
      
      if (this.selectedTimeSlot === -1) {
        uni.showToast({ title: '请选择预约时段', icon: 'none' });
        return false;
      }
      
      if (!this.selectedPatientId) {
        uni.showToast({ title: '请选择就诊人', icon: 'none' });
        return false;
      }
      
      if (!this.purpose.trim()) {
        uni.showToast({ title: '请填写就诊目的', icon: 'none' });
        return false;
      }
      
      return true;
    },
    resetForm() {
      this.selectedDepartment = '';
      this.selectedDepartmentId = '';
      this.selectedDoctor = '';
      this.selectedDoctorId = '';
      this.selectedDate = '';
      this.timeSlots = [];
      this.selectedTimeSlot = -1;
      this.purpose = '';
      this.selectedPaymentMethod = 0;
    },
    
    // 我的预约相关
    switchStatus(status) {
      this.currentStatus = status;
      this.loadAppointments();
    },
    loadAppointments() {
      if (this.currentTab !== 1) return;
      
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/medical/my-appointments',
        method: 'GET',
        data: {
          status: this.currentStatus === 'all' ? '' : this.currentStatus
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.appointmentList = res.data.data;
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    getAppointmentStatusText(status) {
      switch(status) {
        case 'pending': return '待就诊';
        case 'completed': return '已完成';
        case 'cancelled': return '已取消';
        default: return '未知';
      }
    },
    getStatusClass(status) {
      switch(status) {
        case 'pending': return 'status-pending';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        default: return '';
      }
    },
    cancelAppointment(appointmentId) {
      uni.showModal({
        title: '提示',
        content: '确定要取消此次预约吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '取消中...'
            });
            
            uni.request({
              url: '/api/medical/cancel-appointment',
              method: 'POST',
              data: {
                appointmentId: appointmentId
              },
              success: (res) => {
                uni.hideLoading();
                
                if (res.data.code === 0) {
                  uni.showToast({
                    title: '取消成功',
                    icon: 'success'
                  });
                  
                  this.loadAppointments();
                } else {
                  uni.showToast({
                    title: res.data.message || '取消失败',
                    icon: 'none'
                  });
                }
              },
              fail: () => {
                uni.hideLoading();
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    },
    viewMedicalRecord(appointmentId) {
      uni.navigateTo({
        url: './medical-record/medical-record?appointmentId=' + appointmentId
      });
    }
  }
}
</script>

<style>
@import './appointment.scss';
</style>
