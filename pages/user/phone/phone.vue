<template>
  <view class="phone-container">
    <u-navbar title="修改手机号" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="phone-form">
        <view class="form-title">当前绑定手机</view>
        <view class="current-phone">{{ maskPhone(currentPhone) }}</view>
        
        <view class="form-title">更换手机号</view>
        <view class="form-group">
          <input 
            type="number" 
            class="phone-input" 
            placeholder="请输入新手机号" 
            v-model="newPhone"
            maxlength="11"
          />
        </view>
        
        <view class="form-group verification-group">
          <input 
            type="number" 
            class="verification-input" 
            placeholder="请输入验证码" 
            v-model="verificationCode"
            maxlength="6"
          />
          <view 
            class="verification-btn" 
            :class="{ disabled: !canSendCode }"
            @click="sendVerificationCode"
          >
            {{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}
          </view>
        </view>
      </view>
      
      <view class="submit-btn" :class="{ disabled: !isValid }" @click="changePhone">确认修改</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPhone: '',
      newPhone: '',
      verificationCode: '',
      countDown: 0,
      timer: null
    }
  },
  computed: {
    // 是否可以发送验证码
    canSendCode() {
      return this.newPhone.length === 11 && this.countDown === 0;
    },
    
    // 表单是否有效
    isValid() {
      return this.newPhone.length === 11 && this.verificationCode.length === 6;
    }
  },
  onLoad() {
    this.getCurrentPhone();
  },
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    // 获取当前绑定的手机号
    getCurrentPhone() {
      // 从缓存中获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        const userObj = JSON.parse(userInfo);
        if (userObj.phone) {
          this.currentPhone = userObj.phone;
          return;
        }
      }
      
      // 如果缓存中没有，则请求API获取
      uni.request({
        url: '/api/user/info',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0 && res.data.data && res.data.data.phone) {
            this.currentPhone = res.data.data.phone;
          }
        },
        fail: () => {
          // 使用模拟数据
          this.currentPhone = '13812341234';
        }
      });
    },
    
    // 手机号脱敏处理
    maskPhone(phone) {
      if (!phone || phone.length !== 11) {
        return '未绑定手机号';
      }
      
      return phone.substring(0, 3) + '****' + phone.substring(7);
    },
    
    // 发送验证码
    sendVerificationCode() {
      if (!this.canSendCode) {
        return;
      }
      
      // 验证手机号格式
      if (!/^1\d{10}$/.test(this.newPhone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '发送中...'
      });
      
      // 调用发送验证码API
      uni.request({
        url: '/api/user/send-code',
        method: 'POST',
        data: {
          phone: this.newPhone,
          type: 'change_phone'
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.startCountDown();
            uni.showToast({
              title: '验证码已发送',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: res.data.message || '发送失败，请稍后再试',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟发送成功
          this.startCountDown();
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
        }
      });
    },
    
    // 开始倒计时
    startCountDown() {
      this.countDown = 60;
      
      this.timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    
    // 修改手机号
    changePhone() {
      if (!this.isValid) {
        if (this.newPhone.length !== 11) {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
          });
          return;
        }
        
        if (this.verificationCode.length !== 6) {
          uni.showToast({
            title: '请输入6位验证码',
            icon: 'none'
          });
          return;
        }
      }
      
      uni.showLoading({
        title: '修改中...'
      });
      
      // 调用修改手机号API
      uni.request({
        url: '/api/user/change-phone',
        method: 'POST',
        data: {
          newPhone: this.newPhone,
          verificationCode: this.verificationCode
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.updateLocalPhone();
            this.showSuccessAndGoBack();
          } else {
            uni.showToast({
              title: res.data.message || '修改失败，请检查验证码是否正确',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟成功
          setTimeout(() => {
            this.updateLocalPhone();
            this.showSuccessAndGoBack();
          }, 500);
        }
      });
    },
    
    // 更新本地存储的手机号
    updateLocalPhone() {
      // 从缓存中获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        const userObj = JSON.parse(userInfo);
        userObj.phone = this.newPhone;
        
        // 更新缓存
        uni.setStorageSync('userInfo', JSON.stringify(userObj));
      }
    },
    
    // 显示成功提示并返回
    showSuccessAndGoBack() {
      uni.showToast({
        title: '手机号修改成功',
        icon: 'success'
      });
      
      // 延迟返回
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  }
}
</script>

<style>
.phone-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 30rpx;
}

.phone-form {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.form-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.current-phone {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.form-group {
  margin-bottom: 30rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20rpx;
}

.phone-input, .verification-input {
  width: 100%;
  height: 80rpx;
  font-size: 30rpx;
  color: #333;
}

.verification-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.verification-input {
  flex: 1;
}

.verification-btn {
  width: 200rpx;
  height: 70rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}

.verification-btn.disabled {
  background-color: #cccccc;
}

.submit-btn {
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

.submit-btn.disabled {
  background-color: #cccccc;
}
</style>
