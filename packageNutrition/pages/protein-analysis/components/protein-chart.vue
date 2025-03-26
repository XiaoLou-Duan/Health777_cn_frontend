<template>
  <view class="protein-chart">
    <view class="chart-header">
      <text class="chart-title">一周蛋白质摄入趋势</text>
    </view>

    <view class="chart-wrapper">
      <view class="chart-legend">
        <view class="legend-item">
          <view class="legend-color bar-color"></view>
          <text class="legend-text">蛋白质摄入</text>
        </view>
        <view class="legend-item">
          <view class="legend-color line-color"></view>
          <text class="legend-text">目标摄入</text>
        </view>
      </view>

      <view class="custom-chart">
        <view class="y-axis">
          <text v-for="(value, index) in yAxisLabels" :key="index" class="axis-label">{{ value }}</text>
        </view>

        <view class="chart-area">
          <!-- 目标线 -->
          <view class="target-line" :style="{
            bottom: `${(chartData.target / maxValue) * 100}%`
          }"></view>

          <!-- 数据柱状图 -->
          <view class="chart-bars">
            <view v-for="(value, index) in chartData.values" :key="index" class="chart-bar" :style="{
              height: `${(value / maxValue) * 100}%`,
              left: `${index * (100 / (chartData.values.length - 1))}%`
            }">
              <view class="bar-value">{{ value }}</view>
            </view>
          </view>

          <view class="x-axis">
            <text v-for="(date, index) in chartData.dates" :key="index" class="axis-label" :style="{
              left: `${index * (100 / (chartData.dates.length - 1))}%`
            }">{{ date }}</text>
          </view>
        </view>
      </view>
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
    maxValue() {
      if (!this.chartData.values || this.chartData.values.length === 0) {
        return 100;
      }
      const allValues = [...this.chartData.values];
      if (this.chartData.target) {
        allValues.push(this.chartData.target);
      }
      const max = Math.max(...allValues);
      return Math.ceil(max / 10) * 10 + 20; // 向上取整到10的倍数并增加一点空间
    },
    yAxisLabels() {
      const step = this.maxValue / 5;
      return Array(6).fill(0).map((_, i) => Math.round(step * i));
    }
  }
}
</script>

<style lang="scss">
.protein-chart {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .chart-header {
    margin-bottom: 20rpx;

    .chart-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }

  .chart-wrapper {
    height: 500rpx;
    width: 100%;

    .chart-legend {
      display: flex;
      justify-content: center;
      margin-bottom: 20rpx;

      .legend-item {
        display: flex;
        align-items: center;
        margin: 0 20rpx;

        .legend-color {
          width: 20rpx;
          height: 20rpx;
          margin-right: 10rpx;

          &.bar-color {
            background-color: #2979ff;
          }

          &.line-color {
            background-color: #ff9900;
            border-radius: 0;
            height: 4rpx;
          }
        }

        .legend-text {
          font-size: 24rpx;
          color: #666666;
        }
      }
    }

    .custom-chart {
      position: relative;
      height: 400rpx;
      display: flex;
      margin-left: 60rpx;
      margin-top: 20rpx;

      .y-axis {
        position: absolute;
        left: -60rpx;
        top: 0;
        height: 100%;
        width: 60rpx;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;

        .axis-label {
          font-size: 22rpx;
          color: #999;
          transform: translateY(50%);
        }
      }

      .chart-area {
        position: relative;
        width: 100%;
        height: 100%;
        border-left: 1px solid #eee;
        border-bottom: 1px solid #eee;

        .target-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          border-top: 2px dashed #ff9900;
        }

        .chart-bars {
          position: relative;
          width: 100%;
          height: 100%;

          .chart-bar {
            position: absolute;
            bottom: 0;
            width: 30rpx;
            background-color: #2979ff;
            border-radius: 6rpx 6rpx 0 0;
            transform: translateX(-50%);

            .bar-value {
              position: absolute;
              top: -30rpx;
              left: 50%;
              transform: translateX(-50%);
              font-size: 20rpx;
              color: #666;
            }
          }
        }

        .x-axis {
          position: absolute;
          bottom: -30rpx;
          left: 0;
          width: 100%;

          .axis-label {
            position: absolute;
            font-size: 22rpx;
            color: #999;
            transform: translateX(-50%);
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
