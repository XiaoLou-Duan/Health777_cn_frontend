<template>
  <view class="food-recognition-container">
    <u-navbar title="食物识别" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <food-image-capture @capture-success="onCaptureSuccess"></food-image-capture>
      <food-recognition-result v-if="recognitionResult" :result="recognitionResult"></food-recognition-result>
      <food-manual-input v-if="showManualInput" @submit="onManualSubmit"></food-manual-input>
    </view>
  </view>
</template>

<script>
import foodImageCapture from './components/food-image-capture.vue'
import foodRecognitionResult from './components/food-recognition-result.vue'
import foodManualInput from './components/food-manual-input.vue'

export default {
  components: {
    foodImageCapture,
    foodRecognitionResult,
    foodManualInput
  },
  data() {
    return {
      recognitionResult: null,
      showManualInput: false,
    }
  },
  methods: {
    onCaptureSuccess(imageData) {
      // 模拟识别过程
      uni.showLoading({
        title: '识别中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        // 调用API获取识别结果
        uni.request({
          url: '/api/nutrition/recognize-food',
          method: 'POST',
          data: {
            imageData: imageData
          },
          success: (res) => {
            if (res.data.code === 0) {
              this.recognitionResult = res.data.data;
            } else {
              uni.showToast({
                title: res.data.message || '识别失败',
                icon: 'none'
              });
              this.showManualInput = true;
            }
          },
          fail: () => {
            uni.showToast({
              title: '网络请求失败',
              icon: 'none'
            });
            this.showManualInput = true;
          }
        });
      }, 1500);
    },
    
    onManualSubmit(foodData) {
      // 处理手动输入的食物数据
      uni.showLoading({
        title: '提交中...'
      });
      
      uni.request({
        url: '/api/nutrition/add-food-record',
        method: 'POST',
        data: foodData,
        success: (res) => {
          uni.hideLoading();
          if (res.data.code === 0) {
            uni.showToast({
              title: '记录成功',
              icon: 'success'
            });
            
            // 返回上一页或刷新
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || '记录失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "./food-recognition.scss";
</style>
