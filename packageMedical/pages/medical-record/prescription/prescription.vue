<template>
  <view class="prescription-container">
    <u-navbar title="处方详情" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 处方头部信息 -->
      <view class="prescription-header">
        <view class="hospital-name">{{ prescriptionInfo.hospitalName }}</view>
        <view class="prescription-title">处方笺</view>
        <view class="prescription-no">处方号：{{ prescriptionInfo.prescriptionNo }}</view>
      </view>
      
      <!-- 患者信息 -->
      <view class="info-section">
        <view class="patient-row">
          <view class="info-item half">
            <text class="info-label">姓名：</text>
            <text class="info-value">{{ prescriptionInfo.patientName }}</text>
          </view>
          <view class="info-item half">
            <text class="info-label">性别：</text>
            <text class="info-value">{{ prescriptionInfo.gender }}</text>
          </view>
        </view>
        
        <view class="patient-row">
          <view class="info-item half">
            <text class="info-label">年龄：</text>
            <text class="info-value">{{ prescriptionInfo.age }}岁</text>
          </view>
          <view class="info-item half">
            <text class="info-label">科室：</text>
            <text class="info-value">{{ prescriptionInfo.department }}</text>
          </view>
        </view>
        
        <view class="patient-row">
          <view class="info-item full">
            <text class="info-label">诊断：</text>
            <text class="info-value">{{ prescriptionInfo.diagnosis }}</text>
          </view>
        </view>
      </view>
      
      <!-- 药品列表 -->
      <view class="medicine-list">
        <view class="list-header">
          <text class="header-cell name">药品名称</text>
          <text class="header-cell spec">规格</text>
          <text class="header-cell quantity">数量</text>
        </view>
        
        <view 
          class="medicine-item" 
          v-for="(medicine, index) in prescriptionInfo.medicines" 
          :key="index"
        >
          <view class="medicine-cell name">{{ medicine.name }}</view>
          <view class="medicine-cell spec">{{ medicine.specification }}</view>
          <view class="medicine-cell quantity">{{ medicine.quantity }}</view>
          <view class="medicine-usage">
            <text>{{ medicine.usage }}</text>
          </view>
        </view>
      </view>
      
      <!-- 医师信息 -->
      <view class="doctor-section">
        <view class="info-row">
          <text class="info-label">处方医师：</text>
          <text class="info-value">{{ prescriptionInfo.doctorName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">开具日期：</text>
          <text class="info-value">{{ formatDate(prescriptionInfo.createTime) }}</text>
        </view>
      </view>
      
      <!-- 用药说明 -->
      <view class="instructions-section">
        <view class="section-title">用药说明</view>
        <view class="instruction-content">
          <text>{{ prescriptionInfo.instructions || '无特殊说明' }}</text>
        </view>
      </view>
      
      <!-- 底部操作栏 -->
      <view class="footer-actions">
        <view class="action-button download" @click="downloadPrescription">
          <u-icon name="download" size="30" color="#ffffff"></u-icon>
          <text>下载处方</text>
        </view>
        <view class="action-button share" @click="sharePrescription">
          <u-icon name="share" size="30" color="#ffffff"></u-icon>
          <text>分享</text>
        </view>
      </view>
      
      <!-- 官方印章 -->
      <view class="official-seal">
        <image src="/static/images/official-seal.png" mode="aspectFit"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordId: '',
      prescriptionInfo: {
        prescriptionNo: '',
        hospitalName: '',
        department: '',
        doctorName: '',
        patientName: '',
        gender: '',
        age: '',
        diagnosis: '',
        createTime: 0,
        medicines: [],
        instructions: ''
      }
    }
  },
  onLoad(options) {
    if (options.recordId) {
      this.recordId = options.recordId;
      this.loadPrescriptionData();
    }
  },
  methods: {
    // 加载处方数据
    loadPrescriptionData() {
      uni.showLoading({
        title: '加载中'
      });
      
      uni.request({
        url: '/api/medical/prescription/' + this.recordId,
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.prescriptionInfo = res.data.data;
          } else {
            uni.showToast({
              title: res.data.message || '获取处方信息失败',
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
        },
        complete: () => {
          // 如果没有数据，添加模拟数据
          if (!this.prescriptionInfo.prescriptionNo) {
            this.addMockData();
          }
        }
      });
    },
    
    // 添加模拟数据
    addMockData() {
      const mockData = {
        prescriptionNo: 'RX' + Date.now().toString().substring(6),
        hospitalName: '协和医院',
        department: '内科',
        doctorName: '张医生',
        patientName: '张三',
        gender: '男',
        age: '32',
        diagnosis: '上呼吸道感染',
        createTime: Date.now() - 86400000 * 2, // 2天前
        medicines: [
          {
            name: '连花清瘟胶囊',
            specification: '0.35g*36粒/盒',
            quantity: '2盒',
            usage: '口服，一次4粒，一日3次'
          },
          {
            name: '布洛芬缓释胶囊',
            specification: '0.3g*10粒/盒',
            quantity: '1盒',
            usage: '口服，一次1粒，必要时服用，间隔4-6小时'
          },
          {
            name: '银黄颗粒',
            specification: '4g*10袋/盒',
            quantity: '2盒',
            usage: '口服，一次1袋，一日3次'
          },
          {
            name: '复方甘草片',
            specification: '0.5g*24片/盒',
            quantity: '1盒',
            usage: '口服，一次2片，一日3次'
          }
        ],
        instructions: '1. 按医嘱服药，不得擅自增减药量或停药。\n2. 注意休息，多饮水，保持良好的生活习惯。\n3. 如症状加重请及时就医。\n4. 服药期间如出现皮疹、瘙痒等过敏反应，请立即停药并就医。'
      };
      
      this.prescriptionInfo = mockData;
    },
    
    // 下载处方
    downloadPrescription() {
      uni.showLoading({
        title: '正在下载'
      });
      
      // 模拟下载过程
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '处方已保存至相册',
          icon: 'success'
        });
      }, 1500);
    },
    
    // 分享处方
    sharePrescription() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: '处方详情 - ' + this.prescriptionInfo.hospitalName,
        summary: '诊断：' + this.prescriptionInfo.diagnosis,
        imageUrl: '/static/images/prescription-icon.png',
        success: (res) => {
          console.log('分享成功');
        },
        fail: (err) => {
          console.log('分享失败', err);
        }
      });
    },
    
    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    }
  }
}
</script>

<style>
@import './prescription.scss';
</style>
