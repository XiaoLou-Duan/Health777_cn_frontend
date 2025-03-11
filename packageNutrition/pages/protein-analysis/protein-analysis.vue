<template>
  <view class="protein-analysis-container">
    <u-navbar title="蛋白质分析" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <protein-summary :summary="proteinSummary"></protein-summary>
      <protein-chart :chartData="weeklyProteinData"></protein-chart>
      <protein-suggestion :suggestions="proteinSuggestions"></protein-suggestion>
    </view>
  </view>
</template>

<script>
import proteinSummary from './components/protein-summary.vue'
import proteinChart from './components/protein-chart.vue'
import proteinSuggestion from './components/protein-suggestion.vue'

export default {
  components: {
    proteinSummary,
    proteinChart,
    proteinSuggestion
  },
  data() {
    return {
      proteinSummary: {
        today: 0,
        target: 0,
        weekAverage: 0,
        completion: 0
      },
      weeklyProteinData: {
        dates: [],
        values: [],
        target: 0
      },
      proteinSuggestions: []
    }
  },
  onLoad() {
    this.loadProteinData();
  },
  methods: {
    loadProteinData() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      // 获取蛋白质摄入汇总数据
      uni.request({
        url: '/api/nutrition/protein-stats/summary',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.proteinSummary = res.data.data;
          }
        }
      });
      
      // 获取周蛋白质摄入数据
      uni.request({
        url: '/api/nutrition/protein-stats/weekly',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.weeklyProteinData = res.data.data;
          }
        }
      });
      
      // 获取蛋白质摄入建议
      uni.request({
        url: '/api/nutrition/diet-suggestions',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.proteinSuggestions = res.data.data;
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
@import "./protein-analysis.scss";
</style>
