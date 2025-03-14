<template>
  <view class="protein-analysis-container">
    <u-navbar
      title="蛋白质分析"
      :border="false"
      back-icon-color="#333333"
    ></u-navbar>
    <view class="content-wrapper">
      <protein-summary :summary="proteinSummary"></protein-summary>
      <protein-chart :chartData="weeklyProteinData"></protein-chart>
      <protein-suggestion
        :suggestions="proteinSuggestions"
      ></protein-suggestion>
    </view>
  </view>
</template>

<script>
import proteinSummary from "./components/protein-summary.vue";
import proteinChart from "./components/protein-chart.vue";
import proteinSuggestion from "./components/protein-suggestion.vue";

export default {
  components: {
    proteinSummary,
    proteinChart,
    proteinSuggestion,
  },
  data() {
    return {
      proteinSummary: {
        today: 0,
        target: 0,
        weekAverage: 0,
        completion: 0,
      },
      weeklyProteinData: {
        dates: [],
        values: [],
        target: 0,
      },
      proteinSuggestions: [],
      // 是否使用模拟数据
      useMockData: true,
      // 模拟数据
      mockData: {
        summary: {
          today: 65,
          target: 80,
          weekAverage: 72,
          completion: 81,
        },
        weeklyData: {
          dates: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          values: [78, 65, 83, 70, 62, 68, 76],
          target: 80,
        },
        suggestions: [
          {
            icon: "info-circle-fill",
            content:
              "根据您的个人情况，建议每日摄入蛋白质80克，这有助于维持肌肉健康和促进新陈代谢。",
            source: "中国营养学会膳食指南",
          },
          {
            icon: "checkmark-circle-fill",
            content:
              "增加摄入瘦肉、鱼类、蛋类和豆制品等优质蛋白质食物，可以帮助您达到每日蛋白质目标。",
            source: "美国运动医学会",
          },
          {
            icon: "bell-fill",
            content:
              "您本周蛋白质摄入水平略低于目标值，建议适当增加蛋白质摄入。",
            source: "营养分析系统",
          },
          {
            icon: "clock-fill",
            content: "运动后30分钟内补充蛋白质，能够更好地促进肌肉修复和生长。",
            source: "国际运动营养学会",
          },
        ],
      },
    };
  },
  onLoad() {
    this.loadProteinData();
  },
  methods: {
    loadProteinData() {
      uni.showLoading({
        title: "加载中...",
      });

      if (this.useMockData) {
        // 使用模拟数据
        setTimeout(() => {
          console.log("加载模拟数据...");

          // 加载蛋白质摄入汇总数据
          this.proteinSummary = {
            today: this.mockData.summary.today,
            target: this.mockData.summary.target,
            weekAverage: this.mockData.summary.weekAverage,
            completion: this.mockData.summary.completion,
          };

          // 加载周蛋白质摄入数据
          this.weeklyProteinData = {
            dates: this.mockData.weeklyData.dates,
            values: this.mockData.weeklyData.values,
            target: this.mockData.weeklyData.target,
          };

          // 加载蛋白质摄入建议
          this.proteinSuggestions = [...this.mockData.suggestions];

          uni.hideLoading();
          console.log(
            "模拟数据加载完成",
            this.proteinSummary,
            this.weeklyProteinData
          );
        }, 500); // 模拟网络延迟
        return;
      }

      // 获取认证信息
      const token = uni.getStorageSync("token") || "";
      const header = {
        Authorization: "Bearer " + token,
      };

      // 获取蛋白质摄入汇总数据
      uni.request({
        url: "/api/nutrition/protein-stats/summary",
        method: "GET",
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.proteinSummary = res.data.data;
          }
        },
      });

      // 获取周蛋白质摄入数据
      uni.request({
        url: "/api/nutrition/protein-stats/weekly",
        method: "GET",
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.weeklyProteinData = res.data.data;
          }
        },
      });

      // 获取蛋白质摄入建议
      uni.request({
        url: "/api/nutrition/diet-suggestions",
        method: "GET",
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
            title: "网络请求失败",
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.protein-analysis-container {
  min-height: 100vh;
  background-color: #f8f8f8;

  .content-wrapper {
    padding: 20rpx;
  }
}
</style>
