<template>
  <view class="health-card">
    <view class="card-header">
      <text class="card-title">健康概览</text>
      <text class="today-date">{{todayDate}}</text>
    </view>
    <view class="health-data-grid">
      <view class="health-data-item" @click="navigateTo('/packageNutrition/pages/protein-analysis/protein-analysis')">
        <view class="icon-wrapper protein">
          <svg class="health-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </view>
        <view class="data-content">
          <view class="data-value">{{ healthData.proteinIntake }}<text class="unit">g</text></view>
          <view class="data-label">今日蛋白质</view>
        </view>
      </view>
      <view class="health-data-item" @click="navigateTo('/packageExercise/pages/exercise-stats/exercise-stats')">
        <view class="icon-wrapper exercise">
          <svg class="health-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 7V5M18 19V17M7 18H5M19 18H17M7 6H5M12 3V5M12 19V21M3 12H5M19 12H21" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </view>
        <view class="data-content">
          <view class="data-value">{{ healthData.exerciseMinutes }}<text class="unit">分钟</text></view>
          <view class="data-label">今日运动</view>
        </view>
      </view>
      <view class="health-data-item">
        <view class="icon-wrapper muscle">
          <svg class="health-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L8 4M18 18L20 20M4 8H2M22 16H20M9 2L8 4M15 22L14 20M22 9L20 8M2 15L4 14" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
          </svg>
        </view>
        <view class="data-content">
          <view class="data-value">{{ healthData.muscleScore }}<text class="unit">分</text></view>
          <view class="data-label">肌肉健康</view>
        </view>
      </view>
      <view class="health-data-item">
        <view class="icon-wrapper steps">
          <svg class="health-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 15L12 20L17 15M7 9L12 4L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </view>
        <view class="data-content">
          <view class="data-value">{{ healthData.steps }}<text class="unit">步</text></view>
          <view class="data-label">今日步数</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HealthOverview',
  props: {
    healthData: {
      type: Object,
      default: () => ({
        proteinIntake: 0,
        exerciseMinutes: 0,
        muscleScore: 0,
        steps: 0
      })
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      todayDate: this.date || this.formatDate(new Date())
    }
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    }
  }
}
</script>

<style lang="scss">
@import './health-overview.scss';
</style>
