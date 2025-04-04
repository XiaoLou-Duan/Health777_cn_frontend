<template>
  <view class="user-edit">
    <uni-nav-bar title="编辑个人信息" :border="false" left-icon="left" @clickLeft="goBack" status-bar></uni-nav-bar>
    <view class="user-edit__content">
      <view class="user-edit__form">
        <!-- 头像修改 -->
        <view class="user-edit__avatar">
          <view class="user-edit__section-title">头像</view>
          <view class="user-edit__avatar-wrapper" @click="chooseAvatar">
            <image class="user-edit__avatar-image" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill">
            </image>
            <view class="user-edit__avatar-badge">
              <uni-icons type="camera" size="20" color="#FFFFFF"></uni-icons>
            </view>
          </view>
        </view>

        <!-- 个人信息表单 -->
        <view class="user-edit__info">
          <view class="user-edit__section-title">基本信息</view>
          <uni-forms ref="uForm" :model="userInfo" :rules="rules" label-position="left" label-width="auto">
            <uni-forms-item label="昵称" name="nickname" required>
              <uni-easyinput v-model="userInfo.nickname" placeholder="请输入昵称" />
            </uni-forms-item>

            <uni-forms-item label="性别" name="sex" required>
              <uni-data-checkbox v-model="userInfo.sex" :localdata="[{text: '男', value: 1}, {text: '女', value: 2}]" />
            </uni-forms-item>

            <!-- 手机号显示 -->
            <uni-forms-item label="手机号" name="mobile">
              <view class="user-edit__phone-container">
                <text class="user-edit__phone">{{ maskPhone(userInfo.mobile) }}</text>
                <uni-button type="primary" size="mini" @click="goToChangeMobile" class="user-edit__btn-change">修改</uni-button>
              </view>
            </uni-forms-item>
            
            <!-- 修改密码 -->
            <uni-forms-item label="密码" name="password">
              <view class="user-edit__phone-container">
                <text class="user-edit__phone">******</text>
                <uni-button type="primary" size="mini" @click="goToChangePassword" class="user-edit__btn-change">修改</uni-button>
              </view>
            </uni-forms-item>
          </uni-forms>
        </view>
      </view>

      <uni-button type="primary" class="user-edit__submit" @click="saveUserInfo" :loading="loading">保存修改</uni-button>
    </view>

    <!-- 上传头像操作菜单 -->
    <!-- 使用uni-ui的操作表 -->
    <uni-popup ref="avatarActionPopup" type="bottom">
      <uni-list>
        <uni-list-item v-for="(item, index) in avatarActions" :key="index"
          :title="item.name" @click="handleAvatarAction(item, index)" />
        <uni-list-item title="取消" @click="showAvatarActions = false" />
      </uni-list>
    </uni-popup>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { maskPhoneNumber } from '@/utils/validation.js'

export default {
  data() {
    return {
      loading: false,
      userInfo: {
        id: '',
        nickname: '',
        avatar: '',
        sex: 1,
        mobile: ''
      },
      showAvatarActions: false,
      avatarActions: [
        {
          name: '拍照',
          color: '#333333'
        },
        {
          name: '从相册选择',
          color: '#333333'
        }
      ],
      rules: {
        nickname: [{
          required: true,
          message: '请输入昵称',
          trigger: ['blur', 'change']
        }]
      }
    }
  },
  computed: {
    ...mapState('user', ['userProfile'])
  },
  onLoad() {
    this.fetchUserInfo();
  },
  onReady() {
		// 原生表单不需要设置规则
	},
  methods: {
    ...mapActions('user', ['getUserInfo', 'updateUserInfo']),
    
    // 处理性别选择变化
    handleSexChange(e) {
      this.userInfo.sex = parseInt(e.detail.value);
    },
    
    // 获取用户信息
    fetchUserInfo() {
      uni.showLoading({
        title: '加载中'
      });

      // 通过Vuex获取用户信息
      this.getUserInfo().then(res => {
        uni.hideLoading();
        if (res.success && res.data) {
          // 更新用户信息
          this.userInfo = {
            id: res.data.id,
            nickname: res.data.nickname,
            avatar: res.data.avatar,
            sex: res.data.sex || 1,
            mobile: res.data.mobile
          };
        }
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      });
    },
    
    // 手机号脱敏处理
    maskPhone(phone) {
      return maskPhoneNumber(phone);
    },
    
    // 跳转到修改手机号页面
    goToChangeMobile() {
      uni.navigateTo({
        url: '/pages/user/phone/phone'
      });
    },
    
    // 跳转到修改密码页面
    goToChangePassword() {
      uni.navigateTo({
        url: '/pages/user/password/password'
      });
    },

    // 选择头像
    chooseAvatar() {
      this.$refs.avatarActionPopup.open();
      this.showAvatarActions = true;
    },

    // 处理头像选择操作
    handleAvatarAction(item, index) {
      // 关闭操作菜单
      this.$refs.avatarActionPopup.close();
      this.showAvatarActions = false;
      
      if (index === 0) {
        // 拍照
        this.takePhoto();
      } else if (index === 1) {
        // 从相册选择
        this.chooseFromAlbum();
      }
    },

    // 拍照
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0]);
        }
      });
    },

    // 从相册选择
    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0]);
        }
      });
    },

    // 上传头像
    uploadAvatar(filePath) {
      uni.showLoading({
        title: '上传中...'
      });

      // 调用上传服务
      this.$store.dispatch('user/uploadAvatar', {
        filePath: filePath
      }).then(res => {
        uni.hideLoading();
        if (res.success && res.data) {
          // 更新头像
          this.userInfo.avatar = res.data.url;
          
          uni.showToast({
            title: '头像上传成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.message || '上传失败，请重试',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        console.error('上传头像失败:', err);
        
        uni.showToast({
          title: err.message || '上传失败，请重试',
          icon: 'none'
        });
      });
    },




    // 保存用户信息
    saveUserInfo() {
      if (this.loading) return;
      this.loading = true;
      
      this.$refs.uForm.validate().then(valid => {
        this.submitUserInfo();
      }).catch(errors => {
        this.loading = false;
        uni.showToast({
          title: '请完善表单信息',
          icon: 'none'
        });
      });
    },
    
    // 提交用户信息
    submitUserInfo() {
      uni.showLoading({
        title: '保存中...'
      });
      
      // 调用更新用户信息API
      this.$store.dispatch('user/updateUserInfo', this.userInfo).then(res => {
        uni.hideLoading();
        this.loading = false;
        
        if (res && res.success) {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          });
          uni.navigateBack();
        } else {
          uni.showToast({
            title: (res && res.message) || '保存失败，请稍后再试',
            icon: 'none'
          });
        }
      }).catch(err => {
        uni.hideLoading();
        this.loading = false;
        uni.navigateBack();
      });
    },

    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss" scoped>
.user-edit {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F5F7FA;
  .u-button {
    width: auto;
  }
  &__content {
    flex: 1;
    padding: 30rpx; 
  }
  
  &__form {
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
    margin-bottom: 40rpx;
  }
  
  &__avatar {
    padding: 30rpx;
    border-bottom: 1px solid #EEEEEE;
  }
  
  &__section-title {
    font-size: 28rpx;
    color: #212121;
    font-weight: 500;
    margin-bottom: 20rpx;
  }
  
  &__avatar-wrapper {
    position: relative;
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
  }
  
  &__avatar-image {
    width: 100%;
    height: 100%;
  }
  
  &__avatar-badge {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50rpx;
    height: 50rpx;
    background-color: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__info {
    padding: 30rpx;
  }
  
  &__phone {
    color: #757575;
  }
  
  &__btn-change {
    margin-left: 20rpx;
  }
  
  &__submit {
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 60rpx;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  }
}
</style>
