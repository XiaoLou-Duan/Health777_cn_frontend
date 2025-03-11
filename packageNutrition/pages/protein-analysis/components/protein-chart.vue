<template>
  <view class="protein-chart">
    <view class="chart-header">
      <text class="chart-title">一周蛋白质摄入趋势</text>
    </view>
    <view class="chart-wrapper">
      <qiun-data-charts 
        type="column"
        :chartData="chartOptions"
        background="#FFFFFF"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        categories: this.chartData.dates,
        series: [
          {
            name: '蛋白质摄入',
            data: this.chartData.values,
            color: '#2979ff'
          },
          {
            name: '目标摄入',
            data: Array(this.chartData.dates.length).fill(this.chartData.target),
            color: '#ff9900',
            type: 'line'
          }
        ]
      };
    }
  }
}
</script>

<style lang="scss">
@import "./protein-chart.scss";
</style>
