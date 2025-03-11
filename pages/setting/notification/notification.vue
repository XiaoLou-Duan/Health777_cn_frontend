<template>
  <view class="notification-container">
    <u-navbar title="消息通知" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 通知总开关 -->
      <view class="settings-group">
        <view class="group-title">通知设置</view>
        <view class="setting-item">
          <text>接收通知</text>
          <u-switch v-model="settings.enablePush" @change="onPushChange"></u-switch>
        </view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>声音提醒</text>
          <u-switch v-model="settings.enableSound" :disabled="!settings.enablePush"></u-switch>
        </view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>振动提醒</text>
          <u-switch v-model="settings.enableVibration" :disabled="!settings.enablePush"></u-switch>
        </view>
      </view>
      
      <!-- 免打扰时间 -->
      <view class="settings-group">
        <view class="group-title">勿扰模式</view>
        <view class="setting-item">
          <text>开启勿扰模式</text>
          <u-switch v-model="doNotDisturbEnabled" @change="onDoNotDisturbChange"></u-switch>
        </view>
        <view class="time-picker-row" :class="{ disabled: !doNotDisturbEnabled }">
          <view class="time-picker-item">
            <text>开始时间</text>
            <view class="time-picker" @click="openStartPicker">
              <text>{{ settings.doNotDisturbTimeStart }}</text>
              <u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
            </view>
          </view>
          <view class="time-picker-item">
            <text>结束时间</text>
            <view class="time-picker" @click="openEndPicker">
              <text>{{ settings.doNotDisturbTimeEnd }}</text>
              <u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 通知类型设置 -->
      <view class="settings-group">
        <view class="group-title">消息类别</view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>系统消息</text>
          <u-switch v-model="settings.categories.system" :disabled="!settings.enablePush"></u-switch>
        </view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>提醒消息</text>
          <u-switch v-model="settings.categories.reminder" :disabled="!settings.enablePush"></u-switch>
        </view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>社区消息</text>
          <u-switch v-model="settings.categories.community" :disabled="!settings.enablePush"></u-switch>
        </view>
        <view class="setting-item" :class="{ disabled: !settings.enablePush }">
          <text>私信消息</text>
          <u-switch v-model="settings.categories.message" :disabled="!settings.enablePush"></u-switch>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-btn" @click="saveSettings">保存设置</view>
    </view>
    
    <!-- 时间选择器 -->
    <u-picker 
      v-model="showTimePicker" 
      mode="time" 
      :params="timeParams" 
      @confirm="onTimeConfirm"
      :defaultTime="currentSelectedTime"
    ></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      settings: {
        enablePush: true,
        enableSound: true,
        enableVibration: true,
        doNotDisturbTimeStart: '22:00',
        doNotDisturbTimeEnd: '07:00',
        categories: {
          system: true,
          reminder: true,
          community: true,
          message: true
        }
      },
      doNotDisturbEnabled: true,
      showTimePicker: false,
      currentTimeType: '', // 'start' 或 'end'
      currentSelectedTime: '',
      timeParams: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: false
      }
    }
  },
  onLoad() {
    this.getUserId();
    this.getSettings();
  },
  methods: {
    // 获取用户ID
    getUserId() {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        const userObj = JSON.parse(userInfo);
        this.userId = userObj.userId;
      }
    },
    
    // 获取通知设置
    getSettings() {
      uni.showLoading({
        title: '加载中'
      });
      
      // 调用获取设置API
      uni.request({
        url: '/api/user/notification-settings',
        method: 'GET',
        data: {
          userId: this.userId
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            this.settings = res.data.data.settings;
            // 根据时间设置初始化勿扰模式开关状态
            this.initDoNotDisturbState();
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 使用模拟数据
          this.settings = {
            enablePush: true,
            enableSound: true,
            enableVibration: true,
            doNotDisturbTimeStart: '22:00',
            doNotDisturbTimeEnd: '07:00',
            categories: {
              system: true,
              reminder: true,
              community: true,
              message: true
            }
          };
          
          // 根据时间设置初始化勿扰模式开关状态
          this.initDoNotDisturbState();
        }
      });
    },
    
    // 初始化勿扰模式状态
    initDoNotDisturbState() {
      this.doNotDisturbEnabled = this.settings.doNotDisturbTimeStart && this.settings.doNotDisturbTimeEnd;
    },
    
    // 通知开关切换
    onPushChange(value) {
      // 如果关闭总开关，所有子开关也应该被禁用
      if (!value) {
        this.settings.enableSound = false;
        this.settings.enableVibration = false;
      }
    },
    
    // 勿扰模式切换
    onDoNotDisturbChange(value) {
      if (!value) {
        // 关闭勿扰模式，清空时间设置
        this.settings.doNotDisturbTimeStart = '';
        this.settings.doNotDisturbTimeEnd = '';
      } else {
        // 开启勿扰模式，设置默认时间
        this.settings.doNotDisturbTimeStart = '22:00';
        this.settings.doNotDisturbTimeEnd = '07:00';
      }
    },
    
    // 打开开始时间选择器
    openStartPicker() {
      if (!this.doNotDisturbEnabled) return;
      
      this.currentTimeType = 'start';
      this.currentSelectedTime = this.settings.doNotDisturbTimeStart;
      this.showTimePicker = true;
    },
    
    // 打开结束时间选择器
    openEndPicker() {
      if (!this.doNotDisturbEnabled) return;
      
      this.currentTimeType = 'end';
      this.currentSelectedTime = this.settings.doNotDisturbTimeEnd;
      this.showTimePicker = true;
    },
    
    // 时间选择确认
    onTimeConfirm(e) {
      const time = `${e.hour}:${e.minute}`;
      
      if (this.currentTimeType === 'start') {
        this.settings.doNotDisturbTimeStart = time;
      } else if (this.currentTimeType === 'end') {
        this.settings.doNotDisturbTimeEnd = time;
      }
    },
    
    // 保存设置
    saveSettings() {
      uni.showLoading({
        title: '保存中'
      });
      
      // 调用保存设置API
      uni.request({
        url: '/api/user/notification-settings',
        method: 'POST',
        data: {
          userId: this.userId,
          settings: this.settings
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.showSuccessToast();
          } else {
            uni.showToast({
              title: res.data.message || '保存失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟成功
          setTimeout(() => {
            this.showSuccessToast();
          }, 500);
        }
      });
    },
    
    // 显示成功提示
    showSuccessToast() {
      uni.showToast({
        title: '设置已保存',
        icon: 'success'
      });
    }
  }
}
</script>

<style>
.notification-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx 30rpx 30rpx;
}

.settings-group {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.group-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  padding: 24rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item text {
  font-size: 28rpx;
  color: #333;
}

.setting-item.disabled text {
  color: #999;
}

.time-picker-row {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.time-picker-row.disabled {
  opacity: 0.6;
}

.time-picker-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.time-picker-item text {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.time-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 16rpx 20rpx;
  border-radius: 8rpx;
}

.time-picker text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 0;
}

.save-btn {
  height: 90rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60rpx;
}
</style>
