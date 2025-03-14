<template>
  <view class="user-edit-container">
    <u-navbar title="编辑个人信息" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="edit-form">
        <!-- 头像修改 -->
        <view class="avatar-section">
          <view class="section-title">头像</view>
          <view class="avatar-wrapper" @click="chooseAvatar">
            <image class="user-avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill">
            </image>
            <view class="edit-badge">
              <u-icon name="camera" size="20" color="#ffffff"></u-icon>
            </view>
          </view>
        </view>

        <!-- 个人信息表单 -->
        <view class="info-section">
          <view class="section-title">基本信息</view>
          <u-form :model="userInfo" ref="uForm">
            <u-form-item label="昵称" prop="nickname">
              <u-input v-model="userInfo.nickname" placeholder="请输入昵称" />
            </u-form-item>

            <u-form-item label="性别" prop="gender">
              <u-radio-group v-model="userInfo.gender">
                <u-radio label="男" name="男"></u-radio>
                <u-radio label="女" name="女" style="margin-left: 30rpx;"></u-radio>
              </u-radio-group>
            </u-form-item>

            <u-form-item label="年龄" prop="age">
              <u-number-box v-model="userInfo.age" :min="1" :max="120"></u-number-box>
            </u-form-item>

            <u-form-item :labelWidth="'auto'" label="身高(cm)" prop="height">
              <u-input v-model="userInfo.height" type="number" placeholder="请输入身高" />
            </u-form-item>

            <u-form-item :labelWidth="'auto'" label="体重(kg)" prop="weight">
              <u-input v-model="userInfo.weight" type="number" placeholder="请输入体重" />
            </u-form-item>
          </u-form>
        </view>

        <!-- 健康信息表单 -->
        <view class="health-section">
          <view class="section-title">健康信息</view>
          <u-form :model="userInfo" ref="healthForm">
            <u-form-item :labelWidth="'auto'" label="肌少症状态" prop="sarcopeniaStatus">
              <u-radio-group v-model="userInfo.sarcopeniaStatus">
                <u-radio label="无" name="none"></u-radio>
                <u-radio label="轻度" name="mild" style="margin-left: 20rpx;"></u-radio>
                <u-radio label="中度" name="moderate" style="margin-left: 20rpx;"></u-radio>
                <u-radio label="重度" name="severe" style="margin-left: 20rpx;"></u-radio>
              </u-radio-group>
            </u-form-item>

            <view class="vertical-form-item">
              <text class="form-label">慢性病史</text>
              <u-input v-model="userInfo.chronicDiseases" type="textarea" height="120" placeholder="请输入慢性病史，多个请用逗号分隔"
                border="surround" />
            </view>

            <view class="vertical-form-item">
              <text class="form-label">药物过敏史</text>
              <u-input v-model="userInfo.allergies" type="textarea" height="120" placeholder="请输入药物过敏史，无则填无"
                border="surround" />
            </view>
          </u-form>
        </view>
      </view>

      <view class="submit-btn" @click="saveUserInfo">保存修改</view>
    </view>

    <!-- 上传头像操作菜单 -->
    <u-action-sheet :list="avatarActions" v-model="showAvatarActions" @click="handleAvatarAction"></u-action-sheet>
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
        gender: '男',
        age: 65,
        height: '',
        weight: '',
        phone: '',
        sarcopeniaStatus: 'none',
        chronicDiseases: '',
        allergies: ''
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
      ]
    }
  },
  onLoad() {
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
        const userObj = JSON.parse(userInfo);

        // 合并数据
        Object.keys(this.userInfo).forEach(key => {
          if (userObj[key] !== undefined) {
            this.userInfo[key] = userObj[key];
          }
        });

        uni.hideLoading();
      } else {
        // 如果缓存中没有，则请求API获取
        uni.request({
          url: '/api/user/info',
          method: 'GET',
          success: (res) => {
            uni.hideLoading();

            if (res.data.code === 0 && res.data.data) {
              const userObj = res.data.data;

              // 合并数据
              Object.keys(this.userInfo).forEach(key => {
                if (userObj[key] !== undefined) {
                  this.userInfo[key] = userObj[key];
                }
              });
            }
          },
          fail: () => {
            uni.hideLoading();

            // 使用模拟数据
            const mockUser = {
              userId: '1001',
              nickname: '张三',
              avatar: '/static/images/avatar/user1.jpg',
              gender: '男',
              age: 65,
              height: 172,
              weight: 68,
              phone: '138****1234',
              sarcopeniaStatus: 'mild',
              chronicDiseases: '高血压',
              allergies: '无'
            };

            // 合并数据
            Object.keys(this.userInfo).forEach(key => {
              if (mockUser[key] !== undefined) {
                this.userInfo[key] = mockUser[key];
              }
            });
          }
        });
      }
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

      // 模拟上传过程
      setTimeout(() => {
        // 更新头像
        this.userInfo.avatar = filePath;

        uni.hideLoading();

        uni.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      }, 1000);
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
      if (!this.validateForm()) {
        return;
      }

      uni.showLoading({
        title: '保存中...'
      });

      // 调用保存API
      uni.request({
        url: '/api/user/update',
        method: 'POST',
        data: this.userInfo,
        success: (res) => {
          uni.hideLoading();

          if (res.data.code === 0) {
            this.updateLocalUserInfo();
            this.showSuccessAndGoBack();
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
            this.updateLocalUserInfo();
            this.showSuccessAndGoBack();
          }, 500);
        }
      });
    },

    // 验证表单
    validateForm() {
      // 昵称不能为空
      if (!this.userInfo.nickname.trim()) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        });
        return false;
      }

      // 身高、体重需要是数字且在合理范围内
      if (this.userInfo.height) {
        const height = parseFloat(this.userInfo.height);
        if (isNaN(height) || height < 50 || height > 250) {
          uni.showToast({
            title: '请输入合理的身高(50-250cm)',
            icon: 'none'
          });
          return false;
        }
      }

      if (this.userInfo.weight) {
        const weight = parseFloat(this.userInfo.weight);
        if (isNaN(weight) || weight < 20 || weight > 200) {
          uni.showToast({
            title: '请输入合理的体重(20-200kg)',
            icon: 'none'
          });
          return false;
        }
      }

      return true;
    },

    // 更新本地存储的用户信息
    updateLocalUserInfo() {
      // 从缓存中获取完整的用户信息
      const userInfoStr = uni.getStorageSync('userInfo');
      if (userInfoStr) {
        const userObj = JSON.parse(userInfoStr);

        // 更新修改的字段
        Object.keys(this.userInfo).forEach(key => {
          if (this.userInfo[key] !== undefined) {
            userObj[key] = this.userInfo[key];
          }
        });

        // 更新缓存
        uni.setStorageSync('userInfo', JSON.stringify(userObj));
      } else {
        // 直接存储当前用户信息
        uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
      }
    },

    // 显示成功提示并返回
    showSuccessAndGoBack() {
      uni.showToast({
        title: '保存成功',
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
.user-edit-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx 30rpx 30rpx;
}

.edit-form {
  margin-bottom: 60rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6rpx;
  width: 6rpx;
  height: 26rpx;
  background-color: #5FB878;
  border-radius: 3rpx;
}

.avatar-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
  position: relative;
}

.user-avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
}

.edit-badge {
  position: absolute;
  right: calc(50% - 75rpx);
  bottom: 20rpx;
  width: 48rpx;
  height: 48rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-section,
.health-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
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
  }.vertical-form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 15rpx;
  display: block;
}

/* 确保多行文本输入框有足够的内边距 */
.u-textarea-wrapper {
  padding: 10rpx;
}

/* 确保文本区域的高度正确显示 */
.u-textarea {
  min-height: 120rpx;
  width: 100%;
  padding: 10rpx;
  box-sizing: border-box;
}

/* 确保边框样式正确 */
.u-border-surround {
  border-radius: 8rpx;
  border: 1px solid #e4e7ed;
}
</style>
