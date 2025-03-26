<template>
  <view class="reminder-card" :class="[`type-${type}`, {'is-elderly': isElderly}, {'reminder-completed': completed}]" @click="handleCardClick">
    <view class="reminder-left">
      <view class="reminder-icon">
        <u-icon :name="getIconName()" :color="getIconColor()" size="48"></u-icon>
      </view>
    </view>
    
    <view class="reminder-content">
      <view class="reminder-title-row">
        <text class="reminder-title">{{ title }}</text>
        <text v-if="showStatus" class="reminder-status">{{ completed ? '已完成' : '未完成' }}</text>
      </view>
      
      <text class="reminder-description">{{ description }}</text>
      
      <view class="reminder-time">
        <u-icon name="clock" size="28" :color="getTimeColor()"></u-icon>
        <text class="time-text">{{ timeText }}</text>
      </view>
      
      <view v-if="showActions" class="reminder-actions">
        <view class="action-buttons">
          <u-button 
            v-if="!completed" 
            text="完成" 
            type="primary" 
            size="mini" 
            shape="circle"
            @click.stop="handleCompleteClick"
          ></u-button>
          <u-button 
            v-if="showReschedule && !completed" 
            text="改期" 
            type="info" 
            size="mini" 
            shape="circle"
            @click.stop="handleRescheduleClick"
          ></u-button>
          <u-button 
            v-if="showSkip && !completed" 
            text="跳过" 
            type="warning" 
            size="mini" 
            shape="circle"
            @click.stop="handleSkipClick"
          ></u-button>
        </view>
      </view>
    </view>
    
    <view v-if="showMore" class="reminder-more" @click.stop="handleMoreClick">
      <u-icon name="more-dot-fill" color="#909399" size="40"></u-icon>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'ReminderCard',
  props: {
    // 提醒标题
    title: {
      type: String,
      required: true
    },
    // 提醒描述
    description: {
      type: String,
      default: ''
    },
    // 时间文本
    timeText: {
      type: String,
      required: true
    },
    // 是否已完成
    completed: {
      type: Boolean,
      default: false
    },
    // 提醒类型: nutrition(营养), exercise(运动), medicine(药物), social(社交), appointment(预约)
    type: {
      type: String,
      default: 'nutrition',
      validator: (val) => ['nutrition', 'exercise', 'medicine', 'social', 'appointment'].includes(val)
    },
    // 是否显示状态
    showStatus: {
      type: Boolean,
      default: true
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: true
    },
    // 是否显示更多按钮
    showMore: {
      type: Boolean,
      default: false
    },
    // 是否显示改期按钮
    showReschedule: {
      type: Boolean,
      default: true
    },
    // 是否显示跳过按钮
    showSkip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  methods: {
    // 获取图标名称
    getIconName() {
      const iconMap = {
        nutrition: 'shopping-cart',
        exercise: 'star',
        medicine: 'bell',
        social: 'chat',
        appointment: 'calendar'
      };
      return iconMap[this.type] || 'bell';
    },
    
    // 获取图标颜色
    getIconColor() {
      const colorMap = {
        nutrition: '#07c160',
        exercise: '#5677fc',
        medicine: '#ff9800',
        social: '#9c27b0',
        appointment: '#f56c6c'
      };
      return this.completed ? '#909399' : (colorMap[this.type] || '#5677fc');
    },
    
    // 获取时间颜色
    getTimeColor() {
      return this.completed ? '#909399' : '#606266';
    },
    
    // 处理卡片点击
    handleCardClick() {
      this.$emit('click');
    },
    
    // 处理完成点击
    handleCompleteClick() {
      this.$emit('complete');
    },
    
    // 处理改期点击
    handleRescheduleClick() {
      this.$emit('reschedule');
    },
    
    // 处理跳过点击
    handleSkipClick() {
      this.$emit('skip');
    },
    
    // 处理更多点击
    handleMoreClick() {
      this.$emit('more');
    }
  }
};
</script>

<style lang="scss" scoped>
.reminder-card {
  display: flex;
  background-color: var(--cardBackground, #ffffff);
  border-radius: var(--borderRadius, 12rpx);
  box-shadow: var(--shadow, 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1));
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  &.reminder-completed {
    opacity: 0.7;
  }
  
  &.is-elderly {
    border-radius: var(--borderRadiusLarge, 24rpx);
    padding: 30rpx;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8rpx;
    border-radius: 4rpx 0 0 4rpx;
  }
  
  &.type-nutrition::before {
    background-color: #07c160;
  }
  
  &.type-exercise::before {
    background-color: #5677fc;
  }
  
  &.type-medicine::before {
    background-color: #ff9800;
  }
  
  &.type-social::before {
    background-color: #9c27b0;
  }
  
  &.type-appointment::before {
    background-color: #f56c6c;
  }
  
  .reminder-left {
    padding-right: 20rpx;
    
    .reminder-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background-color: var(--primaryLight, #e7edff);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .reminder-content {
    flex: 1;
    
    .reminder-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .reminder-title {
        font-size: 32rpx;
        font-weight: 500;
        color: var(--textPrimary, #303133);
      }
      
      .reminder-status {
        font-size: 26rpx;
        color: var(--textSecondary, #909399);
      }
    }
    
    .reminder-description {
      font-size: 28rpx;
      color: var(--textRegular, #606266);
      margin-bottom: 10rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .reminder-time {
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;
      
      .time-text {
        margin-left: 10rpx;
        font-size: 26rpx;
        color: var(--textSecondary, #909399);
      }
    }
    
    .reminder-actions {
      display: flex;
      justify-content: flex-end;
      
      .action-buttons {
        display: flex;
        gap: 15rpx;
      }
    }
  }
  
  .reminder-more {
    padding: 0 10rpx;
    display: flex;
    align-items: center;
  }
}

.is-elderly {
  .reminder-left {
    padding-right: 30rpx;
    
    .reminder-icon {
      width: 100rpx;
      height: 100rpx;
    }
  }
  
  .reminder-content {
    .reminder-title-row {
      margin-bottom: 15rpx;
      
      .reminder-title {
        font-size: 36rpx;
      }
      
      .reminder-status {
        font-size: 30rpx;
      }
    }
    
    .reminder-description {
      font-size: 32rpx;
      margin-bottom: 15rpx;
    }
    
    .reminder-time {
      margin-bottom: 20rpx;
      
      .time-text {
        font-size: 30rpx;
      }
    }
    
    .reminder-actions {
      .action-buttons {
        gap: 20rpx;
      }
    }
  }
}
</style>
