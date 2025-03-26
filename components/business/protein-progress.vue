<template>
  <view class="protein-progress" :class="{'is-elderly': isElderly}">
    <view class="progress-header">
      <text class="title">{{ title }}</text>
      <text v-if="showPercentage" class="percentage">{{ percentage }}%</text>
    </view>
    
    <view class="progress-bar-container">
      <view class="progress-bar-bg">
        <view class="progress-bar-fill" :style="{width: `${percentage}%`, backgroundColor: getProgressColor()}"></view>
      </view>
    </view>
    
    <view class="progress-info">
      <view class="current-value">
        <text class="value">{{ current }}g</text>
        <text class="label">当前摄入</text>
      </view>
      <view class="divider"></view>
      <view class="target-value">
        <text class="value">{{ target }}g</text>
        <text class="label">目标摄入</text>
      </view>
      <view class="divider"></view>
      <view class="remaining-value">
        <text class="value" :class="{'text-warning': isWarning, 'text-danger': isDanger}">{{ remaining }}g</text>
        <text class="label">剩余需求</text>
      </view>
    </view>
    
    <view v-if="showTips && tip" class="progress-tip">
      <u-icon name="info-circle" color="#909399" size="28"></u-icon>
      <text class="tip-text">{{ tip }}</text>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'ProteinProgress',
  props: {
    // 标题
    title: {
      type: String,
      default: '每日蛋白质摄入进度'
    },
    // 当前摄入值
    current: {
      type: Number,
      default: 0
    },
    // 目标摄入值
    target: {
      type: Number,
      default: 100
    },
    // 是否显示百分比
    showPercentage: {
      type: Boolean,
      default: true
    },
    // 是否显示提示
    showTips: {
      type: Boolean,
      default: true
    },
    // 自定义提示文字
    tip: {
      type: String,
      default: ''
    },
    // 警告阈值
    warningThreshold: {
      type: Number,
      default: 0.6
    },
    // 危险阈值
    dangerThreshold: {
      type: Number,
      default: 0.8
    }
  },
  data() {
    return {
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  computed: {
    // 计算百分比
    percentage() {
      if (this.target === 0) return 0;
      const percent = Math.min(100, Math.round((this.current / this.target) * 100));
      return percent;
    },
    
    // 计算剩余需求
    remaining() {
      return Math.max(0, this.target - this.current);
    },
    
    // 是否为警告状态
    isWarning() {
      return this.remaining / this.target > this.warningThreshold;
    },
    
    // 是否为危险状态
    isDanger() {
      return this.remaining / this.target > this.dangerThreshold;
    }
  },
  methods: {
    // 获取进度条颜色
    getProgressColor() {
      if (this.percentage >= 100) {
        return '#07c160'; // 完成状态 - 绿色
      } else if (this.percentage >= 70) {
        return '#5677fc'; // 良好状态 - 蓝色
      } else if (this.percentage >= 30) {
        return '#ff9800'; // 警告状态 - 橙色
      } else {
        return '#f56c6c'; // 危险状态 - 红色
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.protein-progress {
  background-color: var(--cardBackground, #ffffff);
  border-radius: var(--borderRadius, 12rpx);
  box-shadow: var(--shadow, 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1));
  padding: 20rpx;
  
  &.is-elderly {
    border-radius: var(--borderRadiusLarge, 24rpx);
    padding: 30rpx;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15rpx;
    
    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: var(--textPrimary, #303133);
    }
    
    .percentage {
      font-size: 28rpx;
      font-weight: bold;
      color: var(--primary, #5677fc);
    }
  }
  
  .progress-bar-container {
    height: 24rpx;
    margin-bottom: 20rpx;
    
    .progress-bar-bg {
      width: 100%;
      height: 100%;
      background-color: var(--primaryLight, #e7edff);
      border-radius: 12rpx;
      overflow: hidden;
      
      .progress-bar-fill {
        height: 100%;
        border-radius: 12rpx;
        transition: width 0.3s ease;
      }
    }
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15rpx;
    
    .current-value, .target-value, .remaining-value {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .value {
        font-size: 32rpx;
        font-weight: bold;
        color: var(--textPrimary, #303133);
        margin-bottom: 4rpx;
        
        &.text-warning {
          color: var(--warning, #ff9800);
        }
        
        &.text-danger {
          color: var(--error, #f56c6c);
        }
      }
      
      .label {
        font-size: 24rpx;
        color: var(--textSecondary, #909399);
      }
    }
    
    .divider {
      width: 1rpx;
      height: 50rpx;
      background-color: var(--divider, #f0f0f0);
      margin: 0 15rpx;
    }
  }
  
  .progress-tip {
    display: flex;
    align-items: center;
    padding: 10rpx 0;
    
    .tip-text {
      margin-left: 10rpx;
      font-size: 24rpx;
      color: var(--textSecondary, #909399);
      flex: 1;
    }
  }
}

.is-elderly {
  .progress-header {
    margin-bottom: 20rpx;
    
    .title {
      font-size: 36rpx;
    }
    
    .percentage {
      font-size: 34rpx;
    }
  }
  
  .progress-bar-container {
    height: 30rpx;
    margin-bottom: 25rpx;
  }
  
  .progress-info {
    margin-bottom: 20rpx;
    
    .current-value, .target-value, .remaining-value {
      .value {
        font-size: 38rpx;
        margin-bottom: 6rpx;
      }
      
      .label {
        font-size: 28rpx;
      }
    }
    
    .divider {
      height: 60rpx;
    }
  }
  
  .progress-tip {
    padding: 15rpx 0;
    
    .tip-text {
      font-size: 28rpx;
    }
  }
}
</style>
