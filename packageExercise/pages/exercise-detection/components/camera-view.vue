<template>
  <view class="camera-view">
    <view class="camera-header">
      <text class="camera-title">运动检测</text>
    </view>
    
    <view class="camera-content">
      <view class="camera-placeholder" v-if="!cameraActive">
        <u-icon name="camera-fill" size="80" color="#cccccc"></u-icon>
        <text class="placeholder-text">点击下方按钮开始运动检测</text>
      </view>
      
      <view class="camera-preview" v-else>
        <view class="camera-overlay">
          <text class="detection-text">正在检测: {{ selectedExercise }}</text>
        </view>
      </view>
    </view>
    
    <view class="exercise-selector">
      <scroll-view scroll-x class="exercise-scroll" show-scrollbar="false">
        <view class="exercise-list">
          <view 
            class="exercise-item" 
            v-for="(exercise, index) in exerciseTypes" 
            :key="index"
            :class="{ active: selectedExercise === exercise.name }"
            @click="selectExercise(exercise.name)"
          >
            {{ exercise.name }}
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view class="camera-actions">
      <u-button 
        type="primary" 
        :disabled="!selectedExercise" 
        @click="toggleCamera"
      >
        {{ cameraActive ? '停止检测' : '开始检测' }}
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cameraActive: false,
      selectedExercise: '',
      exerciseTypes: [
        { name: '深蹲', value: 'squat' },
        { name: '俯卧撑', value: 'pushup' },
        { name: '仰卧起坐', value: 'situp' },
        { name: '平板支撑', value: 'plank' },
        { name: '弓步蹲', value: 'lunge' },
        { name: '侧平举', value: 'lateral_raise' }
      ]
    }
  },
  methods: {
    selectExercise(exerciseName) {
      this.selectedExercise = exerciseName;
      if (this.cameraActive) {
        this.stopCamera();
        this.startCamera();
      }
    },
    toggleCamera() {
      if (this.cameraActive) {
        this.stopCamera();
      } else {
        this.startCamera();
      }
    },
    startCamera() {
      if (!this.selectedExercise) {
        uni.showToast({
          title: '请先选择运动类型',
          icon: 'none'
        });
        return;
      }
      
      this.cameraActive = true;
      
      // 实际项目中应当调用相机API
      // 这里模拟通知父组件开始检测
      this.$emit('start-detection', this.selectedExercise);
    },
    stopCamera() {
      this.cameraActive = false;
      
      // 通知父组件停止检测
      this.$emit('stop-detection');
    }
  }
}
</script>

<style lang="scss">
.camera-view {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .camera-header {
    margin-bottom: 30rpx;
    
    .camera-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
  
  .camera-content {
    height: 500rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    position: relative;
    
    .camera-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      .placeholder-text {
        font-size: 28rpx;
        color: #999999;
        margin-top: 20rpx;
      }
    }
    
    .camera-preview {
      height: 100%;
      position: relative;
      background-color: #000000;
      
      .camera-overlay {
        position: absolute;
        top: 20rpx;
        left: 20rpx;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10rpx 20rpx;
        border-radius: 6rpx;
        
        .detection-text {
          font-size: 24rpx;
          color: #ffffff;
        }
      }
    }
  }
  
  .exercise-selector {
    margin-bottom: 30rpx;
    
    .exercise-scroll {
      white-space: nowrap;
      
      .exercise-list {
        display: inline-flex;
        padding: 6rpx 0;
        
        .exercise-item {
          padding: 10rpx 24rpx;
          margin-right: 20rpx;
          font-size: 26rpx;
          color: #666666;
          background-color: #f5f5f5;
          border-radius: 30rpx;
          transition: all 0.3s;
          
          &.active {
            background-color: rgba(41, 121, 255, 0.1);
            color: #2979ff;
          }
        }
      }
    }
  }
  
  .camera-actions {
    display: flex;
    justify-content: center;
  }
}
</style>
