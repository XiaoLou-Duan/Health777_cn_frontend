<template>
  <view class="protein-summary">
    <view class="summary-header">
      <text class="summary-title">蛋白质摄入概览</text>
    </view>

    <view class="summary-content">
      <view class="summary-item">
        <text class="item-label">今日摄入</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ summary.today }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>

      <view class="summary-item">
        <text class="item-label">目标摄入</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ summary.target }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>

      <view class="summary-item">
        <text class="item-label">周平均摄入</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ summary.weekAverage }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>

      <view class="summary-item">
        <text class="item-label">目标完成度</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ summary.completion }}</text>
          <text class="item-unit">%</text>
        </view>
      </view>
    </view>

    <view class="progress-bar">
      <u-line-progress :percentage="summary.completion || 0" :show-percent="false" height="14"
        active-color="#2979ff"></u-line-progress>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    summary: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.protein-summary {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .summary-header {
    margin-bottom: 30rpx;

    .summary-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }

  .summary-content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20rpx;

    .summary-item {
      width: 50%;
      margin-bottom: 30rpx;

      .item-label {
        font-size: 26rpx;
        color: #999999;
        display: block;
        margin-bottom: 10rpx;
      }

      .item-value-wrapper {
        display: flex;
        align-items: flex-end;

        .item-value {
          font-size: 36rpx;
          font-weight: bold;
          color: #333333;
        }

        .item-unit {
          font-size: 24rpx;
          color: #999999;
          margin-left: 4rpx;
          padding-bottom: 6rpx;
        }
      }
    }
  }

  .progress-bar {
    margin-top: 10rpx;
  }
}
</style>
