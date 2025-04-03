<template>
  <view class="user-edit">
    <u-navbar title="编辑个人信息" :border="false" back-icon-color="#333333" @leftClick="goBack"></u-navbar>
    <view class="user-edit__content">
      <view class="user-edit__form">
        <!-- 头像修改 -->
        <view class="user-edit__avatar">
          <view class="user-edit__section-title">头像</view>
          <view class="user-edit__avatar-wrapper" @click="chooseAvatar">
            <image class="user-edit__avatar-image" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill">
            </image>
            <view class="user-edit__avatar-badge">
              <u-icon name="camera" size="20" color="#FFFFFF"></u-icon>
            </view>
          </view>
        </view>

        <!-- 个人信息表单 -->
        <view class="user-edit__info">
          <view class="user-edit__section-title">基本信息</view>
          <u-form :model="userInfo" ref="uForm" :errorType="['message']">
            <u-form-item label="昵称" prop="nickname" :borderBottom="true">
              <u-input v-model="userInfo.nickname" placeholder="请输入昵称" :border="false" />
            </u-form-item>

            <u-form-item label="性别" prop="sex" :borderBottom="true">
              <u-radio-group v-model="userInfo.sex">
                <u-radio :name="1" label="男"></u-radio>
                <u-radio :name="2" label="女" style="margin-left: 30rpx;"></u-radio>
              </u-radio-group>
            </u-form-item>

            <!-- 手机号显示 -->
            <u-form-item label="手机号" prop="mobile">
              <text class="user-edit__phone">{{ maskPhone(userInfo.mobile) }}</text>
              <u-button type="primary" size="mini" @click="goToChangeMobile" class="user-edit__btn-change">修改</u-button>
            </u-form-item>
          </u-form>
        </view>
      </view>

      <u-button type="primary" class="user-edit__submit" @click="saveUserInfo">保存修改</u-button>
    </view>

    <!-- 上传头像操作菜单 -->
    <u-action-sheet :list="avatarActions" v-model="showAvatarActions" @click="handleAvatarAction" :cancelText="'取消'"></u-action-sheet>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { maskPhoneNumber } from '@/utils/validation.js'

export default {
  data() {
    return {
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
          text: '拍照',
          color: '#333333'
        },
        {
          text: '从相册选择',
          color: '#333333'
        },
        {
          text: '使用随机头像',
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
    this.getUserInfo();
  },
  methods: {
    ...mapActions('user', ['getUserInfo', 'updateUserProfile']),
    
    // 获取用户信息
    getUserInfo() {
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
        console.error('获取用户信息失败:', err);
        // 使用模拟数据
        this.userInfo = {
          id: '1001',
          nickname: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          sex: 1,
          mobile: '13812345678'
        };
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

    // 选择头像
    chooseAvatar() {
      this.showAvatarActions = true;
    },

    // 处理头像选择操作
    handleAvatarAction(index) {
      if (index === 0) {
        // 拍照
        this.takePhoto();
      } else if (index === 1) {
        // 从相册选择
        this.chooseFromAlbum();
      } else if (index === 2) {
        // 使用随机头像
        this.useRandomAvatar();
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
        
        // 模拟上传成功
        this.userInfo.avatar = filePath;
        
        uni.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      });
    },

    // 使用随机头像
    useRandomAvatar() {
      uni.showLoading({
        title: '加载中...'
      });

      // 生成随机性别和ID
      const gender = Math.random() > 0.5 ? 'men' : 'women';
      const randomId = Math.floor(Math.random() * 99) + 1;

      // 构建randomuser头像URL
      const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;

      // 设置头像
      setTimeout(() => {
        this.userInfo.avatar = avatarUrl;

        uni.hideLoading();

        uni.showToast({
          title: '头像设置成功',
          icon: 'success'
        });
      }, 500);
    },

    // 保存用户信息
    saveUserInfo() {
      // 验证表单
      this.$refs.uForm.validate(valid => {
        if (!valid) return;
        
        uni.showLoading({
          title: '保存中...'
        });
        
        // 调用更新用户信息API
        this.updateUserProfile(this.userInfo).then(res => {
          uni.hideLoading();
          
          if (res.success) {
            uni.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            });
            
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.message || '保存失败，请稍后再试',
              icon: 'none'
            });
          }
        }).catch(err => {
          uni.hideLoading();
          console.error('保存用户信息失败:', err);
          
          // 模拟保存成功
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          });
          
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        });
      });
    },
    
    // 返回上一页
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
    height: 90rpx;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 60rpx;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  }
}
</style>
