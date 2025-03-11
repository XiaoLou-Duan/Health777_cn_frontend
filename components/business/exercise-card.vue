<template>
  <view class="exercise-card" :class="{'is-elderly': isElderly}" @click="handleCardClick">
    <view class="exercise-image-container">
      <image :src="exercise.image || defaultImage" mode="aspectFill" class="exercise-image"></image>
      <view v-if="exercise.recommended" class="recommended-tag">推荐</view>
      <view v-if="exercise.level" class="level-tag" :class="`level-${exercise.level}`">
        {{ getLevelText(exercise.level) }}
      </view>
    </view>
    <view class="exercise-info">
      <view class="exercise-name-row">
        <text class="exercise-name">{{ exercise.name }}</text>
        <view v-if="exercise.favorite" class="favorite-icon">
          <u-icon name="star-fill" color="#ff9800" size="40"></u-icon>
        </view>
      </view>
      <view class="exercise-duration">
        <text class="label">时长：</text>
        <text class="value">{{ exercise.duration }}分钟</text>
      </view>
      <view class="exercise-calorie">
        <text class="label">消耗：</text>
        <text class="value">{{ exercise.calorie }}kcal</text>
      </view>
      <view class="exercise-target">
        <text class="label">目标：</text>
        <text class="value">{{ exercise.target }}</text>
      </view>
      <view v-if="showActions" class="exercise-actions">
      
        <u-button 
          text="开始" 
          type="primary" 
          size="mini" 
          shape="circle"
          @click.stop="handleStartClick"
        ></u-button>
        <u-button 
          text="详情" 
          type="info" 
          size="mini" 
          shape="circle"
          @click.stop="handleDetailClick"
        ></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'ExerciseCard',
  props: {
    // 运动数据
    exercise: {
      type: Object,
      required: true
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 默认图片
      defaultImage: '/static/images/placeholder.png',
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  methods: {
    // 获取难度文本
    getLevelText(level) {
      const levelMap = {
        1: '初级',
        2: '中级',
        3: '高级'
      };
      return levelMap[level] || '未知';
    },
    
    // 处理卡片点击
    handleCardClick() {
      this.$emit('click', this.exercise);
    },
    
    // 处理开始点击
    handleStartClick() {
      this.$emit('start', this.exercise);
    },
    
    // 处理详情点击
    handleDetailClick() {
      this.$emit('detail', this.exercise);
    }
  }
};
</script>

<style lang="scss" scoped>
.exercise-card {
  display: flex;
  background-color: var(--cardBackground, #ffffff);
  border-radius: var(--borderRadius, 12rpx);
  box-shadow: var(--shadow, 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1));
  overflow: hidden;
  margin-bottom: 20rpx;
  
  &.is-elderly {
    border-radius: var(--borderRadiusLarge, 24rpx);
  }
  
  .exercise-image-container {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    
    .exercise-image {
      width: 100%;
      height: 100%;
    }
    
    .recommended-tag {
      position: absolute;
      top: 10rpx;
      left: 0;
      background-color: var(--primary, #5677fc);
      color: #ffffff;
      font-size: 20rpx;
      padding: 4rpx 10rpx;
      border-radius: 0 8rpx 8rpx 0;
    }
    
    .level-tag {
      position: absolute;
      bottom: 10rpx;
      right: 0;
      color: #ffffff;
      font-size: 20rpx;
      padding: 4rpx 10rpx;
      border-radius: 8rpx 0 0 8rpx;
      
      &.level-1 {
        background-color: var(--success, #07c160);
      }
      
      &.level-2 {
        background-color: var(--warning, #ff9800);
      }
      
      &.level-3 {
        background-color: var(--error, #f56c6c);
      }
    }
  }
  
  .exercise-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    
    .exercise-name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .exercise-name {
        font-size: 32rpx;
        font-weight: 500;
        color: var(--textPrimary, #303133);
      }
    }
    
    .exercise-duration, .exercise-calorie, .exercise-target {
      font-size: 26rpx;
      color: var(--textRegular, #606266);
      margin-bottom: 6rpx;
      
      .label {
        color: var(--textSecondary, #909399);
      }
      
      .value {
        font-weight: 500;
      }
    }
    
    .exercise-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10rpx;
      gap: 20rpx;
    }
  }
}

.is-elderly {
  .exercise-image-container {
    width: 220rpx;
    height: 220rpx;
    
    .recommended-tag, .level-tag {
      font-size: 24rpx;
      padding: 6rpx 12rpx;
    }
  }
  
  .exercise-info {
    padding: 24rpx;
    
    .exercise-name-row .exercise-name {
      font-size: 36rpx;
    }
    
    .exercise-duration, .exercise-calorie, .exercise-target {
      font-size: 30rpx;
      margin-bottom: 8rpx;
    }
  }
}
</style>
