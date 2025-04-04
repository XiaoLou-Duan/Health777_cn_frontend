<template>
  <view class="password">
    <uni-nav-bar title="修改密码" :border="false" left-icon="left" @clickLeft="goBack" status-bar></uni-nav-bar>
    <view class="password__content">
      <view class="password__form">
        <view class="password__phone-info">
          <text class="password__phone-label">当前手机号：</text>
          <text class="password__phone-value">{{userPhone}}</text>
        </view>
        <view class="password__form-item password__verification">
          <uni-easyinput
            v-model="code"
            type="number"
            placeholder="请输入手机验证码"
            maxlength="4"
            class="password__input"
          />
          <uni-button
            class="password__verify-btn"
            :disabled="countDown > 0"
            size="mini"
            :type="countDown > 0 ? 'default' : 'primary'"
            @click="sendVerificationCode"
          >
            {{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}
          </uni-button>
        </view>
        <view class="password__form-item">
          <uni-easyinput
            v-model="password"
            type="password"
            placeholder="请输入新密码"
            class="password__input"
          />
        </view>
        <view class="password__form-item">
          <uni-easyinput
            v-model="confirmPassword"
            type="password"
            placeholder="再次输入新密码"
            class="password__input"
          />
        </view>
        
        <view class="password__tips">
          <uni-icons type="info" size="24" color="#9E9E9E"></uni-icons>
          <text class="password__tips-text">密码长度为8-20位，必须包含数字和字母</text>
        </view>
      </view>
      
      <uni-button 
        type="primary" 
        class="password__submit" 
        :disabled="!isValid"
        @click="handleChangePassword"
      >确认修改</uni-button>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { validatePassword } from '@/utils/validation.js'

export default {
  data() {
    return {
      code: '',
      password: '',
      confirmPassword: '',
      countDown: 0,
      timer: null,
      phone: '', // 用户手机号
      rules: {
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: ['blur', 'change']
        }, {
          pattern: /^\d{4}$/,
          message: '验证码必须是4位数字',
          trigger: ['blur', 'change']
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'change']
        }, {
          validator: (rule, value, callback) => {
            return validatePassword(value);
          },
          message: '密码长度为8-20位，必须包含数字和字母',
          trigger: ['blur', 'change']
        }],
        confirmPassword: [{
          required: true,
          message: '请再次输入密码',
          trigger: ['blur', 'change']
        }, {
          validator: (rule, value, callback) => {
            return value === this.password;
          },
          message: '两次输入的密码不一致',
          trigger: ['blur', 'change']
        }]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getUserInfo']),
    // 获取用户手机号
    userPhone() {
      return this.getUserInfo && this.getUserInfo.mobile ? this.getUserInfo.mobile : '';
    },
    
    // 校验表单是否有效
    isValid() {
      // 所有字段不为空
      if (!this.code || !this.password || !this.confirmPassword) {
        return false;
      }
      
      // 验证码必须是4位数字
      if (!/^\d{4}$/.test(this.code)) {
        return false;
      }
      
      // 新密码需要符合规则
      if (!this.checkPasswordRule(this.password)) {
        return false;
      }
      
      // 两次输入的新密码必须一致
      if (this.password !== this.confirmPassword) {
        return false;
      }
      
      return true;
    }
  },
  onLoad() {
    // 初始化获取用户手机号
    if (this.getUserInfo && this.getUserInfo.mobile) {
      this.phone = this.getUserInfo.mobile;
    }
  },
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    ...mapActions('user', ['sendSmsCode','changePassword']),
    // 重命名方法，避免与Vuex action冲突
    
    // 发送验证码
    sendVerificationCode() {
      if (this.countDown > 0) {
        return;
      }
      
      uni.showLoading({
        title: '发送中...'
      });
      
      // 调用发送验证码API
      this.sendSmsCode({
        phone: this.phone || this.userPhone,
        scene: '3' // 修改密码场景
      }).then(res => {
        uni.hideLoading();
        
        if (res.success) {
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
        uni.hideLoading();
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        });
      });
    },

    // 检查密码规则
    checkPasswordRule(password) {
      return validatePassword(password);
    },
    
    // 修改密码
    handleChangePassword() {
      if (!this.isValid) {
        this.showValidationError();
        return;
      }
      
      uni.showLoading({
        title: '修改中...'
      });
      
      // 调用修改密码API
      this.$store.dispatch('user/changePassword', {
        password: this.password,
        code: this.code
      }).then(res => {
        uni.hideLoading();
        
        if (res.success) {
          uni.showToast({
            title: '密码修改成功',
            icon: 'success',
            duration: 1500
          });
          uni.navigateBack();
        } else {
          uni.showToast({
            title: res.message || '修改失败，请检查验证码是否正确',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
      });
    },
    
    // 显示验证错误
    showValidationError() {
      // 验证码错误
      if (!this.code) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      
      if (!/^\d{4}$/.test(this.code)) {
        uni.showToast({
          title: '验证码必须是4位数字',
          icon: 'none'
        });
        return;
      }
      
      // 密码错误
      if (!this.password) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.checkPasswordRule(this.password)) {
        uni.showToast({
          title: '密码长度为8-20位，必须包含数字和字母',
          icon: 'none'
        });
        return;
      }
      
      // 确认密码错误
      if (!this.confirmPassword) {
        uni.showToast({
          title: '请再次输入新密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss" scoped>
.password {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F7FA;
  
  &__content {
    flex: 1;
    padding: 30rpx;

  }
  
  &__form {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 40rpx 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  }
  
  &__phone-info {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    margin-bottom: 30rpx;
    border-bottom: 1px solid #F5F7FA;
  }
  
  &__phone-label {
    font-size: 28rpx;
    color: #757575;
    margin-right: 10rpx;
  }
  
  &__phone-value {
    font-size: 28rpx;
    color: #212121;
    font-weight: 500;
  }
  
  &__form-item {
    margin-bottom: 30rpx;
    position: relative;
  }
  
  &__verification {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  &__input {
    background-color: #F5F7FA;
    border-radius: 8rpx;
  }
  
  &__verify-btn {
    margin-left: 20rpx;
    flex-shrink: 0;
    width: auto;
  }
  
  &__tips {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    color: #9E9E9E;
    font-size: 24rpx;
  }
  
  &__tips-text {
    margin-left: 10rpx;
  }
  
  &__submit {
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 60rpx;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  }
}
</style>
