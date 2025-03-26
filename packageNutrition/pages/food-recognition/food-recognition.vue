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
          if (res.data.code === 0) {
            this.recognitionResult = res.data.data;
            
            // 自动记录食物摄入，无需用户确认
            if (res.data.data && res.data.data.length > 0) {
              this.autoRecordFoodIntake(res.data.data);
            }
          } else {
            uni.showToast({
              title: res.data.message || '识别失败',
              icon: 'none'
            });
            this.showManualInput = true;
          }
          uni.hideLoading();
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
    
    // 自动记录食物摄入
    autoRecordFoodIntake(recognizedFoods) {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      
      let successCount = 0;
      let totalCount = recognizedFoods.length;
      
      recognizedFoods.forEach(food => {
        // 构建食物摄入数据
        const foodIntakeData = {
          foodId: food.id || food.foodId, // 确保包含食物ID
          amount: food.amount || 100, // 默认100g
          mealType: this.getCurrentMealType(), // 根据当前时间确定餐食类型
          timestamp: new Date().toISOString(),
          notes: `通过AI识别自动添加，置信度: ${food.confidence || '未知'}`
        };
        
        // 提交数据
        uni.request({
          url: '/api/nutrition/food-intake',
          method: 'POST',
          header: {
            'Authorization': 'Bearer ' + token
          },
          data: foodIntakeData,
          success: (res) => {
            if (res.data.code === 0) {
              successCount++;
              
              // 所有食物都处理完毕
              if (successCount === totalCount) {
                uni.showToast({
                  title: `成功记录${successCount}种食物`,
                  icon: 'success'
                });
                
                // 返回上一页
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              }
            } else {
              uni.showToast({
                title: res.data.message || '记录失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: '网络请求失败',
              icon: 'none'
            });
          }
        });
      });
    },
    
    // 根据当前时间确定餐食类型
    getCurrentMealType() {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 10) {
        return 'breakfast';
      } else if (hour >= 10 && hour < 14) {
        return 'lunch';
      } else if (hour >= 14 && hour < 17) {
        return 'snack';
      } else if (hour >= 17 && hour < 21) {
        return 'dinner';
      } else {
        return 'snack';
      }
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
