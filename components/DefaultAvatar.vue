<template>
  <view class="avatar-container" :style="{width: size, height: size}">
    <view v-if="imageUrl" class="avatar-image">
      <image :src="imageUrl" :style="{width: size, height: size}" mode="aspectFill"></image>
    </view>
    <view v-else class="avatar-svg">
      <image :src="'/static/svg/default-avatar.svg'" :style="{width: size, height: size}" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DefaultAvatar',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '80rpx'
    }
  }
}
</script>

<style scoped>
.avatar-container {
  border-radius: 50%;
  overflow: hidden;
}
.avatar-image, .avatar-svg {
  width: 100%;
  height: 100%;
}
</style>
