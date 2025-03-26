<template>
  <view class="food-manual-input">
    <view class="input-header">
      <text class="input-title">手动录入</text>
    </view>
    
    <u-form :model="foodData" :rules="rules" ref="foodForm" label-width="180">
      <u-form-item label="食物名称" prop="foodName">
        <u-input v-model="foodData.foodName" placeholder="请输入食物名称" />
      </u-form-item>
      
      <u-form-item label="热量(卡路里)" prop="calories">
        <u-input v-model="foodData.calories" type="number" placeholder="请输入热量" />
      </u-form-item>
      
      <u-form-item label="蛋白质(克)" prop="protein">
        <u-input v-model="foodData.protein" type="number" placeholder="请输入蛋白质含量" />
      </u-form-item>
      
      <u-form-item label="碳水化合物(克)" prop="carbs">
        <u-input v-model="foodData.carbs" type="number" placeholder="请输入碳水化合物含量" />
      </u-form-item>
      
      <u-form-item label="脂肪(克)" prop="fat">
        <u-input v-model="foodData.fat" type="number" placeholder="请输入脂肪含量" />
      </u-form-item>
      
      <u-form-item label="份量" prop="portion">
        <u-number-box v-model="foodData.portion" :min="0.5" :max="10" :step="0.5"></u-number-box>
      </u-form-item>
    </u-form>
    
    <view class="action-buttons">
      <u-button type="primary" @click="submitForm">提交</u-button>
      <u-button type="default" @click="cancelInput">取消</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      foodData: {
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        portion: 1
      },
      rules: {
        foodName: [
          { required: true, message: '请输入食物名称', trigger: 'blur' }
        ],
        calories: [
          { required: true, message: '请输入热量', trigger: 'blur' },
          { type: 'number', message: '热量必须为数字', trigger: ['blur', 'change'] }
        ],
        protein: [
          { required: true, message: '请输入蛋白质含量', trigger: 'blur' },
          { type: 'number', message: '蛋白质含量必须为数字', trigger: ['blur', 'change'] }
        ],
        carbs: [
          { required: true, message: '请输入碳水化合物含量', trigger: 'blur' },
          { type: 'number', message: '碳水化合物含量必须为数字', trigger: ['blur', 'change'] }
        ],
        fat: [
          { required: true, message: '请输入脂肪含量', trigger: 'blur' },
          { type: 'number', message: '脂肪含量必须为数字', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.foodForm.validate(valid => {
        if (valid) {
          // 处理表单数据
          const formattedData = {
            foodName: this.foodData.foodName,
            calories: Number(this.foodData.calories),
            protein: Number(this.foodData.protein),
            carbs: Number(this.foodData.carbs),
            fat: Number(this.foodData.fat),
            portion: this.foodData.portion
          };
          
          // 发送表单数据
          this.$emit('submit', {
            food: formattedData,
            recordTime: new Date().getTime()
          });
        }
      });
    },
    
    cancelInput() {
      // 返回上一页
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">
@import "./food-manual-input.scss";
</style>
