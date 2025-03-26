<template>
  <view class="svg-icon" :style="{'width': size, 'height': size}">
    <svg class="svg-icon-inner" :aria-hidden="!title" :width="size" :height="size">
      <use :xlink:href="iconName" />
      <title v-if="title">{{title}}</title>
    </svg>
  </view>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '24px'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconPath() {
      return `#${this.iconName}`;
    }
  }
}
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
}
.svg-icon-inner {
  fill: currentColor;
  vertical-align: middle;
}
</style>
