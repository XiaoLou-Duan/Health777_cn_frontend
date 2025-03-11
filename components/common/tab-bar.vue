<template>
  <view class="tab-bar" :class="{'tab-bar-fixed': fixed, 'tab-bar-safe-bottom': safeAreaBottom, 'is-elderly': isElderly}" :style="customStyle">
    <view class="tab-bar-item" v-for="(item, index) in items" :key="index" @click="handleItemClick(index, item)">
      <view class="tab-bar-icon">
        <image :src="current === index ? item.activeIcon : item.icon" mode="aspectFit" class="icon-image"></image>
      </view>
      <text class="tab-bar-text" :class="{'active': current === index}">{{ item.text }}</text>
      <view v-if="item.badge" class="tab-bar-badge" :class="{'dot': item.badge === 'dot'}">
        <text v-if="item.badge !== 'dot'">{{ item.badge }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'TabBar',
  props: {
    // 当前选中的索引
    value: {
      type: Number,
      default: 0
    },
    // 标签项数组
    items: {
      type: Array,
      default: () => []
    },
    // 是否固定在底部
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否适配底部安全区域
    safeAreaBottom: {
      type: Boolean,
      default: true
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    // 文字颜色
    textColor: {
      type: String,
      default: '#909399'
    },
    // 激活文字颜色
    activeTextColor: {
      type: String,
      default: '#5677fc'
    },
    // z-index
    zIndex: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      current: this.value,
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  computed: {
    // 自定义样式
    customStyle() {
      return {
        backgroundColor: this.bgColor,
        zIndex: this.zIndex
      };
    }
  },
  watch: {
    // 监听value变化
    value(val) {
      this.current = val;
    }
  },
  methods: {
    // 处理标签项点击
    handleItemClick(index, item) {
      if (this.current !== index) {
        this.current = index;
        this.$emit('input', index);
        this.$emit('change', index);
        
        // 如果有页面路径，则进行跳转
        if (item.pagePath) {
          uni.switchTab({
            url: item.pagePath
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-bar {
  display: flex;
  width: 100%;
  height: 100rpx;
  background-color: var(--cardBackground, #ffffff);
  box-shadow: 0 -2rpx 12rpx 0 rgba(0, 0, 0, 0.05);
  
  // 固定在底部
  &.tab-bar-fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  // 适配底部安全区域
  &.tab-bar-safe-bottom {
    padding-bottom: var(--window-bottom, 0);
  }
  
  // 老年人模式
  &.is-elderly {
    height: 120rpx;
  }
  
  // 标签项
  .tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 10rpx 0;
    
    .tab-bar-icon {
      margin-bottom: 6rpx;
      
      .icon-image {
        width: 44rpx;
        height: 44rpx;
      }
    }
    
    .tab-bar-text {
      font-size: 24rpx;
      color: var(--textSecondary, #909399);
      
      &.active {
        color: var(--primary, #5677fc);
      }
    }
    
    .tab-bar-badge {
      position: absolute;
      top: 6rpx;
      right: 50%;
      transform: translateX(18rpx);
      background-color: var(--error, #f56c6c);
      color: #ffffff;
      font-size: 20rpx;
      padding: 0 10rpx;
      height: 32rpx;
      min-width: 32rpx;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      
      &.dot {
        width: 16rpx;
        height: 16rpx;
        min-width: 16rpx;
        padding: 0;
        border-radius: 50%;
      }
    }
  }
}

// 老年人模式下的特殊样式
.is-elderly {
  .tab-bar-item {
    .tab-bar-icon {
      .icon-image {
        width: 52rpx;
        height: 52rpx;
      }
    }
    
    .tab-bar-text {
      font-size: 28rpx;
    }
    
    .tab-bar-badge {
      font-size: 24rpx;
      padding: 0 12rpx;
      height: 36rpx;
      min-width: 36rpx;
      border-radius: 18rpx;
      
      &.dot {
        width: 20rpx;
        height: 20rpx;
        min-width: 20rpx;
      }
    }
  }
}
</style>
