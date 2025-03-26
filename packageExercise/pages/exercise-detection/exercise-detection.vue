<template>
  <view class="exercise-detection-container">
    <u-navbar title="简易运动检测" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <camera-view @start-detection="startDetection" @stop-detection="stopDetection"></camera-view>
      <detection-result :resultData="resultData" v-if="hasResult"></detection-result>
      <exercise-suggestion :suggestions="exerciseSuggestions"></exercise-suggestion>
    </view>
  </view>
</template>

<script>
import cameraView from './components/camera-view.vue'
import detectionResult from './components/detection-result.vue'
import exerciseSuggestion from './components/exercise-suggestion.vue'

export default {
  components: {
    cameraView,
    detectionResult,
    exerciseSuggestion
  },
  data() {
    return {
      resultData: {
        detectionType: '',
        accuracy: 0,
        repetitions: 0,
        duration: 0,
        calories: 0
      },
      exerciseSuggestions: [],
      hasResult: false,
      isDetecting: false
    }
  },
  onLoad() {
    this.loadSuggestions();
  },
  methods: {
    loadSuggestions() {
      uni.request({
        url: '/api/exercise/suggestions',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.exerciseSuggestions = res.data.data;
          }
        }
      });
    },
    startDetection(type) {
      this.isDetecting = true;
      this.hasResult = false;
      
      // 模拟检测过程
      uni.showLoading({
        title: '运动检测中...'
      });
      
      // 实际项目中应该调用相机API进行运动检测
      setTimeout(() => {
        this.simulateDetectionResult(type);
        uni.hideLoading();
      }, 3000);
    },
    stopDetection() {
      if (this.isDetecting) {
        this.isDetecting = false;
        uni.showToast({
          title: '已停止检测',
          icon: 'none'
        });
      }
    },
    simulateDetectionResult(type) {
      // 模拟返回检测结果
      this.resultData = {
        detectionType: type,
        accuracy: Math.floor(Math.random() * 30) + 70, // 70-100的随机数
        repetitions: Math.floor(Math.random() * 10) + 5, // 5-15的随机数
        duration: Math.floor(Math.random() * 60) + 30, // 30-90秒的随机数
        calories: Math.floor(Math.random() * 50) + 20 // 20-70卡路里的随机数
      };
      
      this.hasResult = true;
      this.isDetecting = false;
      
      // 保存运动记录
      this.saveExerciseRecord();
    },
    saveExerciseRecord() {
      uni.request({
        url: '/api/exercise/record',
        method: 'POST',
        data: {
          type: this.resultData.detectionType,
          accuracy: this.resultData.accuracy,
          repetitions: this.resultData.repetitions,
          duration: this.resultData.duration,
          calories: this.resultData.calories,
          time: new Date().getTime()
        },
        success: (res) => {
          if (res.data.code === 0) {
            console.log('运动记录保存成功');
          }
        }
      });
    }
  }
}
</script>

<style lang="scss">
.exercise-detection-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
}
</style>
