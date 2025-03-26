<template>
  <view class="protein-suggestion">
    <view class="suggestion-header">
      <text class="suggestion-title">蛋白质摄入建议</text>
    </view>
    
    <view class="suggestion-list">
      <view class="suggestion-item" v-for="(item, index) in suggestions" :key="index">
        <view class="suggestion-icon">
          <u-icon :name="item.icon || 'info-circle'" color="#2979ff" size="40"></u-icon>
        </view>
        <view class="suggestion-content">
          <text class="suggestion-text">{{ item.content }}</text>
          <text class="suggestion-source" v-if="item.source">来源：{{ item.source }}</text>
        </view>
      </view>
      
      <view class="empty-suggestion" v-if="!suggestions || suggestions.length === 0">
        <u-empty mode="data" text="暂无建议" marginTop="40"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
.protein-suggestion {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .suggestion-header {
    margin-bottom: 30rpx;

    .suggestion-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }

  .suggestion-list {
    .suggestion-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .suggestion-icon {
        margin-right: 20rpx;
        padding-top: 4rpx;
      }

      .suggestion-content {
        flex: 1;

        .suggestion-text {
          font-size: 28rpx;
          color: #333333;
          line-height: 1.5;
          display: block;
        }

        .suggestion-source {
          font-size: 24rpx;
          color: #999999;
          margin-top: 10rpx;
          display: block;
        }
      }
    }

    .empty-suggestion {
      padding: 20rpx 0;
    }
  }
}
</style>
