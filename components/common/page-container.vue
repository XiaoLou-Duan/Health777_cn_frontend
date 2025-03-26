<template>
  <view class="page-container" :class="[`safe-area-${safeAreaClass}`, {'is-elderly': isElderly}]" :style="customStyle">
    <view v-if="loading" class="page-loading">
      <u-loading-icon :mode="loadingMode" :color="loadingColor" :size="loadingSize"></u-loading-icon>
      <text v-if="loadingText" class="loading-text">{{ loadingText }}</text>
    </view>
    <slot v-else></slot>
    <view v-if="showBackToTop && isShowBackToTop" class="back-to-top" @click="backToTop">
      <u-icon name="arrow-upward" color="#ffffff" size="40"></u-icon>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'PageContainer',
  props: {
    // 是否显示加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 加载文本
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // 加载图标模式
    loadingMode: {
      type: String,
      default: 'circle'
    },
    // 加载图标颜色
    loadingColor: {
      type: String,
      default: '#5677fc'
    },
    // 加载图标大小
    loadingSize: {
      type: Number,
      default: 36
    },
    // 是否显示返回顶部按钮
    showBackToTop: {
      type: Boolean,
      default: true
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: ''
    },
    // 安全区域设置
    safeArea: {
      type: String,
      default: 'both', // both, top, bottom, none
      validator: (val) => ['both', 'top', 'bottom', 'none'].includes(val)
    }
  },
  data() {
    return {
      // 是否显示返回顶部按钮
      isShowBackToTop: false,
      // 滚动监听器
      scrollListener: null,
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  computed: {
    // 自定义样式
    customStyle() {
      let style = {};
      
      if (this.bgColor) {
        style.backgroundColor = this.bgColor;
      }
      
      return style;
    },
    // 安全区域类名
    safeAreaClass() {
      return this.safeArea;
    }
  },
  mounted() {
    if (this.showBackToTop) {
      this.initBackToTop();
    }
  },
  beforeDestroy() {
    if (this.scrollListener) {
      uni.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
  },
  methods: {
    // 初始化返回顶部按钮
    initBackToTop() {
      this.scrollListener = (e) => {
        const scrollTop = e.scrollTop;
        this.isShowBackToTop = scrollTop > 200;
      };
      
      uni.onPageScroll(this.scrollListener);
    },
    
    // 返回顶部
    backToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background, #f5f5f5);
  width: 100%;
  box-sizing: border-box;
  
  // 安全区域处理
  &.safe-area-both {
    padding-top: var(--status-bar-height, 0);
    padding-bottom: var(--window-bottom, 0);
  }
  
  &.safe-area-top {
    padding-top: var(--status-bar-height, 0);
  }
  
  &.safe-area-bottom {
    padding-bottom: var(--window-bottom, 0);
  }
  
  // 老年人模式
  &.is-elderly {
    font-size: 32rpx;
  }
}

.page-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  
  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: var(--textSecondary, #909399);
  }
}

.back-to-top {
  position: fixed;
  right: 30rpx;
  bottom: calc(100rpx + var(--window-bottom, 0));
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(86, 119, 252, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 9999;
}
</style>
