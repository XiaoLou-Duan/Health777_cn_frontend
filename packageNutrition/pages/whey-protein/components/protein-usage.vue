<template>
  <view class="protein-usage">
    <view class="usage-header">
      <text class="usage-title">乳清蛋白使用统计</text>
    </view>
    
    <view class="usage-content">
      <view class="usage-item">
        <text class="item-label">累计使用</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ usageData.total }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>
      
      <view class="usage-item">
        <text class="item-label">本月使用</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ usageData.month }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>
      
      <view class="usage-item">
        <text class="item-label">本周使用</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ usageData.week }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>
      
      <view class="usage-item">
        <text class="item-label">今日使用</text>
        <view class="item-value-wrapper">
          <text class="item-value">{{ usageData.today }}</text>
          <text class="item-unit">克</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    usageData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
@import "./protein-usage.scss";
</style>
