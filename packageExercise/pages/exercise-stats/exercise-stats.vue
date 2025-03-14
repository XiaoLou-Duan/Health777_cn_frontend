<template>
  <view class="exercise-stats-container">
    <u-navbar title="运动成果统计" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="stats-overview">
        <view class="overview-header">
          <text class="overview-title">运动概览</text>
          <view class="time-selector">
            <view class="time-item" v-for="(item, index) in timeRanges" :key="index"
              :class="{ active: currentTimeRange === item.value }" @click="switchTimeRange(item.value)">
              {{ item.name }}
            </view>
          </view>
        </view>

        <view class="overview-cards">
          <view class="overview-card">
            <text class="card-label">总运动次数</text>
            <text class="card-value">{{ overviewData.totalCount }}</text>
          </view>

          <view class="overview-card">
            <text class="card-label">总运动时长</text>
            <text class="card-value">{{ overviewData.totalDuration }}分钟</text>
          </view>

          <view class="overview-card">
            <text class="card-label">消耗热量</text>
            <text class="card-value">{{ overviewData.totalCalories }}千卡</text>
          </view>
        </view>
      </view>

      <view class="stats-chart">
        <view class="chart-header">
          <text class="chart-title">运动趋势</text>
        </view>
        <view class="chart-wrapper">
          <!-- 替换为自定义折线图 -->
          <view class="custom-line-chart">
            <view class="chart-legend">
              <view v-for="(item, index) in chartData.series" :key="index" class="legend-item">
                <view class="legend-color" :style="{ backgroundColor: item.color }"></view>
                <text class="legend-text">{{ item.name }}</text>
              </view>
            </view>
            <view class="chart-area">
              <view class="y-axis">
                <text v-for="(val, index) in yAxisValues" :key="index" class="y-axis-label">{{ val }}</text>
              </view>
              <view class="chart-content" v-if="chartData.categories.length > 0">
                <view v-for="(series, sIndex) in chartData.series" :key="sIndex" class="line-series">
                  <view class="data-point" v-for="(value, index) in series.data" :key="index" :style="{
                    left: `${index * (100 / (chartData.categories.length - 1))}%`,
                    bottom: `${(value / maxValue) * 100}%`,
                    borderColor: series.color
                  }"></view>
                  <view></view>
                </view>
              </view>
              <view class="x-axis">
                <text v-for="(category, index) in chartData.categories" :key="index" class="x-axis-label"
                  :style="{ left: `${index * (100 / (chartData.categories.length - 1))}%` }">
                  {{ category }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="exercise-distribution">
        <view class="distribution-header">
          <text class="distribution-title">运动类型分布</text>
        </view>
        <view class="distribution-chart">
          <!-- 替换为自定义饼图 -->
          <view class="custom-pie-chart">
            <view class="pie-container">
              <view v-for="(segment, index) in pieSegments" :key="index" class="pie-segment" :style="{
                transform: `rotate(${segment.startAngle}deg)`,
                'clip-path': `polygon(50% 50%, 50% 0%, ${calculateCoordinates(segment.angle)} 50% 0%)`,
                'background-color': pieColors[index % pieColors.length]
              }"></view>
            </view>
            <view class="pie-legend">
              <view v-for="(item, index) in pieChartData.series[0].data" :key="index" class="legend-item">
                <view class="legend-color" :style="{ backgroundColor: pieColors[index % pieColors.length] }"></view>
                <view class="legend-info">
                  <text class="legend-name">{{ item.name }}</text>
                  <text class="legend-value">{{ item.value }}次 ({{ getPercentage(item.value) }}%)</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="exercise-records">
        <view class="records-header">
          <text class="records-title">最近运动记录</text>
          <text class="view-all" @click="navigateToAllRecords">查看全部</text>
        </view>

        <view class="record-list">
          <view class="record-item" v-for="(record, index) in recentRecords" :key="index">
            <view class="record-info">
              <view class="record-type">
                <text class="type-name">{{ record.type }}</text>
                <text class="record-time">{{ formatTime(record.time) }}</text>
              </view>
              <view class="record-data">
                <text class="data-item">{{ record.duration }}分钟</text>
                <text class="data-item">{{ record.calories }}千卡</text>
              </view>
            </view>
            <view class="record-progress">
              <u-line-progress :percentage="record.accuracy" :show-text="false" height="10"
                :active-color="getAccuracyColor(record.accuracy)"></u-line-progress>
              <text class="progress-text">完成度 {{ record.accuracy }}%</text>
            </view>
          </view>

          <view class="empty-records" v-if="recentRecords.length === 0">
            <u-empty mode="data" text="暂无运动记录" marginTop="40"></u-empty>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTimeRange: 'week',
      timeRanges: [
        { name: '本周', value: 'week' },
        { name: '本月', value: 'month' },
        { name: '全部', value: 'all' }
      ],
      overviewData: {
        totalCount: 0,
        totalDuration: 0,
        totalCalories: 0
      },
      chartData: {
        categories: [],
        series: []
      },
      pieChartData: {
        series: [{
          data: []
        }]
      },
      recentRecords: [],
      pieColors: ['#2979ff', '#19be6b', '#ff9900', '#fa3534', '#9c26b0', '#0081ef', '#3dc7be'],
      maxValue: 100,
      yAxisValues: [0, 25, 50, 75, 100],
      // 示例数据
      mockData: {
        overview: {
          week: { totalCount: 5, totalDuration: 150, totalCalories: 452 },
          month: { totalCount: 18, totalDuration: 573, totalCalories: 1734 },
          all: { totalCount: 42, totalDuration: 1253, totalCalories: 3762 }
        },
        trend: {
          week: {
            dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            durations: [30, 0, 45, 0, 25, 20, 30],
            calories: [95, 0, 135, 0, 76, 56, 90]
          },
          month: {
            dates: ['第1周', '第2周', '第3周', '第4周'],
            durations: [125, 150, 98, 200],
            calories: [370, 452, 312, 600]
          },
          all: {
            dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
            durations: [230, 180, 315, 210, 175, 143],
            calories: [690, 540, 945, 630, 525, 432]
          }
        },
        distribution: {
          week: [
            { type: '跑步', count: 2 },
            { type: '瑜伽', count: 1 },
            { type: '健身', count: 1 },
            { type: '游泳', count: 1 }
          ],
          month: [
            { type: '跑步', count: 7 },
            { type: '瑜伽', count: 4 },
            { type: '健身', count: 5 },
            { type: '游泳', count: 2 }
          ],
          all: [
            { type: '跑步', count: 18 },
            { type: '瑜伽', count: 9 },
            { type: '健身', count: 11 },
            { type: '游泳', count: 4 }
          ]
        },
        records: [
          {
            type: '跑步',
            time: Date.now() - 86400000,
            duration: 30,
            calories: 95,
            accuracy: 92
          },
          {
            type: '瑜伽',
            time: Date.now() - 86400000 * 3,
            duration: 45,
            calories: 135,
            accuracy: 88
          },
          {
            type: '健身',
            time: Date.now() - 86400000 * 5,
            duration: 25,
            calories: 76,
            accuracy: 75
          },
          {
            type: '游泳',
            time: Date.now() - 86400000 * 6,
            duration: 20,
            calories: 56,
            accuracy: 95
          },
          {
            type: '跑步',
            time: Date.now() - 86400000 * 7,
            duration: 30,
            calories: 90,
            accuracy: 82
          }
        ]
      },
      // 是否使用示例数据（在实际开发中可以设置为false调用真实API）
      useMockData: true
    }
  },
  computed: {
    pieSegments() {
      if (!this.pieChartData.series[0] || !this.pieChartData.series[0].data.length) {
        return [];
      }

      const total = this.pieChartData.series[0].data.reduce((sum, item) => sum + item.value, 0);
      let startAngle = 0;

      return this.pieChartData.series[0].data.map(item => {
        const angle = (item.value / total) * 360;
        const segment = {
          value: item.value,
          startAngle,
          angle
        };
        startAngle += angle;
        return segment;
      });
    }
  },
  onLoad() {
    this.loadStatsData();
  },
  methods: {
    loadStatsData() {
      uni.showLoading({
        title: '加载中...'
      });

      if (this.useMockData) {
        // 使用示例数据
        setTimeout(() => {
          // 获取概览数据
          this.overviewData = this.mockData.overview[this.currentTimeRange];

          // 获取趋势图数据
          const trendData = this.mockData.trend[this.currentTimeRange];
          this.chartData = {
            categories: trendData.dates,
            series: [
              {
                name: '运动时长(分钟)',
                data: trendData.durations,
                color: '#2979ff'
              },
              {
                name: '消耗热量(千卡)',
                data: trendData.calories,
                color: '#ff9900'
              }
            ]
          };

          // 计算Y轴最大值
          const allValues = [...trendData.durations, ...trendData.calories];
          if (allValues.length) {
            const max = Math.max(...allValues);
            this.maxValue = Math.ceil(max / 25) * 25; // 向上取整到最近的25的倍数
            this.yAxisValues = Array(5).fill(0).map((_, i) => Math.round(this.maxValue / 4 * i));
          }

          // 获取运动类型分布
          this.pieChartData = {
            series: [
              {
                data: this.mockData.distribution[this.currentTimeRange].map(item => ({
                  name: item.type,
                  value: item.count
                }))
              }
            ]
          };

          // 获取最近运动记录
          this.recentRecords = this.mockData.records;

          uni.hideLoading();
        }, 500); // 模拟网络延迟
        return;
      }

      // 以下是原来的API调用代码
      // 获取概览数据
      uni.request({
        url: '/api/exercise/stats/overview',
        method: 'GET',
        data: {
          timeRange: this.currentTimeRange
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.overviewData = res.data.data;
          }
        }
      });

      // 获取趋势图数据
      uni.request({
        url: '/api/exercise/stats/trend',
        method: 'GET',
        data: {
          timeRange: this.currentTimeRange
        },
        success: (res) => {
          if (res.data.code === 0) {
            const data = res.data.data;
            this.chartData = {
              categories: data.dates,
              series: [
                {
                  name: '运动时长(分钟)',
                  data: data.durations,
                  color: '#2979ff'
                },
                {
                  name: '消耗热量(千卡)',
                  data: data.calories,
                  color: '#ff9900'
                }
              ]
            };

            // 计算Y轴最大值
            const allValues = [...data.durations, ...data.calories];
            if (allValues.length) {
              const max = Math.max(...allValues);
              this.maxValue = Math.ceil(max / 25) * 25; // 向上取整到最近的25的倍数
              this.yAxisValues = Array(5).fill(0).map((_, i) => Math.round(this.maxValue / 4 * i));
            }
          }
        }
      });

      // 获取运动类型分布
      uni.request({
        url: '/api/exercise/stats/distribution',
        method: 'GET',
        data: {
          timeRange: this.currentTimeRange
        },
        success: (res) => {
          if (res.data.code === 0) {
            const data = res.data.data;
            this.pieChartData = {
              series: [
                {
                  data: data.map(item => ({
                    name: item.type,
                    value: item.count
                  }))
                }
              ]
            };
          }
        }
      });

      // 获取最近运动记录
      uni.request({
        url: '/api/exercise/records/recent',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.recentRecords = res.data.data;
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
    },
    calculateCoordinates(angle) {
      // 计算饼图分段的坐标点
      if (angle >= 180) {
        return '100% 0%,';
      } else if (angle > 90) {
        const rads = (angle - 90) * Math.PI / 180;
        const y = 50 + 50 * Math.tan(rads);
        return `100% ${y}%,`;
      } else {
        const rads = (90 - angle) * Math.PI / 180;
        const x = 50 + 50 * Math.tan(rads);
        return `${x}% 0%,`;
      }
    },
    getPercentage(value) {
      if (!this.pieChartData.series[0] || !this.pieChartData.series[0].data.length) {
        return 0;
      }

      const total = this.pieChartData.series[0].data.reduce((sum, item) => sum + item.value, 0);
      return Math.round((value / total) * 100);
    },
    switchTimeRange(range) {
      this.currentTimeRange = range;
      this.loadStatsData();
    },
    formatTime(timestamp) {
      if (!timestamp) return '';

      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    getAccuracyColor(accuracy) {
      if (accuracy >= 90) {
        return '#19be6b'; // 绿色 - 优秀
      } else if (accuracy >= 70) {
        return '#2979ff'; // 蓝色 - 良好
      } else if (accuracy >= 50) {
        return '#ff9900'; // 橙色 - 一般
      } else {
        return '#fa3534'; // 红色 - 不佳
      }
    },
    navigateToAllRecords() {
      uni.navigateTo({
        url: './records/exercise-records'
      });
    }
  }
}
</script>

<style lang="scss">
.exercise-stats-container {
  min-height: 100vh;
  background-color: #f8f8f8;

  .content-wrapper {
    padding: 20rpx;
  }

  // 运动概览部分
  .stats-overview {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .overview-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .time-selector {
        display: flex;
        background-color: #f5f7fa;
        border-radius: 30rpx;
        padding: 6rpx;

        .time-item {
          padding: 10rpx 24rpx;
          font-size: 24rpx;
          color: #666;
          border-radius: 30rpx;

          &.active {
            background-color: #2979ff;
            color: #ffffff;
          }
        }
      }
    }

    .overview-cards {
      display: flex;
      justify-content: space-between;

      .overview-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 0;

        .card-label {
          font-size: 26rpx;
          color: #666;
          margin-bottom: 16rpx;
        }

        .card-value {
          font-size: 40rpx;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  // 图表部分
  .stats-chart {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .chart-header {
      margin-bottom: 30rpx;

      .chart-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .chart-wrapper {
      .custom-line-chart {
        .chart-legend {
          display: flex;
          justify-content: center;
          margin-bottom: 20rpx;

          .legend-item {
            display: flex;
            align-items: center;
            margin: 0 16rpx;

            .legend-color {
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
              margin-right: 8rpx;
            }

            .legend-text {
              font-size: 24rpx;
              color: #666;
            }
          }
        }

        .chart-area {
          position: relative;
          height: 400rpx;
          margin-top: 30rpx;
          padding-left: 60rpx;
          padding-bottom: 60rpx;

          .y-axis {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 60rpx;
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;

            .y-axis-label {
              font-size: 22rpx;
              color: #999;
              transform: translateY(50%);
            }
          }

          .chart-content {
            position: relative;
            height: 100%;
            border-bottom: 1rpx solid #eee;
            border-left: 1rpx solid #eee;

            .line-series {
              position: absolute;
              width: 100%;
              height: 100%;

              .data-point {
                position: absolute;
                width: 12rpx;
                height: 12rpx;
                border-radius: 50%;
                background-color: #fff;
                border-width: 2rpx;
                border-style: solid;
                transform: translate(-50%, 50%);
              }
            }
          }

          .x-axis {
            position: absolute;
            bottom: 0;
            left: 60rpx;
            right: 0;
            height: 60rpx;

            .x-axis-label {
              position: absolute;
              font-size: 22rpx;
              color: #999;
              transform: translateX(-50%);
              bottom: 20rpx;
            }
          }
        }
      }
    }
  }

  // 运动类型分布部分
  .exercise-distribution {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .distribution-header {
      margin-bottom: 30rpx;

      .distribution-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .distribution-chart {
      .custom-pie-chart {
        display: flex;
        flex-direction: column;
        align-items: center;

        .pie-container {
          position: relative;
          width: 300rpx;
          height: 300rpx;
          border-radius: 50%;
          overflow: hidden;

          .pie-segment {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform-origin: 50% 50%;

            &::before {
              content: '';
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        .pie-legend {
          margin-top: 40rpx;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          .legend-item {
            display: flex;
            align-items: center;
            margin: 10rpx 20rpx;
            min-width: 240rpx;

            .legend-color {
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
              margin-right: 12rpx;
            }

            .legend-info {
              display: flex;
              flex-direction: column;

              .legend-name {
                font-size: 26rpx;
                color: #333;
              }

              .legend-value {
                font-size: 22rpx;
                color: #999;
              }
            }
          }
        }
      }
    }
  }

  // 运动记录部分
  .exercise-records {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .records-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .records-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .view-all {
        font-size: 26rpx;
        color: #2979ff;
      }
    }

    .record-list {
      .record-item {
        padding: 24rpx 0;
        border-bottom: 1rpx solid #f2f2f2;

        &:last-child {
          border-bottom: none;
        }

        .record-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16rpx;

          .record-type {
            .type-name {
              font-size: 30rpx;
              font-weight: bold;
              color: #333;
              margin-right: 16rpx;
            }

            .record-time {
              font-size: 24rpx;
              color: #999;
            }
          }

          .record-data {
            display: flex;

            .data-item {
              font-size: 26rpx;
              color: #666;
              margin-left: 20rpx;
            }
          }
        }

        .record-progress {
          .progress-text {
            font-size: 24rpx;
            color: #666;
            margin-top: 10rpx;
          }
        }
      }

      .empty-records {
        padding: 60rpx 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
