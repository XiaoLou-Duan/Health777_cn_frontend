<template>
	<view class="container">
		<!-- 顶部用户信息 -->
		<view class="user-info-bar">
			<view @click="navigateToProfile">
				<default-avatar :imageUrl="userInfo.avatar" size="80rpx"></default-avatar>
			</view>
			<view class="greeting">
				<text class="hello">您好，</text>
				<text class="username" @click="goToEditProfile">{{ userInfo.nickName || '未登录' }}</text>
			</view>
			<view class="notification" @click="goToNotifications">
				<text class="iconfont icon-bell-fill" style="font-size: 24rpx; color: #666;"></text>
				<view class="badge" v-if="notificationCount > 0">{{ notificationCount }}</view>
			</view>
			<view class="setting-icon" @click="navigateTo('/pages/setting/setting')">
				<text class="iconfont icon-setting-fill" style="font-size: 24rpx; color: #666;"></text>
			</view>
		</view>

		<!-- 健康数据卡片 -->
		<health-overview :healthData="healthData" :date="todayDate"></health-overview>

		<!-- 肌少症趋势卡片 -->
		<view class="trend-card">
			<view class="card-header">
				<text class="card-title">肌少症风险趋势</text>
				<text class="view-more" @click="navigateTo('/pages/health/trend')">查看详情</text>
			</view>
			<!-- 简易趋势图表示 -->
			<view class="trend-simple-chart">
				<view class="month-labels">
					<text v-for="(month, index) in chartData.categories" :key="index" class="month-label">{{ month
						}}</text>
				</view>
				<view class="chart-bars">
					<view v-for="(value, index) in chartData.series[0].data" :key="index" class="chart-bar"
						:style="{ height: value + '%', backgroundColor: chartData.series[0].color }">
						<text class="bar-value">{{ value }}</text>
					</view>
				</view>
			</view>
			<view class="trend-summary">
				<text class="trend-text">{{ trendAnalysis }}</text>
			</view>
		</view>

		<!-- 快速功能入口 -->
		<view class="function-entries">
			<view class="function-item" v-for="(item, index) in functionList" :key="index"
				@click="navigateTo(item.path)">
				<view class="function-icon" :style="{ backgroundColor: item.bgColor }">
					<text class="iconfont" :class="['icon-' + item.icon]" style="font-size: 30rpx; color: #fff;"></text>
				</view>
				<text class="function-name">{{ item.name }}</text>
			</view>
		</view>

		<!-- 健康提醒卡片 -->
		<view class="reminder-card" v-if="reminders.length > 0">
			<view class="card-header">
				<text class="card-title">今日提醒</text>
				<text class="view-more" @click="navigateTo('/pages/reminder/reminder-settings')">设置</text>
			</view>
			<view class="reminder-list">
				<view class="reminder-item" v-for="(item, index) in reminders" :key="index"
					@click="handleReminder(item)">
					<view class="reminder-icon" :class="item.type">
						<text class="iconfont" :class="['icon-' + getReminderIcon(item.type)]" style="font-size: 24rpx; color: #fff;"></text>
					</view>
					<view class="reminder-content">
						<text class="reminder-title">{{ item.title }}</text>
						<text class="reminder-time">{{ item.time }}</text>
					</view>
					<text class="iconfont icon-arrow-right" style="font-size: 18rpx; color: #ccc;"></text>
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
				<view class="community-item" v-for="(item, index) in communityPosts" :key="index"
					@click="navigateTo('/packageSocial/pages/community/post-detail/post-detail?id=' + item.id)">
					<view class="post-header">
						<default-avatar class="post-avatar" :imageUrl="''" size="80rpx"></default-avatar>
						<view class="post-info">
							<text class="post-author">{{ item.author }}</text>
							<text class="post-time">{{ item.time }}</text>
						</view>
					</view>
					<text class="post-title">{{ item.title }}</text>
					<text class="post-content" v-if="item.content">{{ item.content }}</text>
					<view class="post-images" v-if="item.images && item.images.length > 0">
						<image v-for="(img, imgIndex) in item.images.slice(0, 3)" :key="imgIndex" :src="img"
							mode="aspectFill" class="post-image">
						</image>
						<view class="image-count" v-if="item.images.length > 3">+{{ item.images.length - 3 }}</view>
					</view>
					<view class="post-stats">
						<view class="stat-item">
							<text class="iconfont icon-heart" style="font-size: 16rpx; color: #999;"></text>
							<text>{{ item.likes }}</text>
						</view>
						<view class="stat-item">
							<text class="iconfont icon-chat" style="font-size: 16rpx; color: #999;"></text>
							<text>{{ item.comments }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
  
  <script>
import HealthOverview from '@/components/health-overview/health-overview.vue';

export default {
	components: {
		HealthOverview
	},
	data() {
		return {
			userInfo: {
				avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
				{ name: '健康检测', icon: 'question', path: '/pages/health/check', bgColor: '#4CD964' },
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
					avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
					time: '10分钟前',
					title: '老年人如何科学增肌？',
					content: '年龄增长肌肉流失是不可避免的，但我们可以通过科学的训练方法来减缓这一过程...',
					images: [
						'https://img.freepik.com/free-photo/senior-man-doing-fitness-training-gym_651396-1379.jpg',
						'https://img.freepik.com/free-photo/elderly-people-doing-exercises-gym_23-2149525409.jpg'
					],
					likes: 18,
					comments: 5
				},
				{
					id: '2',
					author: '营养师小王',
					avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
					time: '2小时前',
					title: '增肌期间的蛋白质摄入指南',
					content: '正确的蛋白质摄入对于肌肉生长至关重要。以下是几种优质蛋白质来源...',
					images: [
						'https://img.freepik.com/free-photo/healthy-food-with-nutritional-ingredients_23-2148541329.jpg',
						'https://img.freepik.com/free-photo/protein-sources-vegetarians-concept_23-2148301546.jpg',
						'https://img.freepik.com/free-photo/greek-yogurt-with-granola-berries_144627-46363.jpg',
						'https://img.freepik.com/free-photo/various-beans-assortment_144627-36212.jpg'
					],
					likes: 45,
					comments: 12
				},
				{
					id: '3',
					author: '健康生活家',
					avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
					time: '昨天',
					title: '居家锻炼必备的5种器材',
					content: '即使在家中，也能进行高效的力量训练。这里推荐几种性价比高的居家健身器材...',
					images: [
						'https://img.freepik.com/free-photo/dumbbells-floor-gym_23-2147949747.jpg',
						'https://img.freepik.com/free-photo/resistance-bands-wooden-floor_23-2148285459.jpg',
						'https://img.freepik.com/free-photo/fitness-equipment-gym_1303-5538.jpg'
					],
					likes: 32,
					comments: 8
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
				// 使用随机用户头像代替默认头像
				this.userInfo = {
					avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
					nickName: '未登录'
				};
			} else {
				// 获取用户信息
				// 这里使用randomuser.me的随机头像
				this.userInfo = {
					avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
		goToEditProfile() {
			uni.navigateTo({
				url: '/pages/user/edit/edit'
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
		},
		navigateToProfile() {
			console.log('跳转到个人资料页面');
			uni.navigateTo({
				url: '/pages/user/profile/profile'
			});
	  }
	}
  }
  </script>
  
  <style lang="scss">
  @import './index.scss';
  </style>
