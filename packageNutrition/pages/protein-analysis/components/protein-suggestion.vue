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
@import "./protein-suggestion.scss";
</style>
