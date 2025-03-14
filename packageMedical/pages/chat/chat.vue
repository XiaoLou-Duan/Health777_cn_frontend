<template>
  <view class="chat-container">
    <!-- ...existing code... -->
    
    <!-- 将 u-loading 替换为 u-loading-icon -->
    <view class="loading-container" v-if="isLoading">
      <u-loading-icon mode="circle" size="32" color="#5FB878"></u-loading-icon>
      <text class="loading-text">正在加载消息...</text>
    </view>
    
    <!-- ...existing code... -->
  </view>
</template>

<script>
export default {
  // ...existing code...
  
  components: {
    // 确保引入了 u-loading-icon 组件
    'u-loading-icon': () => import('uview-ui/components/u-loading-icon/u-loading-icon.vue')
    // ...existing code...
  },
  
  // ...existing code...
}
</script>