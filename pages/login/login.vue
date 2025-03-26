<template>
  <view class="login-container">
    <!-- 顶部登录图标区域 -->
    <view class="login-header">
      <image class="logo-image" src="/static/images/logo.png" mode="aspectFit"></image>
      <text class="app-name">肌少症健康管理</text>
      <text class="app-slogan">科学管理健康，积极预防肌少症</text>
    </view>
    
    <!-- 登录表单区域 -->
    <view class="login-form">
      <view class="form-title">
        <text class="title-text">{{ isRegister ? '注册账号' : '账号登录' }}</text>
      </view>
      
      <!-- 手机号输入 -->
      <view class="input-group">
        <u-icon name="phone" size="36" color="#5FB878"></u-icon>
        <input
          class="input-field"
          type="number"
          v-model="phone"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
      
      <!-- 密码输入 -->
      <view class="input-group">
        <u-icon name="lock" size="36" color="#5FB878"></u-icon>
        <input
          class="input-field"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="请输入密码"
        />
        <view class="password-icon" @click="togglePasswordVisibility">
          <u-icon :name="showPassword ? 'eye' : 'eye-off'" size="36" color="#c0c4cc"></u-icon>
        </view>
      </view>
      
      <!-- 注册时的确认密码 -->
      <view class="input-group" v-if="isRegister">
        <u-icon name="lock" size="36" color="#5FB878"></u-icon>
        <input
          class="input-field"
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="请确认密码"
        />
        <view class="password-icon" @click="toggleConfirmPasswordVisibility">
          <u-icon :name="showConfirmPassword ? 'eye' : 'eye-off'" size="36" color="#c0c4cc"></u-icon>
        </view>
      </view>
      
      <!-- 验证码输入 -->
      <view class="input-group" v-if="isRegister || isForgotPassword">
        <u-icon name="checkmark-circle" size="36" color="#5FB878"></u-icon>
        <input
          class="input-field verification-input"
          type="number"
          v-model="verificationCode"
          maxlength="6"
          placeholder="请输入验证码"
        />
        <view 
          class="verification-btn" 
          :class="{ disabled: isSendingCode || countDown > 0 }"
          @click="sendVerificationCode"
        >
          {{ countDown > 0 ? `${countDown}s后重发` : '获取验证码' }}
        </view>
      </view>
      
      <!-- 登录按钮 -->
      <view 
        class="login-btn" 
        :class="{ disabled: !isFormValid }"
        @click="handleSubmit"
      >
        {{ isRegister ? '注册' : (isForgotPassword ? '重置密码' : '登录') }}
      </view>
      
      <!-- 其他操作选项 -->
      <view class="other-options">
        <text @click="switchToForgotPassword" v-if="!isRegister && !isForgotPassword">忘记密码</text>
        <text @click="switchToRegister" v-if="!isRegister && !isForgotPassword">注册账号</text>
        <text @click="switchToLogin" v-if="isRegister || isForgotPassword">返回登录</text>
      </view>
      
      <!-- 快捷登录选项 -->
      <view class="quick-login" v-if="!isRegister && !isForgotPassword">
        <view class="divider">
          <view class="line"></view>
          <text>快捷登录</text>
          <view class="line"></view>
        </view>
        
        <view class="quick-options">
          <view class="quick-item" @click="quickLogin('wechat')">
            <u-icon name="weixin-fill" size="50" color="#09BB07"></u-icon>
            <text>微信</text>
          </view>
          <view class="quick-item" @click="quickLogin('apple')">
            <u-icon name="apple-fill" size="50" color="#333333"></u-icon>
            <text>Apple</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部协议提示 -->
    <view class="agreement-tip">
      <view class="checkbox" @click="toggleAgree">
        <u-icon 
          :name="isAgree ? 'checkbox-mark' : 'checkbox'" 
          size="30" 
          :color="isAgree ? '#5FB878' : '#c0c4cc'"
        ></u-icon>
      </view>
      <text class="agreement-text">
        已阅读并同意
        <text class="link" @click.stop="viewAgreement">《用户协议》</text>
        和
        <text class="link" @click.stop="viewPrivacy">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      showPassword: false,
      showConfirmPassword: false,
      isRegister: false,
      isForgotPassword: false,
      isAgree: true,
      isSendingCode: false,
      countDown: 0,
      timer: null
    }
  },
  computed: {
    // 表单验证
    isFormValid() {
      const phoneValid = /^1[3-9]\d{9}$/.test(this.phone);
      const passwordValid = this.password.length >= 6;
      
      if (this.isRegister) {
        const confirmValid = this.password === this.confirmPassword;
        const codeValid = this.verificationCode.length === 6;
        return phoneValid && passwordValid && confirmValid && codeValid && this.isAgree;
      } else if (this.isForgotPassword) {
        const codeValid = this.verificationCode.length === 6;
        return phoneValid && passwordValid && codeValid && this.isAgree;
      } else {
        return phoneValid && passwordValid && this.isAgree;
      }
    }
  },
  onUnload() {
    // 页面卸载清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    // 切换密码可见性
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    // 切换确认密码可见性
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    
    // 切换协议同意状态
    toggleAgree() {
      this.isAgree = !this.isAgree;
    },
    
    // 切换到注册界面
    switchToRegister() {
      this.isRegister = true;
      this.isForgotPassword = false;
      this.clearForm();
    },
    
    // 切换到登录界面
    switchToLogin() {
      this.isRegister = false;
      this.isForgotPassword = false;
      this.clearForm();
    },
    
    // 切换到忘记密码界面
    switchToForgotPassword() {
      this.isRegister = false;
      this.isForgotPassword = true;
      this.clearForm();
    },
    
    // 清空表单
    clearForm() {
      this.password = '';
      this.confirmPassword = '';
      this.verificationCode = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
      
      // 清除验证码倒计时
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.countDown = 0;
    },
    
    // 发送验证码
    sendVerificationCode() {
      if (this.isSendingCode || this.countDown > 0) return;
      
      // 检查手机号
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      this.isSendingCode = true;
      
      // 调用发送验证码API
      uni.request({
        url: '/api/user/send-verification-code',
        method: 'POST',
        data: {
          phone: this.phone,
          type: this.isRegister ? 'register' : 'reset-password'
        },
        success: (res) => {
          this.isSendingCode = false;
          
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
          this.isSendingCode = false;
          
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
    
    // 处理表单提交
    handleSubmit() {
      if (!this.isFormValid) return;
      
      if (!this.isAgree) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: this.isRegister ? '注册中...' : (this.isForgotPassword ? '重置中...' : '登录中...')
      });
      
      if (this.isRegister) {
        this.register();
      } else if (this.isForgotPassword) {
        this.resetPassword();
      } else {
        this.login();
      }
    },
    
    // 登录
    login() {
      // 判断是密码登录还是验证码登录
      const isSmsLogin = this.password.length === 6 && /^\d{6}$/.test(this.password);
      
      // 调用登录API
      uni.request({
        url: isSmsLogin ? '/api/auth/login-by-sms' : '/api/auth/login',
        method: 'POST',
        data: isSmsLogin ? {
          phone: this.phone,
          code: this.password
        } : {
          phone: this.phone,
          password: this.password
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            this.loginSuccess(res.data.data);
          } else {
            uni.showToast({
              title: res.data.message || (isSmsLogin ? '登录失败，请检查验证码' : '登录失败，请检查账号密码'),
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟登录成功
          this.loginSuccess({
            userId: '1001',
            token: 'mock_token_12345',
            nickName: '健康达人',
            avatar: '/static/images/avatar.png'
          });
        }
      });
    },
    
    // 注册
    register() {
      // 调用注册API
      uni.request({
        url: '/api/user/register',
        method: 'POST',
        data: {
          phone: this.phone,
          password: this.password,
          verificationCode: this.verificationCode
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            });
            
            // 注册成功后自动登录
            setTimeout(() => {
              this.loginSuccess(res.data.data);
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || '注册失败，请稍后再试',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟注册成功
          uni.showToast({
            title: '注册成功',
            icon: 'success'
          });
          
          // 自动登录
          setTimeout(() => {
            this.loginSuccess({
              userId: '1001',
              token: 'mock_token_12345',
              nickName: '健康达人',
              avatar: '/static/images/avatar.png'
            });
          }, 1500);
        }
      });
    },
    
    // 重置密码
    resetPassword() {
      // 调用重置密码API
      uni.request({
        url: '/api/user/reset-password',
        method: 'POST',
        data: {
          phone: this.phone,
          newPassword: this.password,
          verificationCode: this.verificationCode
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '密码重置成功',
              icon: 'success'
            });
            
            // 重置成功后返回登录页
            setTimeout(() => {
              this.switchToLogin();
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || '重置失败，请稍后再试',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟重置成功
          uni.showToast({
            title: '密码重置成功',
            icon: 'success'
          });
          
          // 返回登录页
          setTimeout(() => {
            this.switchToLogin();
          }, 1500);
        }
      });
    },
    
    // 登录成功处理
    loginSuccess(userData) {
      // 存储用户信息
      uni.setStorageSync('userInfo', JSON.stringify(userData));
      uni.setStorageSync('token', userData.token);
      
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 跳转到首页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    },
    
    // 快捷登录
    quickLogin(type) {
      uni.showLoading({
        title: '登录中...'
      });
      
      // 根据类型调用不同的API
      let apiUrl = type === 'wechat' ? '/api/user/wechat-login' : '/api/user/apple-login';
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 模拟第三方登录成功
        this.loginSuccess({
          userId: '1001',
          token: `mock_token_${type}_12345`,
          nickName: '健康达人',
          avatar: '/static/images/avatar.png'
        });
      }, 1500);
    },
    
    // 查看用户协议
    viewAgreement() {
      uni.navigateTo({
        url: '/pages/about/user-agreement'
      });
    },
    
    // 查看隐私政策
    viewPrivacy() {
      uni.navigateTo({
        url: '/pages/about/privacy-policy'
      });
    }
  }
}
</script>

<style>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
}

.logo-image {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: #999;
}

.login-form {
  padding: 0 60rpx;
  flex: 1;
}

.form-title {
  margin-bottom: 60rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.input-group {
  display: flex;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid #e5e5e5;
  margin-bottom: 40rpx;
}

.input-field {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  padding: 0 20rpx;
}

.verification-input {
  width: 60%;
}

.verification-btn {
  font-size: 26rpx;
  color: #5FB878;
  padding: 0 20rpx;
}

.verification-btn.disabled {
  color: #c0c4cc;
}

.password-icon {
  padding: 0 10rpx;
}

.login-btn {
  height: 90rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
}

.login-btn.disabled {
  background-color: #cccccc;
}

.other-options {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.other-options text {
  font-size: 28rpx;
  color: #5FB878;
}

.quick-login {
  margin-top: 80rpx;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.line {
  width: 80rpx;
  height: 1rpx;
  background-color: #e5e5e5;
}

.divider text {
  font-size: 24rpx;
  color: #999;
  margin: 0 20rpx;
}

.quick-options {
  display: flex;
  justify-content: center;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 50rpx;
}

.quick-item text {
  font-size: 24rpx;
  color: #666;
  margin-top: 16rpx;
}

.agreement-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.checkbox {
  margin-right: 10rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
}

.link {
  color: #5FB878;
}
</style>
