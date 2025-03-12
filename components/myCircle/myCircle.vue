<template>
  <view class="my-circle" :style="{ width: size + 'px', height: size + 'px' }">
    <canvas class="circle-canvas" canvas-id="circleCanvas" :style="{ width: size + 'px', height: size + 'px' }"></canvas>
    <view class="circle-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'myCircle',
  props: {
    percent: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 120
    },
    borderWidth: {
      type: Number,
      default: 6
    },
    activeColor: {
      type: String,
      default: '#3cc51f'
    },
    backgroundColor: {
      type: String,
      default: '#ebedf0'
    }
  },
  data() {
    return {
      ctx: null
    }
  },
  watch: {
    percent(val) {
      this.drawCircle()
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.drawCircle()
      }, 50)
    })
  },
  methods: {
    drawCircle() {
      const ctx = uni.createCanvasContext('circleCanvas', this)
      this.ctx = ctx
      
      const size = this.size
      const centerX = size / 2
      const centerY = size / 2
      const radius = size / 2 - this.borderWidth
      
      // 绘制背景圆环
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.setLineWidth(this.borderWidth)
      ctx.setStrokeStyle(this.backgroundColor)
      ctx.stroke()
      
      // 绘制进度圆环
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (this.percent / 100))
      ctx.setLineWidth(this.borderWidth)
      ctx.setStrokeStyle(this.activeColor)
      ctx.setLineCap('round')
      ctx.stroke()
      
      ctx.draw()
    }
  }
}
</script>

<style>
.my-circle {
  position: relative;
  display: inline-block;
}

.circle-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.circle-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
