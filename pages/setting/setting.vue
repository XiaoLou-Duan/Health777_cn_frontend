<template>
  <view class="setting-container">
    <u-navbar title="设置" :border="false" back-icon-color="#5FB878" background-color="#f6f9fc"></u-navbar>
    <view class="content-wrapper">
      <!-- 用户信息区 -->
      <view class="user-section">
        <view class="user-info" @click="goToUserProfile">
          <image class="user-avatar" :src="userInfo.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'"
            mode="aspectFill"></image>
          <view class="user-meta">
            <text class="user-name">{{ userInfo.nickname || '未登录' }}</text>
            <text class="user-id">{{ userInfo.userId ? 'ID: ' + userInfo.userId : '点击登录账户' }}</text>
          </view>
          <u-icon name="arrow-right" color="#a8b2c1" size="28"></u-icon>
        </view>
      </view>

      <!-- 账户设置区 -->
      <view class="section-title">账户设置</view>
      <view class="settings-group">
        <u-cell-group>
          <u-cell title="个人信息编辑" icon="account" icon-size="24" is-link @click="goToUserEdit"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="修改密码" icon="lock" icon-size="24" is-link @click="goToPasswordChange"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="修改手机号" icon="phone" icon-size="24" is-link @click="goToPhoneChange"
            icon-style="color: #5FB878"></u-cell>
        </u-cell-group>
      </view>

      <!-- 应用设置区 -->
      <view class="section-title">健康设置</view>
      <view class="settings-group">
        <u-cell-group>
          <u-cell title="健康提醒" icon="bell" icon-size="24" is-link @click="goToReminderSettings"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="消息通知" icon="notification" icon-size="24" is-link @click="goToNotificationSettings"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="健康数据隐私" icon="shield" icon-size="24" is-link @click="goToPrivacySettings"
            icon-style="color: #5FB878"></u-cell>
        </u-cell-group>
      </view>

      <!-- 其他设置区 -->
      <view class="section-title">关于</view>
      <view class="settings-group">
        <u-cell-group>
          <u-cell title="关于我们" icon="info-circle" icon-size="24" is-link @click="goToAboutUs"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="意见反馈" icon="file-text" icon-size="24" is-link @click="goToFeedback"
            icon-style="color: #5FB878"></u-cell>
          <u-cell title="检查更新" icon="reload" icon-size="24" is-link @click="checkUpdate"
            icon-style="color: #5FB878"></u-cell>
        </u-cell-group>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-btn" v-if="userInfo.userId" @click="showLogoutConfirm">
        退出登录
      </view>
    </view>

    <!-- 退出确认弹窗 -->
    <u-modal v-model="showLogout" :show-cancel-button="true" content="确定要退出登录吗？" confirm-color="#5FB878"
      @confirm="logout"></u-modal>
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
        phone: ''
      },
      showLogout: false
    }
  },
  onShow() {
    // 每次页面显示时，都重新获取用户信息，以更新可能的变化
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      // 从缓存中获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      } else {
        // 如果缓存中没有，则请求API获取
        uni.request({
          url: '/api/user/info',
          method: 'GET',
          success: (res) => {
            if (res.data.code === 0 && res.data.data) {
              this.userInfo = res.data.data;
              // 存储到缓存中
              uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
            }
          },
          fail: () => {
            // 使用模拟数据
            this.userInfo = {
              userId: '1001',
              nickname: '张三',
              avatar: '/static/images/avatar/user1.jpg',
              gender: '男',
              age: 65,
              phone: '138****1234'
            };
            
            // 存储到缓存中
            uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
          }
        });
      }
    },
    
    // 跳转到用户个人资料页
    goToUserProfile() {
      if (!this.userInfo.userId) {
        // 未登录，跳转到登录页
        uni.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/user/profile/profile'
      });
    },
    
    // 跳转到个人信息编辑页
    goToUserEdit() {
      if (!this.userInfo.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/user/edit/edit'
      });
    },
    
    // 跳转到密码修改页
    goToPasswordChange() {
      if (!this.userInfo.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/user/password/password'
      });
    },
    
    // 跳转到手机号修改页
    goToPhoneChange() {
      if (!this.userInfo.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/user/phone/phone'
      });
    },
    
    // 跳转到提醒设置页
    goToReminderSettings() {
      uni.navigateTo({
        url: '/pages/reminder/reminder-settings'
      });
    },
    
    // 跳转到消息通知设置页
    goToNotificationSettings() {
      uni.navigateTo({
        url: '/pages/setting/notification/notification'
      });
    },
    
    // 跳转到隐私设置页
    goToPrivacySettings() {
      uni.navigateTo({
        url: '/pages/setting/privacy/privacy'
      });
    },
    
    // 跳转到关于我们页
    goToAboutUs() {
      uni.navigateTo({
        url: '/pages/about/about'
      });
    },
    
    // 跳转到意见反馈页
    goToFeedback() {
      uni.navigateTo({
        url: '/pages/feedback/feedback'
      });
    },
    
    // 检查更新
    checkUpdate() {
      uni.showLoading({
        title: '检查中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '已是最新版本',
          icon: 'success'
        });
      }, 1000);
    },
    
    // 显示退出登录确认
    showLogoutConfirm() {
      this.showLogout = true;
    },
    
    // 退出登录
    logout() {
      uni.showLoading({
        title: '退出中...'
      });
      
      // 调用退出登录API
      uni.request({
        url: '/api/user/logout',
        method: 'POST',
        success: () => {
          // 清除本地存储的用户信息
          uni.removeStorageSync('userInfo');
          uni.removeStorageSync('token');
          
          uni.hideLoading();
          
          // 提示退出成功
          uni.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          // 重置用户信息
          this.userInfo = {
            userId: '',
            nickname: '',
            avatar: '',
            gender: '',
            age: '',
            phone: ''
          };
        },
        fail: () => {
          // 模拟退出成功
          // 清除本地存储的用户信息
          uni.removeStorageSync('userInfo');
          uni.removeStorageSync('token');
          
          uni.hideLoading();
          
          // 提示退出成功
          uni.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          // 重置用户信息
          this.userInfo = {
            userId: '',
            nickname: '',
            avatar: '',
            gender: '',
            age: '',
            phone: ''
          };
        }
      });
    }
  }
}
</script>

<style>
@import './setting.scss';
</style>
