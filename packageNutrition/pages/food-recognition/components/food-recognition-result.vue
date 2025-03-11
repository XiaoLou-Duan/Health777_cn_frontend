<template>
  <view class="food-recognition-result">
    <view class="result-header">
      <text class="result-title">识别结果</text>
      <u-icon name="edit-pen" color="#2979ff" size="32" @click="onEditResult"></u-icon>
    </view>
    
    <view class="food-info">
      <text class="food-name">{{ result.foodName }}</text>
      <view class="nutrition-data">
        <view class="nutrition-item">
          <text class="label">热量</text>
          <text class="value">{{ result.calories }}卡路里</text>
        </view>
        <view class="nutrition-item">
          <text class="label">蛋白质</text>
          <text class="value">{{ result.protein }}克</text>
        </view>
        <view class="nutrition-item">
          <text class="label">碳水化合物</text>
          <text class="value">{{ result.carbs }}克</text>
        </view>
        <view class="nutrition-item">
          <text class="label">脂肪</text>
          <text class="value">{{ result.fat }}克</text>
        </view>
      </view>
    </view>
    
    <view class="portion-control">
      <text class="portion-label">份量:</text>
      <view class="stepper-container">
        <u-number-box v-model="portion" :min="0.5" :max="10" :step="0.5"></u-number-box>
        <text class="unit">份</text>
      </view>
    </view>
    
    <view class="action-buttons">
      <u-button type="primary" @click="onConfirm">确认添加</u-button>
      <u-button type="default" @click="onCancel">取消</u-button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      portion: 1,
    }
  },
  methods: {
    onEditResult() {
      this.$parent.showManualInput = true;
    },
    
    onConfirm() {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      
      // 计算调整后的营养数据
      const adjustedAmount = Math.round(this.result.amount * this.portion);
      
      // 提交数据
      uni.request({
        url: '/api/nutrition/food-intake',
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: {
          foodId: this.result.foodId, // 确保结果中包含foodId
          amount: adjustedAmount,
          mealType: 'meal', // 可以添加选择餐食类型的功能
          timestamp: new Date().toISOString(),
          notes: `通过AI识别添加，置信度: ${this.result.confidence || '未知'}`
        },
        success: (res) => {
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
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    
    onCancel() {
      // 返回上一页
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">
@import "./food-recognition-result.scss";
</style>
