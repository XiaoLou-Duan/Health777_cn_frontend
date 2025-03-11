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
      <u-line-progress 
        :percent="summary.completion" 
        :show-percent="false"
        height="14"
        active-color="#2979ff"
      ></u-line-progress>
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
@import "./protein-summary.scss";
</style>
