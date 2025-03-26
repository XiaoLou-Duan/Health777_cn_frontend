<template>
  <view class="diet-plan">
    <view class="plan-header">
      <text class="plan-title">个性化饮食计划</text>
    </view>
    
    <view class="nutrition-summary">
      <view class="nutrition-item">
        <text class="item-label">每日热量</text>
        <text class="item-value">{{ dietPlan.calories }} 千卡</text>
      </view>
      <view class="nutrition-item">
        <text class="item-label">蛋白质</text>
        <text class="item-value">{{ dietPlan.protein }}g ({{ calculatePercentage(dietPlan.protein * 4, dietPlan.calories) }}%)</text>
      </view>
      <view class="nutrition-item">
        <text class="item-label">碳水化合物</text>
        <text class="item-value">{{ dietPlan.carbs }}g ({{ calculatePercentage(dietPlan.carbs * 4, dietPlan.calories) }}%)</text>
      </view>
      <view class="nutrition-item">
        <text class="item-label">脂肪</text>
        <text class="item-value">{{ dietPlan.fat }}g ({{ calculatePercentage(dietPlan.fat * 9, dietPlan.calories) }}%)</text>
      </view>
    </view>
    
    <view class="plan-chart">
      <qiun-data-charts 
        type="pie"
        :chartData="chartOptions"
        background="#FFFFFF"
      />
    </view>
    
    <view class="meals-section">
      <view class="section-title">推荐餐次安排</view>
      
      <view class="meal-item" v-for="(meal, index) in dietPlan.meals" :key="index">
        <view class="meal-header">
          <text class="meal-name">{{ meal.name }}</text>
          <text class="meal-calories">{{ meal.calories }} 千卡</text>
        </view>
        
        <view class="meal-foods">
          <view class="food-item" v-for="(food, foodIndex) in meal.foods" :key="foodIndex">
            <text class="food-name">{{ food.name }}</text>
            <text class="food-amount">{{ food.amount }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    dietPlan: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        series: [
          {
            data: [
              {
                name: '蛋白质',
                value: this.dietPlan.protein * 4,
                color: '#2979ff'
              },
              {
                name: '碳水化合物',
                value: this.dietPlan.carbs * 4,
                color: '#19be6b'
              },
              {
                name: '脂肪',
                value: this.dietPlan.fat * 9,
                color: '#ff9900'
              }
            ]
          }
        ]
      };
    }
  },
  methods: {
    calculatePercentage(partialCalories, totalCalories) {
      if (!totalCalories) return 0;
      const percentage = (partialCalories / totalCalories) * 100;
      return Math.round(percentage);
    }
  }
}
</script>

<style lang="scss">
@import "./diet-plan.scss";
</style>
