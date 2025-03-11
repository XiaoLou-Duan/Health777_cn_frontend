<template>
  <view class="profile-container">
    <u-navbar title="个人资料" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 基本信息区域 -->
      <view class="info-card">
        <view class="avatar-section">
          <image class="user-avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
          <text class="nickname">{{ userInfo.nickname }}</text>
          <text class="user-id">ID: {{ userInfo.userId }}</text>
        </view>
        
        <view class="info-section">
          <view class="info-item">
            <text class="info-label">性别</text>
            <text class="info-value">{{ userInfo.gender || '未设置' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">年龄</text>
            <text class="info-value">{{ userInfo.age || '未设置' }}岁</text>
          </view>
          <view class="info-item">
            <text class="info-label">手机号</text>
            <text class="info-value">{{ maskPhone(userInfo.phone) || '未绑定' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">邮箱</text>
            <text class="info-value">{{ userInfo.email || '未设置' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 身体数据区域 -->
      <view class="health-card">
        <view class="card-title">
          <text>身体数据</text>
        </view>
        
        <view class="health-section">
          <view class="health-item">
            <text class="value">{{ userInfo.height || '--' }}</text>
            <text class="unit">cm</text>
            <text class="label">身高</text>
          </view>
          
          <view class="health-item">
            <text class="value">{{ userInfo.weight || '--' }}</text>
            <text class="unit">kg</text>
            <text class="label">体重</text>
          </view>
          
          <view class="health-item">
            <text class="value">{{ getBMI() }}</text>
            <text class="unit">kg/m²</text>
            <text class="label">BMI</text>
          </view>
        </view>
      </view>
      
      <!-- 健康状况区域 -->
      <view class="health-card">
        <view class="card-title">
          <text>健康状况</text>
        </view>
        
        <view class="condition-section">
          <view class="condition-item">
            <text class="condition-label">肌少症状态</text>
            <text class="condition-value" :class="getSarcopeniaClass()">{{ getSarcopeniaText() }}</text>
          </view>
          
          <view class="condition-item">
            <text class="condition-label">慢性病史</text>
            <text class="condition-value">{{ userInfo.chronicDiseases || '无' }}</text>
          </view>
          
          <view class="condition-item">
            <text class="condition-label">药物过敏史</text>
            <text class="condition-value">{{ userInfo.allergies || '无' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 修改按钮 -->
      <view class="edit-btn" @click="goToEdit">编辑个人资料</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        userId: '',
        nickname: '',
        avatar: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        phone: '',
        email: '',
        sarcopeniaStatus: '',
        chronicDiseases: '',
        allergies: ''
      }
    }
  },
  onShow() {
    // 每次页面显示时刷新数据
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      uni.showLoading({
        title: '加载中'
      });
      
      // 从缓存中获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
        uni.hideLoading();
      } else {
        // 如果缓存中没有，则请求API获取
        uni.request({
          url: '/api/user/info',
          method: 'GET',
          success: (res) => {
            uni.hideLoading();
            
            if (res.data.code === 0 && res.data.data) {
              this.userInfo = res.data.data;
              
              // 存储到缓存中
              uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
            }
          },
          fail: () => {
            uni.hideLoading();
            
            // 使用模拟数据
            this.userInfo = {
              userId: '1001',
              nickname: '张三',
              avatar: '/static/images/avatar/user1.jpg',
              gender: '男',
              age: 65,
              height: 172,
              weight: 68,
              phone: '13812341234',
              email: 'zhangsan@example.com',
              sarcopeniaStatus: 'mild',
              chronicDiseases: '高血压，糖尿病',
              allergies: '无'
            };
            
            // 存储到缓存中
            uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
          }
        });
      }
    },
    
    // 手机号脱敏处理
    maskPhone(phone) {
      if (!phone || phone.length !== 11) {
        return '未绑定';
      }
      
      return phone.substring(0, 3) + '****' + phone.substring(7);
    },
    
    // 计算BMI
    getBMI() {
      if (!this.userInfo.height || !this.userInfo.weight) {
        return '--';
      }
      
      const height = parseFloat(this.userInfo.height) / 100; // 转换为米
      const weight = parseFloat(this.userInfo.weight);
      
      if (isNaN(height) || isNaN(weight) || height <= 0) {
        return '--';
      }
      
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    },
    
    // 获取肌少症状态文本
    getSarcopeniaText() {
      const statusMap = {
        'none': '无',
        'mild': '轻度',
        'moderate': '中度',
        'severe': '重度'
      };
      
      return statusMap[this.userInfo.sarcopeniaStatus] || '未检测';
    },
    
    // 获取肌少症状态CSS类
    getSarcopeniaClass() {
      const classMap = {
        'none': 'status-normal',
        'mild': 'status-mild',
        'moderate': 'status-moderate',
        'severe': 'status-severe'
      };
      
      return classMap[this.userInfo.sarcopeniaStatus] || '';
    },
    
    // 跳转到编辑页面
    goToEdit() {
      uni.navigateTo({
        url: '/pages/user/edit/edit'
      });
    }
  }
}
</script>

<style>
.profile-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 30rpx;
}

.info-card, .health-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.avatar-section {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.user-avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 26rpx;
  color: #999999;
}

.info-section {
  padding: 20rpx 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
}

.card-title {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.card-title text {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  position: relative;
  padding-left: 20rpx;
}

.card-title text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6rpx;
  width: 6rpx;
  height: 26rpx;
  background-color: #5FB878;
  border-radius: 3rpx;
}

.health-section {
  display: flex;
  padding: 30rpx;
}

.health-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.health-item .value {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

.health-item .unit {
  font-size: 24rpx;
  color: #999999;
  margin: 6rpx 0;
}

.health-item .label {
  font-size: 28rpx;
  color: #666666;
}

.condition-section {
  padding: 20rpx 30rpx;
}

.condition-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.condition-item:last-child {
  border-bottom: none;
}

.condition-label {
  font-size: 28rpx;
  color: #666666;
}

.condition-value {
  font-size: 28rpx;
  color: #333333;
}

.status-normal {
  color: #5FB878;
}

.status-mild {
  color: #FFB800;
}

.status-moderate {
  color: #FF9900;
}

.status-severe {
  color: #FF5252;
}

.edit-btn {
  height: 90rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
</style>
