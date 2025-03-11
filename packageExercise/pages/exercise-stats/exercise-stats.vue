<template>
  <view class="exercise-stats-container">
    <u-navbar title="运动成果统计" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="stats-overview">
        <view class="overview-header">
          <text class="overview-title">运动概览</text>
          <view class="time-selector">
            <view 
              class="time-item" 
              v-for="(item, index) in timeRanges" 
              :key="index"
              :class="{ active: currentTimeRange === item.value }"
              @click="switchTimeRange(item.value)"
            >
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
          <qiun-data-charts 
            type="line"
            :chartData="chartData"
            background="#FFFFFF"
          />
        </view>
      </view>
      
      <view class="exercise-distribution">
        <view class="distribution-header">
          <text class="distribution-title">运动类型分布</text>
        </view>
        <view class="distribution-chart">
          <qiun-data-charts 
            type="pie"
            :chartData="pieChartData"
            background="#FFFFFF"
          />
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
              <u-line-progress 
                :percentage="record.accuracy" 
                :show-text="false" 
                height="10" 
                :active-color="getAccuracyColor(record.accuracy)"
              ></u-line-progress>
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
        series: []
      },
      recentRecords: []
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
        color: #333333;
      }
      
      .time-selector {
        display: flex;
        
        .time-item {
          padding: 6rpx 20rpx;
          font-size: 24rpx;
          color: #666666;
          margin-left: 10rpx;
          border-radius: 30rpx;
          
          &.active {
            background-color: rgba(41, 121, 255, 0.1);
            color: #2979ff;
          }
        }
      }
    }
    
    .overview-cards {
      display: flex;
      justify-content: space-between;
      
      .overview-card {
        flex: 1;
        background-color: #f8f8f8;
        padding: 20rpx;
        border-radius: 8rpx;
        margin: 0 10rpx;
        
        &:first-child {
          margin-left: 0;
        }
        
        &:last-child {
          margin-right: 0;
        }
        
        .card-label {
          font-size: 24rpx;
          color: #999999;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .card-value {
          font-size: 36rpx;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
  
  .stats-chart, .exercise-distribution {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .chart-header, .distribution-header {
      margin-bottom: 20rpx;
      
      .chart-title, .distribution-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .chart-wrapper, .distribution-chart {
      height: 500rpx;
    }
  }
  
  .exercise-records {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .records-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .records-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .view-all {
        font-size: 26rpx;
        color: #2979ff;
      }
    }
    
    .record-list {
      .record-item {
        padding: 20rpx 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .record-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16rpx;
          
          .record-type {
            .type-name {
              font-size: 28rpx;
              font-weight: 500;
              color: #333333;
              display: block;
              margin-bottom: 6rpx;
            }
            
            .record-time {
              font-size: 24rpx;
              color: #999999;
            }
          }
          
          .record-data {
            text-align: right;
            
            .data-item {
              font-size: 26rpx;
              color: #666666;
              display: block;
              margin-bottom: 6rpx;
              
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        
        .record-progress {
          .progress-text {
            font-size: 24rpx;
            color: #999999;
            margin-top: 6rpx;
            display: block;
          }
        }
      }
      
      .empty-records {
        padding: 30rpx 0;
      }
    }
  }
}
</style>
