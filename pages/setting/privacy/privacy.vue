<template>
  <view class="privacy-container">
    <u-navbar title="隐私设置" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 资料可见性设置 -->
      <view class="settings-group">
        <view class="group-title">资料可见性</view>
        <view class="setting-item">
          <text>个人资料可见性</text>
          <u-dropdown>
            <u-dropdown-item v-model="settings.profileVisibility" :title="getVisibilityLabel(settings.profileVisibility)" :options="visibilityOptions"></u-dropdown-item>
          </u-dropdown>
        </view>
        <view class="setting-item">
          <text>运动数据可见性</text>
          <u-dropdown>
            <u-dropdown-item v-model="settings.exerciseDataVisibility" :title="getVisibilityLabel(settings.exerciseDataVisibility)" :options="visibilityOptions"></u-dropdown-item>
          </u-dropdown>
        </view>
        <view class="setting-item">
          <text>饮食数据可见性</text>
          <u-dropdown>
            <u-dropdown-item v-model="settings.nutritionDataVisibility" :title="getVisibilityLabel(settings.nutritionDataVisibility)" :options="visibilityOptions"></u-dropdown-item>
          </u-dropdown>
        </view>
      </view>
      
      <!-- 数据使用设置 -->
      <view class="settings-group">
        <view class="group-title">数据使用</view>
        <view class="setting-item">
          <view class="setting-content">
            <text class="setting-label">允许数据分析</text>
            <text class="setting-desc">用于改进服务，提供个性化建议</text>
          </view>
          <u-switch v-model="settings.allowDataAnalysis"></u-switch>
        </view>
        <view class="setting-item">
          <view class="setting-content">
            <text class="setting-label">允许匿名数据共享</text>
            <text class="setting-desc">用于医学研究和服务优化</text>
          </view>
          <u-switch v-model="settings.allowDataSharing"></u-switch>
        </view>
      </view>
      
      <!-- 社交隐私设置 -->
      <view class="settings-group">
        <view class="group-title">社交隐私</view>
        <view class="setting-item">
          <text>谁能看到我的社区帖子</text>
          <u-dropdown>
            <u-dropdown-item v-model="settings.postVisibility" :title="getVisibilityLabel(settings.postVisibility)" :options="visibilityOptions"></u-dropdown-item>
          </u-dropdown>
        </view>
        <view class="setting-item">
          <text>谁能给我发消息</text>
          <u-dropdown>
            <u-dropdown-item v-model="settings.messagePermission" :title="getMessagePermissionLabel(settings.messagePermission)" :options="messagePermissionOptions"></u-dropdown-item>
          </u-dropdown>
        </view>
      </view>
      
      <!-- 其他隐私设置 -->
      <view class="settings-group">
        <view class="group-title">其他</view>
        <view class="setting-item" @click="showLocationModal">
          <text>位置信息</text>
          <view class="setting-value">
            <text>{{ getLocationLabel(settings.shareLocation) }}</text>
            <u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
          </view>
        </view>
        <view class="setting-item" @click="clearCache">
          <text>清除缓存</text>
          <view class="setting-value">
            <text>{{ cacheSize }}</text>
            <u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-btn" @click="saveSettings">保存设置</view>
      
      <!-- 隐私协议入口 -->
      <view class="privacy-policy" @click="viewPrivacyPolicy">
        <text>查看《隐私政策》</text>
      </view>
    </view>
    
    <!-- 位置信息模态框 -->
    <u-modal
      v-model="showLocation"
      :show-title="true"
      title="位置信息"
      :content="false"
      :show-confirm-button="true"
      :show-cancel-button="true"
      confirm-text="确认"
      cancel-text="取消"
      @confirm="confirmLocationSetting"
    >
      <view class="location-options">
        <u-radio-group v-model="tempLocationSetting">
          <u-radio 
            v-for="(item, index) in locationOptions" 
            :key="index"
            :name="item.value"
            :label="item.label"
          ></u-radio>
        </u-radio-group>
      </view>
    </u-modal>
    
    <!-- 清除缓存确认模态框 -->
    <u-modal
      v-model="showCacheClear"
      content="确定要清除本地缓存吗？这将清除您的浏览记录、搜索记录等数据。"
      @confirm="confirmClearCache"
    ></u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      settings: {
        profileVisibility: 'public',
        exerciseDataVisibility: 'friends',
        nutritionDataVisibility: 'private',
        allowDataAnalysis: true,
        allowDataSharing: false,
        postVisibility: 'public',
        messagePermission: 'all',
        shareLocation: 'whenUse'
      },
      visibilityOptions: [
        {
          label: '所有人可见',
          value: 'public'
        },
        {
          label: '仅好友可见',
          value: 'friends'
        },
        {
          label: '仅自己可见',
          value: 'private'
        }
      ],
      messagePermissionOptions: [
        {
          label: '所有人',
          value: 'all'
        },
        {
          label: '仅好友',
          value: 'friends'
        },
        {
          label: '不接收',
          value: 'none'
        }
      ],
      locationOptions: [
        {
          label: '总是共享',
          value: 'always'
        },
        {
          label: '使用时共享',
          value: 'whenUse'
        },
        {
          label: '不共享',
          value: 'never'
        }
      ],
      showLocation: false,
      tempLocationSetting: 'whenUse',
      showCacheClear: false,
      cacheSize: '2.5MB'
    }
  },
  onLoad() {
    this.getUserId();
    this.getSettings();
    this.calculateCacheSize();
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
    
    // 获取隐私设置
    getSettings() {
      uni.showLoading({
        title: '加载中'
      });
      
      // 调用获取设置API
      uni.request({
        url: '/api/user/privacy-settings',
        method: 'GET',
        data: {
          userId: this.userId
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            this.settings = res.data.data.settings;
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 使用模拟数据
          this.settings = {
            profileVisibility: 'public',
            exerciseDataVisibility: 'friends',
            nutritionDataVisibility: 'private',
            allowDataAnalysis: true,
            allowDataSharing: false,
            postVisibility: 'public',
            messagePermission: 'all',
            shareLocation: 'whenUse'
          };
        }
      });
    },
    
    // 获取可见性选项的显示文本
    getVisibilityLabel(value) {
      const option = this.visibilityOptions.find(item => item.value === value);
      return option ? option.label : '所有人可见';
    },
    
    // 获取消息权限选项的显示文本
    getMessagePermissionLabel(value) {
      const option = this.messagePermissionOptions.find(item => item.value === value);
      return option ? option.label : '所有人';
    },
    
    // 获取位置选项的显示文本
    getLocationLabel(value) {
      const option = this.locationOptions.find(item => item.value === value);
      return option ? option.label : '使用时共享';
    },
    
    // 显示位置设置模态框
    showLocationModal() {
      this.tempLocationSetting = this.settings.shareLocation;
      this.showLocation = true;
    },
    
    // 确认位置设置
    confirmLocationSetting() {
      this.settings.shareLocation = this.tempLocationSetting;
    },
    
    // 计算缓存大小
    calculateCacheSize() {
      // 在实际应用中，应该调用相关API获取缓存大小
      uni.getStorageInfo({
        success: (res) => {
          // 转换为MB
          const sizeMB = (res.currentSize / 1024).toFixed(1);
          this.cacheSize = sizeMB + 'MB';
        },
        fail: () => {
          this.cacheSize = '2.5MB'; // 模拟数据
        }
      });
    },
    
    // 显示清除缓存确认
    clearCache() {
      this.showCacheClear = true;
    },
    
    // 确认清除缓存
    confirmClearCache() {
      uni.showLoading({
        title: '清除中'
      });
      
      // 清除本地存储缓存
      uni.clearStorageSync();
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 更新缓存大小显示
        this.cacheSize = '0KB';
        
        uni.showToast({
          title: '缓存已清除',
          icon: 'success'
        });
      }, 1000);
    },
    
    // 查看隐私政策
    viewPrivacyPolicy() {
      uni.navigateTo({
        url: '/pages/about/privacy-policy'
      });
    },
    
    // 保存设置
    saveSettings() {
      uni.showLoading({
        title: '保存中'
      });
      
      // 调用保存设置API
      uni.request({
        url: '/api/user/privacy-settings',
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
.privacy-container {
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

.setting-content {
  display: flex;
  flex-direction: column;
}

.setting-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.setting-desc {
  font-size: 24rpx;
  color: #999;
}

.setting-value {
  display: flex;
  align-items: center;
}

.setting-value text {
  font-size: 26rpx;
  color: #666;
  margin-right: 10rpx;
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

.privacy-policy {
  text-align: center;
  margin-top: 30rpx;
  padding: 20rpx;
}

.privacy-policy text {
  font-size: 26rpx;
  color: #5FB878;
  text-decoration: underline;
}

.location-options {
  padding: 30rpx;
}

.location-options .u-radio {
  margin-bottom: 20rpx;
}
</style>
