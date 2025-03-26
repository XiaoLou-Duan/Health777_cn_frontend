<template>
  <view class="empty-container" :class="{'is-elderly': isElderly}" :style="[customStyle]">
    <image :src="image || defaultImage" mode="aspectFit" class="empty-image"></image>
    <text class="empty-text">{{ text || '暂无数据' }}</text>
    <text v-if="subText" class="empty-sub-text">{{ subText }}</text>
    <view v-if="$slots.default || showButton" class="empty-action">
      <slot>
        <u-button v-if="showButton" :text="buttonText" :type="buttonType" :size="buttonSize" @click="handleButtonClick"></u-button>
      </slot>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'Empty',
  props: {
    // 图片地址
    image: {
      type: String,
      default: ''
    },
    // 提示文字
    text: {
      type: String,
      default: '暂无数据'
    },
    // 副提示文字
    subText: {
      type: String,
      default: ''
    },
    // 是否显示按钮
    showButton: {
      type: Boolean,
      default: false
    },
    // 按钮文字
    buttonText: {
      type: String,
      default: '刷新'
    },
    // 按钮类型
    buttonType: {
      type: String,
      default: 'primary'
    },
    // 按钮大小
    buttonSize: {
      type: String,
      default: 'normal'
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
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
    // 处理按钮点击
    handleButtonClick() {
      this.$emit('button-click');
    }
  }
};
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx;
  
  &.is-elderly {
    padding: 80rpx 40rpx;
  }
  
  .empty-image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 30rpx;
    color: var(--textSecondary, #909399);
    margin-bottom: 10rpx;
  }
  
  .empty-sub-text {
    font-size: 26rpx;
    color: var(--textPlaceholder, #c0c4cc);
    margin-bottom: 30rpx;
    text-align: center;
  }
  
  .empty-action {
    margin-top: 30rpx;
  }
}

.is-elderly {
  .empty-image {
    width: 280rpx;
    height: 280rpx;
  }
  
  .empty-text {
    font-size: 36rpx;
  }
  
  .empty-sub-text {
    font-size: 30rpx;
  }
}
</style>
