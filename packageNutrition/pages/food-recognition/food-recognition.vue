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
      // 显示加载
      uni.showLoading({
        title: '识别中...'
      });
      
      // 先上传图片，再进行识别
      this.uploadImage(imageData);
    },
    
    // 上传图片
    uploadImage(imagePath) {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      
      uni.uploadFile({
        url: '/api/nutrition/upload-food-image',
        filePath: imagePath,
        name: 'foodImage',
        header: {
          'Authorization': 'Bearer ' + token
        },
        success: (uploadRes) => {
          // 解析上传响应
          const response = JSON.parse(uploadRes.data);
          if (response.code === 0 && response.data && response.data.url) {
            // 上传成功，进行食物识别
            this.recognizeFood(response.data.url);
          } else {
            uni.hideLoading();
            uni.showToast({
              title: response.message || '图片上传失败',
              icon: 'none'
            });
            this.showManualInput = true;
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          this.showManualInput = true;
        }
      });
    },
    
    // 识别食物
    recognizeFood(imageUrl) {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      
      uni.request({
        url: '/api/nutrition/recognize-food',
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: {
          imageUrl: imageUrl
        },
        success: (res) => {
          uni.hideLoading();
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
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          this.showManualInput = true;
        }
      });
    },
    
    onManualSubmit(foodData) {
      // 处理手动输入的食物数据
      uni.showLoading({
        title: '提交中...'
      });
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      
      uni.request({
        url: '/api/nutrition/food-intake',
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: {
          foodId: foodData.foodId,
          amount: foodData.amount,
          mealType: foodData.mealType || 'snack',
          notes: foodData.notes || ''
        },
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
