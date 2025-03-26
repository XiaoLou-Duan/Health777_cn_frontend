<template>
  <view class="food-recommendation">
    <view class="recommendation-header">
      <text class="recommendation-title">推荐食物</text>
    </view>
    
    <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
      <view class="category-list">
        <view 
          class="category-item" 
          v-for="(category, index) in categories" 
          :key="index"
          :class="{ active: currentCategory === category.value }"
          @click="switchCategory(category.value)"
        >
          {{ category.name }}
        </view>
      </view>
    </scroll-view>
    
    <view class="food-list">
      <view class="food-card" v-for="(food, index) in filteredFoods" :key="index">
        <image class="food-image" :src="food.image" mode="aspectFill"></image>
        <view class="food-info">
          <text class="food-name">{{ food.name }}</text>
          <text class="food-desc">{{ food.description }}</text>
          <view class="food-nutrition">
            <text class="nutrition-item">热量: {{ food.calories }}千卡</text>
            <text class="nutrition-item">蛋白质: {{ food.protein }}g</text>
          </view>
        </view>
      </view>
      
      <view class="empty-list" v-if="filteredFoods.length === 0">
        <u-empty mode="data" text="暂无推荐食物" marginTop="40"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    recommendations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentCategory: 'all',
      categories: [
        { name: '全部', value: 'all' },
        { name: '高蛋白', value: 'high_protein' },
        { name: '低脂肪', value: 'low_fat' },
        { name: '低糖', value: 'low_sugar' },
        { name: '高纤维', value: 'high_fiber' }
      ]
    }
  },
  computed: {
    filteredFoods() {
      if (this.currentCategory === 'all') {
        return this.recommendations;
      }
      
      return this.recommendations.filter(food => food.categories.includes(this.currentCategory));
    }
  },
  methods: {
    switchCategory(category) {
      this.currentCategory = category;
    }
  }
}
</script>

<style lang="scss">
@import "./food-recommendation.scss";
</style>
