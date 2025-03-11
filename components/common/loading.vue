<template>
  <view class="loading-container" :class="{'fullscreen': fullscreen, 'transparent-bg': transparentBg, 'is-elderly': isElderly}" :style="[customStyle]">
    <view class="loading-content">
      <u-loading-icon :mode="mode" :color="color" :size="size" :show="true"></u-loading-icon>
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'Loading',
  props: {
    // 是否全屏显示
    fullscreen: {
      type: Boolean,
      default: false
    },
    // 加载图标模式
    mode: {
      type: String,
      default: 'circle',
      validator: (val) => ['circle', 'flower', 'semicircle', 'square'].includes(val)
    },
    // 加载图标颜色
    color: {
      type: String,
      default: '#5677fc'
    },
    // 加载图标大小
    size: {
      type: Number,
      default: 36
    },
    // 加载文本
    text: {
      type: String,
      default: '加载中...'
    },
    // 是否透明背景
    transparentBg: {
      type: Boolean,
      default: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  }
};
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }
  
  &.transparent-bg {
    background-color: transparent;
  }
  
  &.is-elderly {
    .loading-text {
      font-size: 32rpx;
    }
  }
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .loading-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: var(--textSecondary, #909399);
    }
  }
}
</style>
