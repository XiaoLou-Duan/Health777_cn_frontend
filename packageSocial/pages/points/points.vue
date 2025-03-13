<template>
  <view class="points-container">
    <u-navbar title="积分系统" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="points-overview">
        <view class="overview-header">
          <text class="overview-title">我的积分</text>
        </view>
        
        <view class="points-card">
          <view class="points-info">
            <text class="points-value">{{ userPoints.current }}</text>
            <text class="points-label">当前积分</text>
          </view>
          <view class="points-actions">
            <u-button type="primary" size="mini" @click="navigateToExchange">兑换奖励</u-button>
          </view>
        </view>
        
        <view class="level-info">
          <view class="level-header">
            <text class="level-name">{{ userPoints.levelName }}</text>
            <text class="level-progress">{{ userPoints.current }}/{{ userPoints.nextLevelPoints }}</text>
          </view>
          <u-line-progress 
            :percentage="calculateLevelPercentage(userPoints.current, userPoints.nextLevelPoints)" 
            :show-text="false" 
            height="16" 
            active-color="#ff9900"
          ></u-line-progress>
          <text class="level-tips">再获得{{ userPoints.nextLevelPoints - userPoints.current }}积分升级到{{ userPoints.nextLevelName }}</text>
        </view>
      </view>
      
      <view class="points-tasks">
        <view class="tasks-header">
          <text class="tasks-title">每日任务</text>
          <text class="tasks-info">{{ completedTasksCount }}/{{ dailyTasks.length }} 已完成</text>
        </view>
        
        <view class="task-list">
          <view class="task-item" v-for="(task, index) in dailyTasks" :key="index">
            <view class="task-info">
              <text class="task-name">{{ task.name }}</text>
              <text class="task-desc">{{ task.description }}</text>
            </view>
            <view class="task-reward">
              <text class="reward-value">+{{ task.points }}</text>
              <u-button 
                :type="task.completed ? 'info' : 'primary'" 
                size="mini" 
                :disabled="task.completed"
                @click="completeTask(task.id)"
              >
                {{ task.completed ? '已完成' : '去完成' }}
              </u-button>
            </view>
          </view>
        </view>
      </view>
      
      <view class="points-history">
        <view class="history-header">
          <text class="history-title">积分记录</text>
          <text class="view-all" @click="navigateToHistory">查看全部</text>
        </view>
        
        <view class="history-list">
          <view class="history-item" v-for="(record, index) in pointsHistory" :key="index">
            <view class="history-info">
              <text class="history-desc">{{ record.description }}</text>
              <text class="history-time">{{ formatTime(record.time) }}</text>
            </view>
            <text class="history-points" :class="{'points-add': record.points > 0, 'points-reduce': record.points < 0}">
              {{ record.points > 0 ? '+' : '' }}{{ record.points }}
            </text>
          </view>
          
          <view class="empty-history" v-if="pointsHistory.length === 0">
            <u-empty mode="data" text="暂无积分记录" marginTop="40"></u-empty>
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
      userPoints: {
        current: 2450,
        total: 5680,
        levelName: '健康达人Lv.15',
        nextLevelName: '健康达人Lv.16',
        nextLevelPoints: 3000
      },
      dailyTasks: [
        {
          id: 1,
          name: '每日签到',
          description: '连续签到可获得额外奖励',
          points: 10,
          completed: true
        },
        {
          id: 2,
          name: '浏览健康文章',
          description: '阅读至少3篇健康相关文章',
          points: 15,
          completed: true
        },
        {
          id: 3,
          name: '记录今日饮食',
          description: '使用营养模块记录一天的饮食',
          points: 20,
          completed: false
        },
        {
          id: 4,
          name: '分享健康心得',
          description: '在社区发表一篇健康相关帖子',
          points: 30,
          completed: false
        },
        {
          id: 5,
          name: '运动打卡',
          description: '记录今日的运动数据',
          points: 25,
          completed: true
        }
      ],
      pointsHistory: [
        {
          id: 101,
          description: '完成每日签到任务',
          points: 10,
          time: new Date(Date.now() - 2 * 3600000).getTime() // 2小时前
        },
        {
          id: 102,
          description: '完成运动打卡任务',
          points: 25,
          time: new Date(Date.now() - 5 * 3600000).getTime() // 5小时前
        },
        {
          id: 103,
          description: '阅读健康文章',
          points: 15,
          time: new Date(Date.now() - 6 * 3600000).getTime() // 6小时前
        },
        {
          id: 104,
          description: '兑换健身达人称号',
          points: -1000,
          time: new Date(Date.now() - 2 * 24 * 3600000).getTime() // 2天前
        },
        {
          id: 105,
          description: '发布原创健康经验贴',
          points: 50,
          time: new Date(Date.now() - 3 * 24 * 3600000).getTime() // 3天前
        }
      ]
    }
  },
  computed: {
    completedTasksCount() {
      return this.dailyTasks.filter(task => task.completed).length;
    }
  },
  onLoad() {
    // 使用本地示例数据，不再调用API加载
    // this.loadPointsData();
  },
  methods: {
    loadPointsData() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取用户积分信息
      uni.request({
        url: '/api/social/points/user',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.userPoints = res.data.data;
          }
        }
      });
      
      // 获取每日任务列表
      uni.request({
        url: '/api/social/points/tasks',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.dailyTasks = res.data.data;
          }
        }
      });
      
      // 获取积分历史记录
      uni.request({
        url: '/api/social/points/history',
        method: 'GET',
        data: {
          limit: 5 // 只获取最近5条记录
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.pointsHistory = res.data.data;
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
    calculateLevelPercentage(current, next) {
      if (!next) return 0;
      const percentage = (current / next) * 100;
      return percentage > 100 ? 100 : percentage;
    },
    completeTask(taskId) {
      uni.showLoading({
        title: '提交中...'
      });
      
      uni.request({
        url: '/api/social/points/complete-task',
        method: 'POST',
        data: {
          taskId: taskId
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            // 更新任务状态
            const taskIndex = this.dailyTasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              this.dailyTasks[taskIndex].completed = true;
            }
            
            // 更新用户积分
            this.userPoints.current += this.dailyTasks[taskIndex].points;
            
            // 显示获得积分的提示
            uni.showToast({
              title: `获得 ${this.dailyTasks[taskIndex].points} 积分`,
              icon: 'none'
            });
            
            // 刷新积分历史记录
            this.loadPointsHistory();
          } else {
            uni.showToast({
              title: res.data.message || '任务完成失败',
              icon: 'none'
            });
          }
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
    loadPointsHistory() {
      uni.request({
        url: '/api/social/points/history',
        method: 'GET',
        data: {
          limit: 5
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.pointsHistory = res.data.data;
          }
        }
      });
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
    navigateToExchange() {
      uni.navigateTo({
        url: '../rewards/rewards'
      });
    },
    navigateToHistory() {
      uni.navigateTo({
        url: './history/points-history'
      });
    }
  }
}
</script>

<style lang="scss">
.points-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
  
  .points-overview {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .overview-header {
      margin-bottom: 20rpx;
      
      .overview-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .points-card {
      background: linear-gradient(to right, #ff9900, #ff6600);
      border-radius: 12rpx;
      padding: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .points-info {
        .points-value {
          font-size: 60rpx;
          font-weight: bold;
          color: #ffffff;
          display: block;
          line-height: 1.2;
        }
        
        .points-label {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    
    .level-info {
      .level-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;
        
        .level-name {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
        }
        
        .level-progress {
          font-size: 26rpx;
          color: #999999;
        }
      }
      
      .level-tips {
        font-size: 24rpx;
        color: #ff9900;
        margin-top: 10rpx;
        display: block;
      }
    }
  }
  
  .points-tasks {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .tasks-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .tasks-info {
        font-size: 26rpx;
        color: #999999;
      }
    }
    
    .task-list {
      .task-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .task-info {
          flex: 1;
          margin-right: 20rpx;
          
          .task-name {
            font-size: 28rpx;
            color: #333333;
            font-weight: 500;
            display: block;
            margin-bottom: 6rpx;
          }
          
          .task-desc {
            font-size: 24rpx;
            color: #999999;
          }
        }
        
        .task-reward {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          
          .reward-value {
            font-size: 28rpx;
            color: #ff9900;
            font-weight: bold;
            margin-bottom: 10rpx;
          }
        }
      }
    }
  }
  
  .points-history {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .history-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      
      .view-all {
        font-size: 26rpx;
        color: #2979ff;
      }
    }
    
    .history-list {
      .history-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .history-info {
          .history-desc {
            font-size: 28rpx;
            color: #333333;
            display: block;
            margin-bottom: 6rpx;
          }
          
          .history-time {
            font-size: 24rpx;
            color: #999999;
          }
        }
        
        .history-points {
          font-size: 32rpx;
          font-weight: bold;
          
          &.points-add {
            color: #19be6b;
          }
          
          &.points-reduce {
            color: #fa3534;
          }
        }
      }
      
      .empty-history {
        padding: 30rpx 0;
      }
    }
  }
}
</style>
