<template>
  <view class="profile-container">
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <text class="iconfont icon-arrow-left" style="color: #333333;"></text>
      </view>
      <view class="navbar-title">个人资料</view>
      <view class="navbar-right"></view>
    </view>
    <view class="content-wrapper">
      <!-- 基本信息区域 -->
      <view class="info-card">
        <view class="avatar-section">
          <image class="user-avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
          <text class="nickname">{{ userInfo.nickname }}</text>
          <text class="user-id">ID: {{ userInfo.id }}</text>
        </view>
        
        <view class="info-section">
          <view class="info-item">
            <text class="info-label">性别</text>
            <text class="info-value">{{ getSexText() }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">手机号</text>
            <text class="info-value">{{ userInfo.mobile || '未绑定' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">积分</text>
            <text class="info-value">{{ userInfo.point || 0 }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">经验值</text>
            <text class="info-value">{{ userInfo.experience || 0 }}</text>
          </view>
        </view>
      </view>
      
      <!-- 等级信息区域 -->
      <view class="health-card" v-if="userInfo.level">
        <view class="card-title">
          <text>等级信息</text>
        </view>
        
        <view class="level-section">
          <view class="level-item">
            <image class="level-icon" :src="userInfo.level.icon || '/static/images/default-level.png'" mode="aspectFill"></image>
            <view class="level-info">
              <text class="level-name">{{ userInfo.level.name }}</text>
              <text class="level-value">Lv.{{ userInfo.level.level }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 佣金状态 -->
      <view class="health-card" v-if="userInfo.brokerageEnabled !== undefined">
        <view class="card-title">
          <text>佣金状态</text>
        </view>
        
        <view class="brokerage-section">
          <view class="brokerage-item">
            <text class="brokerage-label">佣金功能</text>
            <text class="brokerage-value" :class="userInfo.brokerageEnabled ? 'status-normal' : ''">{{ userInfo.brokerageEnabled ? '已启用' : '未启用' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 修改按钮 -->
      <view class="edit-btn" @click="goToEdit">编辑个人资料</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {}
  },
  
  computed: {
    ...mapState('user', {
      userInfo: state => state.userInfo || {
        id: '',
        nickname: '',
        avatar: '',
        mobile: '',
        sex: 0,
        point: 0,
        experience: 0,
        level: {
          id: '',
          name: '',
          level: 0,
          icon: ''
        },
        brokerageEnabled: false
      }
    })
  },
  // 添加页面加载时的钩子
  onLoad() {
    console.log('个人资料页面加载');
    this.fetchUserInfo();
  },
  onShow() {
    // 每次页面显示时刷新数据
    console.log('个人资料页面显示');
    this.fetchUserInfo();
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    
    // 获取用户信息
    fetchUserInfo() {
      console.log('开始获取用户信息');
      uni.showLoading({
        title: '加载中'
      });
      
      this.getUserInfo().then(res => {
        uni.hideLoading();
        if (res.success) {
          console.log('获取用户信息成功:', res.data);
        } else {
          console.error('获取用户信息失败:', res.message);
          uni.showToast({
            title: res.message || '获取用户信息失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        console.error('获取用户信息异常:', err);
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      });
    },
    
    // 获取性别文本
    getSexText() {
      const sexMap = {
        0: '未知',
        1: '男',
        2: '女'
      };
      
      return sexMap[this.userInfo.sex] || '未设置';
    },
    
    // 跳转到编辑页面
    goToEdit() {
      uni.navigateTo({
        url: '/pages/user/edit/edit'
      });
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
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
  margin-top: 44px;
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

.level-section {
  padding: 20rpx 30rpx;
}

.level-item {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.level-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.level-info {
  display: flex;
  flex-direction: column;
}

.level-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6rpx;
}

.level-value {
  font-size: 28rpx;
  color: #2096F3;
  font-weight: bold;
}

.brokerage-section {
  padding: 20rpx 30rpx;
}

.brokerage-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
}

.brokerage-label {
  font-size: 28rpx;
  color: #666666;
}

.brokerage-value {
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
  background-color: #2096F3;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(32, 150, 243, 0.3);
}
</style>
