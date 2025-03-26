<template>
  <view class="user-profile">
    <view class="profile-header">
      <text class="profile-title">用户健康档案</text>
    </view>
    
    <view class="profile-content">
      <view class="profile-row">
        <view class="profile-item">
          <text class="item-label">年龄</text>
          <text class="item-value">{{ userProfile.age }}岁</text>
        </view>
        <view class="profile-item">
          <text class="item-label">性别</text>
          <text class="item-value">{{ userProfile.gender }}</text>
        </view>
      </view>
      
      <view class="profile-row">
        <view class="profile-item">
          <text class="item-label">身高</text>
          <text class="item-value">{{ userProfile.height }}cm</text>
        </view>
        <view class="profile-item">
          <text class="item-label">体重</text>
          <text class="item-value">{{ userProfile.weight }}kg</text>
        </view>
      </view>
      
      <view class="profile-row">
        <view class="profile-item">
          <text class="item-label">活动水平</text>
          <text class="item-value">{{ userProfile.activity }}</text>
        </view>
        <view class="profile-item">
          <text class="item-label">健康目标</text>
          <text class="item-value">{{ userProfile.goal }}</text>
        </view>
      </view>
      
      <view class="profile-row">
        <view class="profile-item">
          <text class="item-label">BMI指数</text>
          <text class="item-value" :class="getBmiClass(userProfile.bmi)">{{ userProfile.bmi }}</text>
        </view>
        <view class="profile-item">
          <text class="item-label">BMI状态</text>
          <text class="item-value" :class="getBmiClass(userProfile.bmi)">{{ getBmiStatus(userProfile.bmi) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  },
  methods: {
    getBmiClass(bmi) {
      if (!bmi) return '';
      if (bmi < 18.5) return 'bmi-low';
      if (bmi >= 18.5 && bmi < 24) return 'bmi-normal';
      if (bmi >= 24 && bmi < 28) return 'bmi-overweight';
      if (bmi >= 28) return 'bmi-obese';
      return '';
    },
    getBmiStatus(bmi) {
      if (!bmi) return '未知';
      if (bmi < 18.5) return '偏瘦';
      if (bmi >= 18.5 && bmi < 24) return '正常';
      if (bmi >= 24 && bmi < 28) return '超重';
      if (bmi >= 28) return '肥胖';
      return '未知';
    }
  }
}
</script>

<style lang="scss">
@import "./user-profile.scss";
</style>
