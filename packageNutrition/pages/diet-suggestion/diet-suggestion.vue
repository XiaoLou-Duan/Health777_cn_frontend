<template>
  <view class="diet-suggestion-container">
    <u-navbar title="个性化饮食建议" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <user-profile :userProfile="userProfile"></user-profile>
      <diet-plan :dietPlan="dietPlan"></diet-plan>
      <food-recommendation :recommendations="foodRecommendations"></food-recommendation>
    </view>
  </view>
</template>

<script>
import userProfile from './components/user-profile.vue'
import dietPlan from './components/diet-plan.vue'
import foodRecommendation from './components/food-recommendation.vue'

export default {
  components: {
    userProfile,
    dietPlan,
    foodRecommendation
  },
  data() {
    return {
      userProfile: {
        age: 0,
        gender: '',
        height: 0,
        weight: 0,
        activity: '',
        goal: '',
        bmi: 0
      },
      dietPlan: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meals: []
      },
      foodRecommendations: []
    }
  },
  onLoad() {
    this.loadDietData();
  },
  methods: {
    loadDietData() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取用户档案数据
      uni.request({
        url: '/api/nutrition/user-profile',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.userProfile = res.data.data;
          }
        }
      });
      
      // 获取饮食计划数据
      uni.request({
        url: '/api/nutrition/diet-plan',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.dietPlan = res.data.data;
          }
        }
      });
      
      // 获取食物推荐数据
      uni.request({
        url: '/api/nutrition/food-recommendations',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.foodRecommendations = res.data.data;
          }
          
          uni.hideLoading();
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
@import "./diet-suggestion.scss";
</style>
