<template>
  <view class="nav-bar" :class="[`safe-area-${safeAreaClass}`, {'is-elderly': isElderly}, {'nav-bar-fixed': fixed}]" :style="[customStyle]">
    <!-- 状态栏占位 -->
    <view v-if="safeArea !== 'none'" class="status-bar" :style="{ height: `${statusBarHeight}px` }"></view>
    
    <!-- 导航栏内容 -->
    <view class="nav-bar-content">
      <!-- 左侧区域 -->
      <view class="nav-bar-left" @click="handleLeftClick">
        <view v-if="showBack" class="nav-bar-back">
          <u-icon name="arrow-left" :color="iconColor" :size="iconSize"></u-icon>
          <text v-if="backText" class="back-text">{{ backText }}</text>
        </view>
        <slot name="left"></slot>
      </view>
      
      <!-- 中间标题 -->
      <view class="nav-bar-title" :style="[titleStyle]">
        <text v-if="title" class="title-text">{{ title }}</text>
        <slot name="title"></slot>
      </view>
      
      <!-- 右侧区域 -->
      <view class="nav-bar-right">
        <slot name="right"></slot>
      </view>
    </view>
    
    <!-- 分割线 -->
    <view v-if="showBorder" class="nav-bar-border"></view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'NavBar',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true
    },
    // 返回按钮文字
    backText: {
      type: String,
      default: ''
    },
    // 是否固定在顶部
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否显示底部分割线
    showBorder: {
      type: Boolean,
      default: true
    },
    // 图标颜色
    iconColor: {
      type: String,
      default: '#303133'
    },
    // 图标大小
    iconSize: {
      type: Number,
      default: 44
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    // 文字颜色
    textColor: {
      type: String,
      default: '#303133'
    },
    // 安全区域设置
    safeArea: {
      type: String,
      default: 'top', // both, top, none
      validator: (val) => ['both', 'top', 'none'].includes(val)
    },
    // z-index
    zIndex: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      // 状态栏高度
      statusBarHeight: 0,
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  computed: {
    // 自定义样式
    customStyle() {
      let style = {
        backgroundColor: this.bgColor,
        zIndex: this.zIndex
      };
      
      return style;
    },
    // 标题样式
    titleStyle() {
      return {
        color: this.textColor,
        fontSize: this.isElderly ? '36rpx' : '32rpx'
      };
    },
    // 安全区域类名
    safeAreaClass() {
      return this.safeArea;
    }
  },
  created() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
  },
  methods: {
    // 处理左侧点击
    handleLeftClick() {
      if (this.showBack) {
        this.$emit('back');
        // 默认返回上一页
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            fail: () => {
              // 如果返回失败，可能是首页，跳转到首页
              uni.switchTab({
                url: '/pages/index/index'
              });
            }
          });
        }, 100);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-bar {
  width: 100%;
  background-color: var(--cardBackground, #ffffff);
  
  // 固定在顶部
  &.nav-bar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  
  // 导航栏内容
  .nav-bar-content {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
  }
  
  // 左侧区域
  .nav-bar-left {
    flex: 1;
    display: flex;
    align-items: center;
    
    .nav-bar-back {
      display: flex;
      align-items: center;
      
      .back-text {
        margin-left: 10rpx;
        font-size: 28rpx;
        color: var(--textRegular, #606266);
      }
    }
  }
  
  // 中间标题
  .nav-bar-title {
    flex: 2;
    text-align: center;
    overflow: hidden;
    
    .title-text {
      font-size: 32rpx;
      font-weight: 500;
      color: var(--textPrimary, #303133);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  // 右侧区域
  .nav-bar-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  // 底部分割线
  .nav-bar-border {
    height: 1rpx;
    background-color: var(--border, #ebeef5);
  }
  
  // 老年人模式
  &.is-elderly {
    .nav-bar-content {
      height: 100rpx;
    }
    
    .nav-bar-left .nav-bar-back .back-text {
      font-size: 32rpx;
    }
    
    .nav-bar-title .title-text {
      font-size: 36rpx;
    }
  }
}
</style>
