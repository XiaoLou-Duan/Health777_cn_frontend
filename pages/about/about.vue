<template>
  <view class="about-container">
    <u-navbar title="关于我们" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 应用信息区 -->
      <view class="app-info">
        <image class="app-logo" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="app-name">肌少症健康管理</text>
        <text class="app-version">版本 1.0.0</text>
      </view>
      
      <!-- 功能介绍区 -->
      <view class="feature-section">
        <view class="section-title">主要功能</view>
        <view class="feature-list">
          <view class="feature-item">
            <u-icon name="photo" color="#5FB878" size="44"></u-icon>
            <text>AI食物识别</text>
          </view>
          <view class="feature-item">
            <u-icon name="play-right" color="#5FB878" size="44"></u-icon>
            <text>运动检测</text>
          </view>
          <view class="feature-item">
            <u-icon name="bell" color="#5FB878" size="44"></u-icon>
            <text>智能提醒</text>
          </view>
          <view class="feature-item">
            <u-icon name="chat" color="#5FB878" size="44"></u-icon>
            <text>社区互动</text>
          </view>
        </view>
      </view>
      
      <!-- 团队介绍区 -->
      <view class="team-section">
        <view class="section-title">团队介绍</view>
        <view class="team-info">
          <text class="team-desc">我们是一支致力于为老年人提供健康管理解决方案的团队。由医疗专家、营养师、健康管理师和技术人员组成，旨在通过技术手段帮助老年人科学管理健康，特别是针对肌少症的预防和治疗提供专业指导。</text>
        </view>
      </view>
      
      <!-- 联系方式区 -->
      <view class="contact-section">
        <view class="section-title">联系我们</view>
        <view class="contact-list">
          <view class="contact-item" @click="copyText('support@hearthgood.com')">
            <u-icon name="email" color="#666" size="32"></u-icon>
            <text>support@hearthgood.com</text>
          </view>
          <view class="contact-item" @click="copyText('400-123-4567')">
            <u-icon name="phone" color="#666" size="32"></u-icon>
            <text>400-123-4567</text>
          </view>
          <view class="contact-item" @click="copyText('北京市海淀区中关村大街1号')">
            <u-icon name="map" color="#666" size="32"></u-icon>
            <text>北京市海淀区中关村大街1号</text>
          </view>
        </view>
      </view>
      
      <!-- 底部链接区 -->
      <view class="footer-links">
        <view class="link-item" @click="navigateTo('/pages/about/privacy-policy')">
          <text>隐私政策</text>
        </view>
        <view class="link-item" @click="navigateTo('/pages/about/user-agreement')">
          <text>用户协议</text>
        </view>
        <view class="link-item" @click="checkUpdate">
          <text>检查更新</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 复制文本
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    },
    
    // 页面导航
    navigateTo(url) {
      uni.navigateTo({
        url: url
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
    }
  }
}
</script>

<style>
.about-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 30rpx;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  padding: 50rpx 0;
}

.app-logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.app-version {
  font-size: 28rpx;
  color: #999;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 6rpx;
  height: 30rpx;
  background-color: #5FB878;
  border-radius: 3rpx;
}

.feature-section,
.team-section,
.contact-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
}

.feature-item {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.feature-item text {
  font-size: 28rpx;
  color: #666;
  margin-top: 16rpx;
}

.team-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}

.contact-list {
  display: flex;
  flex-direction: column;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.contact-item text {
  font-size: 28rpx;
  color: #666;
  margin-left: 20rpx;
}

.footer-links {
  display: flex;
  justify-content: space-around;
  margin-top: 60rpx;
  padding: 30rpx 0;
}

.link-item {
  font-size: 28rpx;
  color: #5FB878;
}
</style>
