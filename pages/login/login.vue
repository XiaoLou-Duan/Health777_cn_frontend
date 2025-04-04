<template>
  <view class="login-container">
    <!-- 顶部登录图标区域 -->
    <view class="login-header">
      <image class="logo-image" src="https://img.freepik.com/free-photo/medical-banner-with-stethoscope.jpg" mode="aspectFit"></image>
      <text class="app-name">肌少症健康管理</text>
      <text class="app-slogan">科学管理健康，积极预防肌少症</text>
    </view>
    
    <!-- 登录表单区域 -->
    <view class="login-form">
      <view class="form-title">
        <text class="title-text">{{ isRegister ? '注册账号' : '账号登录' }}</text>
      </view>
      
      <!-- 登录方式切换 -->
      <view class="login-type-switch" v-if="!isRegister && !isForgotPassword">
        <view 
          class="switch-item" 
          :class="{ active: loginType === 'password' }" 
          @click="switchLoginType('password')"
        >
          密码登录
        </view>
        <view 
          class="switch-item" 
          :class="{ active: loginType === 'sms' }" 
          @click="switchLoginType('sms')"
        >
          验证码登录
        </view>
      </view>
      
      <!-- 手机号输入 -->
      <view class="input-group">
        <text class="iconfont icon-phone" style="font-size: 36rpx; color: #2096F3;"></text>
        <input
          class="input-field"
          type="number"
          v-model="phone"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
      
      <!-- 密码输入 - 密码登录方式 -->
      <view class="input-group" v-if="(loginType === 'password' && !isRegister && !isForgotPassword) || isRegister || isForgotPassword">
        <text class="iconfont icon-lock" style="font-size: 36rpx; color: #2096F3;"></text>
        <input
          class="input-field"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="请输入密码"
        />
        <view class="password-icon" @click="togglePasswordVisibility">
          <text class="iconfont" :class="showPassword ? 'icon-eye' : 'icon-eye-off'" style="font-size: 36rpx; color: #c0c4cc;"></text>
        </view>
      </view>
      
      <!-- 验证码输入 - 验证码登录方式 -->
      <view class="input-group" v-if="loginType === 'sms' || isRegister || isForgotPassword">
        <text class="iconfont icon-checkmark-circle" style="font-size: 36rpx; color: #2096F3;"></text>
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
      
      <!-- 注册时的确认密码 -->
      <view class="input-group" v-if="isRegister">
        <text class="iconfont icon-lock" style="font-size: 36rpx; color: #2096F3;"></text>
        <input
          class="input-field"
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="请确认密码"
        />
        <view class="password-icon" @click="toggleConfirmPasswordVisibility">
          <text class="iconfont" :class="showConfirmPassword ? 'icon-eye' : 'icon-eye-off'" style="font-size: 36rpx; color: #c0c4cc;"></text>
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
    </view>
    
    <!-- 底部协议提示 -->
    <view class="agreement-tip">
      <view class="checkbox" @click="toggleAgree">
        <text 
          class="iconfont" 
          :class="isAgree ? 'icon-checkbox-mark' : 'icon-checkbox'" 
          :style="{fontSize: '30rpx', color: isAgree ? '#4CAF50' : '#9E9E9E'}"
        ></text>
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
import AuthService from '@/services/auth';
import { validatePhone } from '@/utils/validation.js';
import { mapActions } from 'vuex';

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
      timer: null,
      loginType: 'password' // 默认密码登录，可选值：password-密码登录, sms-验证码登录
    }
  },
  computed: {
    // 表单验证
    isFormValid() {
      const phoneValid = validatePhone(this.phone);
      
      if (this.isRegister) {
        const passwordValid = this.password.length >= 6;
        const confirmValid = this.password === this.confirmPassword;
        const codeValid = this.verificationCode.length === 6;
        return phoneValid && passwordValid && confirmValid && codeValid && this.isAgree;
      } else if (this.isForgotPassword) {
        const passwordValid = this.password.length >= 6;
        const codeValid = this.verificationCode.length === 6;
        return phoneValid && passwordValid && codeValid && this.isAgree;
      } else if (this.loginType === 'password') {
        const passwordValid = this.password.length >= 4;
        return phoneValid && passwordValid && this.isAgree;
      } else {
        // 验证码登录
        const codeValid = /^\d{4,}$/.test(this.verificationCode);
        return phoneValid && codeValid && this.isAgree;
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
    ...mapActions('user', [
      'loginByPassword',
      'loginByPhone',
      'register'
    ]),
    // 切换登录方式
    switchLoginType(type) {
      this.loginType = type;
      // 清空相关字段
      if (type === 'password') {
        this.verificationCode = '';
      } else {
        this.password = '';
      }
    },
    
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
      // 如果正在发送或倒计时中，不处理
      if (this.isSendingCode || this.countDown > 0) return;
      
      // 验证手机号
      if (!validatePhone(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      this.isSendingCode = true;
      
      // 确定场景编号
      let scene = '1'; // 默认登录场景
      if (this.isRegister) {
        scene = '2'; // 注册场景
      } else if (this.isForgotPassword) {
        scene = '4'; // 忘记密码场景
      }
      
      // 调用发送验证码接口
      AuthService.sendSmsCode({
        phone: this.phone,
        scene: scene
      }).then(res => {
        this.isSendingCode = false;
        
        if (res.code === 0 || res.status === 200) {
          // 发送成功，开始倒计时
          this.startCountDown();
          
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.message || '发送失败，请稍后再试',
            icon: 'none'
          });
        }
      }).catch(err => {
        this.isSendingCode = false;
        console.error('发送验证码失败:', err);
        
        uni.showToast({
          title: '发送失败，请稍后再试',
          icon: 'none'
        });
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
        this.register({
          phone: this.phone,
          password: this.password,
          code: this.verificationCode
        }).then(result => {
          uni.hideLoading();
          
          if (result.success) {
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            });
            
            // 注册成功后跳转到首页
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index'
              });
            }, 1500);
          } else {
            uni.showToast({
              title: result.message || '注册失败，请稍后再试',
              icon: 'none'
            });
          }
        }).catch(err => {
          uni.hideLoading();
          console.error('注册失败:', err);
          
          uni.showToast({
            title: '注册失败，请稍后再试',
            icon: 'none'
          });
        });
      } else if (this.isForgotPassword) {
        this.resetPassword();
      } else {
        this.login();
      }
    },
    
    // 登录
    login() {
      if (this.loginType === 'password') {
        // 密码登录
        this.loginByPassword({
          phone: this.phone,
          password: this.password
        }).then(result => {
          uni.hideLoading();
          
          if (result.success) {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            
            // 登录成功后跳转到首页
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index'
              });
            }, 200);
          } else {
            uni.showToast({
              title: result.message || '登录失败，请检查账号密码',
              icon: 'none'
            });
          }
        }).catch(err => {
          uni.hideLoading();
          console.error('登录失败:', err);
          
          uni.showToast({
            title: '登录失败，请稍后再试',
            icon: 'none'
          });
        });
      } else {
        // 验证码登录
        this.loginByPhone({
          phone: this.phone,
          code: this.verificationCode
        }).then(result => {
          uni.hideLoading();
          
          if (result.success) {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            
            // 登录成功后跳转到首页
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index'
              });
            }, 200);
          } else {
            uni.showToast({
              title: result.message || '登录失败，请检查验证码',
              icon: 'none'
            });
          }
        }).catch(err => {
          uni.hideLoading();
          console.error('登录失败:', err);
          
          uni.showToast({
            title: '登录失败，请稍后再试',
            icon: 'none'
          });
        });
      }
    },
    
    // 重置密码
    resetPassword() {
      AuthService.resetPassword({
        phone: this.phone,
        newPassword: this.password,
        code: this.verificationCode
      }).then(res => {
        uni.hideLoading();
        
        if (res.code === 0 || res.status === 200) {
          uni.showToast({
            title: '密码重置成功',
            icon: 'success'
          });
          
          // 重置成功后返回登录页
          setTimeout(() => {
            this.switchToLogin(); 
          }, 200);
        } else {
          uni.showToast({
            title: res.message || '重置失败，请稍后再试',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        console.error('重置密码失败:', err);
        
        uni.showToast({
          title: '重置失败，请稍后再试',
          icon: 'none'
        });
      });
    },
    
    // 查看用户协议
    
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
  background-color: #F5F7FA;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
}

.logo-image {
  width: 200rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(32, 150, 243, 0.2);
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #212121;
  margin-bottom: 16rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: #757575;
}

.login-form {
  padding: 40rpx 60rpx;
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 30rpx 30rpx 0 0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.form-title {
  margin-bottom: 60rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #212121;
}

.login-type-switch {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40rpx;
  position: relative;
}

.switch-item {
  font-size: 30rpx;
  color: #757575;
  padding: 10rpx 30rpx;
  position: relative;
  transition: all 0.3s;
}

.switch-item.active {
  color: #2096F3;
  font-weight: bold;
}

.switch-item.active::after {
  content: '';
  position: absolute;
  bottom: -6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #2096F3;
  border-radius: 3rpx;
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
  color: #18191c;
}

.verification-input {
  width: 60%;
}

.verification-btn {
  font-size: 26rpx;
  color: #2096F3;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  background-color: rgba(32, 150, 243, 0.1);
}

.verification-btn.disabled {
  color: #c0c4cc;
  background-color: #f5f5f5;
}

.password-icon {
  padding: 0 10rpx;
}

.login-btn {
  height: 90rpx;
  background-color: #2096F3;
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
  box-shadow: 0 6rpx 20rpx rgba(32, 150, 243, 0.3);
  transition: all 0.3s;
}

.login-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(32, 150, 243, 0.3);
}

.login-btn.disabled {
  background-color: #cccccc;
  box-shadow: none;
}

.other-options {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.other-options text {
  font-size: 28rpx;
  color: #2096F3;
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
  color: #61666d;
}

.link {
  color: #2096F3;
}
</style>
