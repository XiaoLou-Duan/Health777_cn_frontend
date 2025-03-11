<template>
	<view class="container">
	  <!-- 顶部用户信息 -->
	  <view class="user-info-bar">
		<image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
		<view class="greeting">
		  <text class="hello">您好，</text>
		  <text class="username">{{userInfo.nickName || '未登录'}}</text>
		</view>
		<view class="notification" @click="goToNotifications">
		  <u-icon name="bell-fill" size="24" color="#666"></u-icon>
		  <view class="badge" v-if="notificationCount > 0">{{notificationCount}}</view>
		</view>
		<view class="setting-icon" @click="navigateTo('/pages/setting/setting')">
		  <u-icon name="setting-fill" size="24" color="#666"></u-icon>
		</view>
	  </view>
	  
	  <!-- 健康数据卡片 -->
	  <view class="health-card">
		<view class="card-header">
		  <text class="card-title">健康概览</text>
		  <text class="today-date">{{todayDate}}</text>
		</view>
		<view class="health-data-grid">
		  <view class="health-data-item" @click="navigateTo('/packageNutrition/pages/protein-analysis/protein-analysis')">
			<view class="data-value">{{healthData.proteinIntake}}<text class="unit">g</text></view>
			<view class="data-label">今日蛋白质</view>
		  </view>
		  <view class="health-data-item" @click="navigateTo('/packageExercise/pages/exercise-stats/exercise-stats')">
			<view class="data-value">{{healthData.exerciseMinutes}}<text class="unit">分钟</text></view>
			<view class="data-label">今日运动</view>
		  </view>
		  <view class="health-data-item">
			<view class="data-value">{{healthData.muscleScore}}<text class="unit">分</text></view>
			<view class="data-label">肌肉健康</view>
		  </view>
		  <view class="health-data-item">
			<view class="data-value">{{healthData.steps}}<text class="unit">步</text></view>
			<view class="data-label">今日步数</view>
		  </view>
		</view>
	  </view>
	  
	  <!-- 肌少症趋势卡片 -->
	  <view class="trend-card">
		<view class="card-header">
		  <text class="card-title">肌少症风险趋势</text>
		  <text class="view-more" @click="navigateTo('/pages/health/trend')">查看详情</text>
		</view>
		<!-- 简易趋势图表示 -->
		<view class="trend-simple-chart">
		  <view class="month-labels">
			<text v-for="(month, index) in chartData.categories" :key="index" class="month-label">{{month}}</text>
		  </view>
		  <view class="chart-bars">
			<view v-for="(value, index) in chartData.series[0].data" :key="index" 
				  class="chart-bar" 
				  :style="{height: value + '%', backgroundColor: chartData.series[0].color}">
			  <text class="bar-value">{{value}}</text>
			</view>
		  </view>
		</view>
		<view class="trend-summary">
		  <text class="trend-text">{{trendAnalysis}}</text>
		</view>
	  </view>
	  
	  <!-- 快速功能入口 -->
	  <view class="function-entries">
		<view class="function-item" v-for="(item, index) in functionList" :key="index" @click="navigateTo(item.path)">
		  <view class="function-icon" :style="{backgroundColor: item.bgColor}">
			<u-icon :name="item.icon" size="30" color="#fff"></u-icon>
		  </view>
		  <text class="function-name">{{item.name}}</text>
		</view>
	  </view>
	  
	  <!-- 健康提醒卡片 -->
	  <view class="reminder-card" v-if="reminders.length > 0">
		<view class="card-header">
		  <text class="card-title">今日提醒</text>
		  <text class="view-more" @click="navigateTo('/pages/reminder/reminder-settings')">全部</text>
		</view>
		<view class="reminder-list">
		  <view class="reminder-item" v-for="(item, index) in reminders" :key="index" @click="handleReminder(item)">
			<view class="reminder-icon" :class="item.type">
			  <u-icon :name="getReminderIcon(item.type)" size="24" color="#fff"></u-icon>
			</view>
			<view class="reminder-content">
			  <text class="reminder-title">{{item.title}}</text>
			  <text class="reminder-time">{{item.time}}</text>
			</view>
			<u-icon name="right" size="18" color="#ccc"></u-icon>
		  </view>
		</view>
	  </view>
	  
	  <!-- 社区动态卡片 -->
	  <view class="community-card">
		<view class="card-header">
		  <text class="card-title">社区动态</text>
		  <text class="view-more" @click="navigateTo('/packageSocial/pages/community/community')">全部</text>
		</view>
		<view class="community-list">
		  <view class="community-item" v-for="(item, index) in communityPosts" :key="index" @click="navigateTo('/packageSocial/pages/community/post-detail/post-detail?id=' + item.id)">
			<view class="post-header">
			  <image class="post-avatar" :src="item.avatar" mode="aspectFill"></image>
			  <view class="post-info">
				<text class="post-author">{{item.author}}</text>
				<text class="post-time">{{item.time}}</text>
			  </view>
			</view>
			<text class="post-title">{{item.title}}</text>
			<text class="post-content" v-if="item.content">{{item.content}}</text>
			<view class="post-images" v-if="item.images && item.images.length > 0">
			  <image 
				v-for="(img, imgIndex) in item.images.slice(0, 3)" 
				:key="imgIndex" 
				:src="img" 
				mode="aspectFill" 
				class="post-image">
			  </image>
			  <view class="image-count" v-if="item.images.length > 3">+{{item.images.length - 3}}</view>
			</view>
			<view class="post-stats">
			  <view class="stat-item">
				<u-icon name="heart" size="16" color="#999"></u-icon>
				<text>{{item.likes}}</text>
			  </view>
			  <view class="stat-item">
				<u-icon name="chat" size="16" color="#999"></u-icon>
				<text>{{item.comments}}</text>
			  </view>
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
		userInfo: {
		  avatar: '',
		  nickName: '张先生'
		},
		notificationCount: 3,
		todayDate: '',
		healthData: {
		  proteinIntake: 65,
		  exerciseMinutes: 30,
		  muscleScore: 82,
		  steps: 6521
		},
		trendAnalysis: '您的肌肉健康指数较上周有5%的提升，继续保持！',
		functionList: [
		  { name: '健康检测', icon: 'staff', path: '/pages/health/check', bgColor: '#4CD964' },
		  { name: '食物识别', icon: 'camera', path: '/packageNutrition/pages/food-recognition/food-recognition', bgColor: '#FD9426' },
		  { name: '运动指导', icon: 'info', path: '/packageExercise/pages/exercise-video/exercise-video', bgColor: '#007AFF' },
		  { name: '医生咨询', icon: 'phone', path: '/packageMedical/pages/consultation/consultation', bgColor: '#DD524D' }
		],
		reminders: [
		  { title: '服用钙片', time: '每天 09:00', type: 'medicine' },
		  { title: '进行力量训练', time: '每天 15:00', type: 'exercise' },
		  { title: '医师预约', time: '2025-03-15 10:30', type: 'appointment' }
		],
		communityPosts: [
		  {
			id: '1',
			author: '肌肉达人',
			avatar: '/static/images/avatar1.png',
			time: '10分钟前',
			title: '老年人如何科学增肌？',
			content: '年龄增长肌肉流失是不可避免的，但我们可以通过科学的训练方法来减缓这一过程...',
			images: ['/static/images/exercise1.jpg', '/static/images/exercise2.jpg'],
			likes: 18,
			comments: 5
		  },
		  {
			id: '2',
			author: '营养师小王',
			avatar: '/static/images/avatar2.png',
			time: '2小时前',
			title: '增肌期间的蛋白质摄入指南',
			content: '正确的蛋白质摄入对于肌肉生长至关重要。以下是几种优质蛋白质来源...',
			images: ['/static/images/food1.jpg', '/static/images/food2.jpg', '/static/images/food3.jpg', '/static/images/food4.jpg'],
			likes: 45,
			comments: 12
		  }
		],
		chartData: {
		  categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
		  series: [
			{
			  name: '肌肉健康指数',
			  data: [65, 68, 70, 69, 75, 82],
			  color: '#007AFF'
			}
		  ]
		}
	  }
	},
	onLoad() {
	  this.todayDate = this.formatDate(new Date());
	  // 检查用户登录状态
	  this.checkLoginStatus();
	  // 获取健康数据
	  this.getHealthData();
	},
	methods: {
	  formatDate(date) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year}年${month}月${day}日`;
	  },
	  checkLoginStatus() {
		// 检查用户是否已登录
		const token = uni.getStorageSync('token');
		if (!token) {
		  // 模拟数据，实际项目中应从服务器获取
		  this.userInfo = {
			avatar: '/static/images/default-avatar.png',
			nickName: '未登录'
		  };
		} else {
		  // 获取用户信息
		  // 这里使用模拟数据，实际项目中应调用API获取
		  this.userInfo = {
			avatar: '/static/images/avatar.png',
			nickName: '张先生'
		  };
		}
	  },
	  getHealthData() {
		// 获取健康数据
		// 这里使用模拟数据，实际项目中应调用API获取
		// 代码省略...
	  },
	  navigateTo(url) {
		uni.navigateTo({
		  url: url
		});
	  },
	  goToNotifications() {
		uni.navigateTo({
		  url: '/pages/notification/notification'
		});
	  },
	  handleReminder(item) {
		// 处理提醒点击事件
		console.log('点击了提醒：', item);
		if (item.type === 'appointment') {
		  uni.navigateTo({
			url: '/packageMedical/pages/appointment/appointment'
		  });
		}
	  },
	  getReminderIcon(type) {
		// 根据提醒类型返回对应的图标
		const iconMap = {
		  medicine: 'calendar',
		  exercise: 'man',
		  appointment: 'calendar',
		  default: 'bell'
		};
		return iconMap[type] || iconMap.default;
	  }
	}
  }
  </script>
  
  <style lang="scss">
  .container {
	padding: 20rpx;
	background-color: #f5f5f5;
  }
  
  // 用户信息栏
  .user-info-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
	
	.avatar {
	  width: 80rpx;
	  height: 80rpx;
	  border-radius: 50%;
	  margin-right: 20rpx;
	}
	
	.greeting {
	  flex: 1;
	  
	  .hello {
		font-size: 28rpx;
		color: #666;
	  }
	  
	  .username {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-left: 10rpx;
	  }
	}
	
	.notification {
	  position: relative;
	  
	  .badge {
		position: absolute;
		top: -8rpx;
		right: -8rpx;
		background-color: #FF5A5F;
		color: #fff;
		font-size: 20rpx;
		min-width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 15rpx;
		padding: 0 6rpx;
	  }
	}
	
	.setting-icon {
	  margin-left: 20rpx;
	}
  }
  
  // 卡片通用样式
  .health-card, .trend-card, .reminder-card, .community-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	
	.card-title {
	  font-size: 32rpx;
	  font-weight: bold;
	  color: #333;
	}
	
	.today-date, .view-more {
	  font-size: 24rpx;
	  color: #999;
	}
  }
  
  // 健康数据网格
  .health-data-grid {
	display: flex;
	flex-wrap: wrap;
	
	.health-data-item {
	  width: 50%;
	  padding: 20rpx 0;
	  text-align: center;
	  
	  .data-value {
		font-size: 48rpx;
		color: #333;
		font-weight: bold;
		
		.unit {
		  font-size: 24rpx;
		  color: #999;
		  margin-left: 4rpx;
		}
	  }
	  
	  .data-label {
		font-size: 26rpx;
		color: #666;
		margin-top: 10rpx;
	  }
	}
  }
  
  // 简易趋势图
  .trend-simple-chart {
	height: 300rpx;
	margin: 30rpx 0;
	position: relative;
	
	.month-labels {
	  display: flex;
	  justify-content: space-between;
	  margin-bottom: 10rpx;
	  
	  .month-label {
		font-size: 24rpx;
		color: #999;
		text-align: center;
		width: 16.66%;
	  }
	}
	
	.chart-bars {
	  display: flex;
	  justify-content: space-between;
	  align-items: flex-end;
	  height: 250rpx;
	  
	  .chart-bar {
		width: 40rpx;
		border-radius: 20rpx 20rpx 0 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		
		.bar-value {
		  font-size: 20rpx;
		  color: #fff;
		  margin-top: 5rpx;
		}
	  }
	}
  }
  
  .trend-summary {
	padding: 20rpx 0 0;
	
	.trend-text {
	  font-size: 28rpx;
	  color: #666;
	  line-height: 1.5;
	}
  }
  
  // 功能入口
  .function-entries {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
	
	.function-item {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  width: 25%;
	  
	  .function-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 16rpx;
	  }
	  
	  .function-name {
		font-size: 26rpx;
		color: #333;
	  }
	}
  }
  
  // 提醒列表
  .reminder-list {
	.reminder-item {
	  display: flex;
	  align-items: center;
	  padding: 20rpx 0;
	  border-bottom: 1rpx solid #f0f0f0;
	  
	  &:last-child {
		border-bottom: none;
	  }
	  
	  .reminder-icon {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		
		&.medicine {
		  background-color: #FF9500;
		}
		
		&.exercise {
		  background-color: #4CD964;
		}
		
		&.appointment {
		  background-color: #007AFF;
		}
	  }
	  
	  .reminder-content {
		flex: 1;
		
		.reminder-title {
		  font-size: 30rpx;
		  color: #333;
		  margin-bottom: 6rpx;
		}
		
		.reminder-time {
		  font-size: 24rpx;
		  color: #999;
		}
	  }
	}
  }
  
  // 社区动态
  .community-list {
	.community-item {
	  padding: 20rpx 0;
	  border-bottom: 1rpx solid #f0f0f0;
	  
	  &:last-child {
		border-bottom: none;
	  }
	  
	  .post-header {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		
		.post-avatar {
		  width: 60rpx;
		  height: 60rpx;
		  border-radius: 50%;
		  margin-right: 16rpx;
		}
		
		.post-info {
		  .post-author {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			margin-right: 16rpx;
		  }
		  
		  .post-time {
			font-size: 24rpx;
			color: #999;
		  }
		}
	  }
	  
	  .post-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
	  }
	  
	  .post-content {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 16rpx;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	  }
	  
	  .post-images {
		display: flex;
		margin-bottom: 16rpx;
		position: relative;
		
		.post-image {
		  width: 180rpx;
		  height: 180rpx;
		  margin-right: 10rpx;
		  border-radius: 8rpx;
		}
		
		.image-count {
		  position: absolute;
		  right: 0;
		  bottom: 0;
		  background-color: rgba(0, 0, 0, 0.5);
		  color: #fff;
		  font-size: 24rpx;
		  padding: 4rpx 16rpx;
		  border-radius: 0 0 8rpx 0;
		}
	  }
	  
	  .post-stats {
		display: flex;
		
		.stat-item {
		  display: flex;
		  align-items: center;
		  margin-right: 30rpx;
		  
		  text {
			font-size: 24rpx;
			color: #999;
			margin-left: 6rpx;
		  }
		}
	  }
	}
  }
  </style>
  