<template>
	<view class="exercise-index">
		<u-navbar title="运动健康" :border-bottom="false"></u-navbar>
		
		<view class="exercise-overview">
			<view class="section-title">运动概览</view>
			<view class="overview-card">
				<view class="overview-item">
					<text class="item-value">{{ todayStats.calories || 0 }}</text>
					<text class="item-label">今日消耗(千卡)</text>
				</view>
				<view class="overview-item">
					<text class="item-value">{{ todayStats.duration || 0 }}</text>
					<text class="item-label">运动时长(分钟)</text>
				</view>
				<view class="overview-item">
					<text class="item-value">{{ todayStats.steps || 0 }}</text>
					<text class="item-label">今日步数</text>
				</view>
			</view>
		</view>
		
		<view class="exercise-functions">
			<view class="function-grid">
				<view class="function-item" @click="navigateTo('/packageExercise/pages/exercise-guidance/exercise-guidance')">
					<view class="icon-wrapper">
						<u-icon name="play-right-fill" size="38" color="#409eff"></u-icon>
					</view>
					<text class="function-name">运动检测与指导</text>
				</view>
				<view class="function-item" @click="navigateTo('/packageExercise/pages/exercise-stats/exercise-stats')">
					<view class="icon-wrapper">
						<u-icon name="list-dot" size="38" color="#409eff"></u-icon>
					</view>
					<text class="function-name">运动成果统计</text>
				</view>
			</view>
		</view>
		
		<!-- 月度运动进度 -->
		<view class="exercise-monthly">
			<view class="section-title">月度运动进度</view>
			<view class="monthly-card">
				<view class="monthly-progress">
					<view class="progress-circle">
						<my-circle :percent="monthlyProgress.percent" :size="110" activeColor="#3cc51f">
							<view class="progress-inner">
								<text class="percent-value">{{ monthlyProgress.percent }}%</text>
								<text class="percent-label">完成度</text>
							</view>
						 </my-circle>
					</view>
					<view class="progress-info">
						<view class="info-item">
							<text class="info-label">本月累计消耗</text>
							<text class="info-value">{{ monthlyProgress.calories }}千卡</text>
						</view>
						<view class="info-item">
							<text class="info-label">本月累计时长</text>
							<text class="info-value">{{ monthlyProgress.duration }}分钟</text>
						</view>
						<view class="info-item">
							<text class="info-label">本月累计次数</text>
							<text class="info-value">{{ monthlyProgress.count }}次</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="exercise-records">
			<view class="section-title">最近运动记录</view>
			<view v-if="recentRecords.length > 0">
				<view class="record-item" v-for="(record, index) in recentRecords" :key="index">
					<view class="record-left">
						<text class="record-name">{{ record.exerciseName }}</text>
						<text class="record-time">{{ formatDate(record.startTime) }}</text>
					</view>
					<view class="record-right">
						<text class="record-duration">{{ record.durationMinutes }}分钟</text>
						<text class="record-calories">{{ record.calories }}千卡</text>
					</view>
				</view>
			</view>
			<view v-else class="empty-records">
				<u-empty text="暂无运动记录" mode="data"></u-empty>
			</view>
		</view>
		
		<!-- 统计图表区域 -->
		<view class="exercise-stats-preview">
			<view class="section-title">近期运动统计</view>
			<view class="stats-card">
				<!-- 使用简单替代方案，避免依赖缺失的qiun-data-charts组件 -->
				<view class="chart-alternative">
					<view class="chart-bars">
						<view class="chart-bar-item" v-for="(item, idx) in weeklyChartData.series[0].data" :key="idx">
							<view class="chart-bar" :style="{height: (item / Math.max(...weeklyChartData.series[0].data) * 150) + 'rpx'}"></view>
							<text class="chart-label">{{weeklyChartData.categories[idx]}}</text>
							<text class="chart-value">{{item}}分钟</text>
						</view>
					</view>
					<view class="chart-legend">
						<view class="legend-item">
							<view class="legend-color"></view>
							<text class="legend-text">运动时长(分钟)</text>
						</view>
					</view>
				</view>
				
				<view class="stats-summary">
					<view class="summary-item">
						<text class="summary-value">{{ weeklyTotal.count }}</text>
						<text class="summary-label">本周运动次数</text>
					</view>
					<view class="summary-item">
						<text class="summary-value">{{ weeklyTotal.duration }}</text>
						<text class="summary-label">累计时长(分钟)</text>
					</view>
					<view class="summary-item">
						<text class="summary-value">{{ weeklyTotal.calories }}</text>
						<text class="summary-label">累计消耗(千卡)</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入自定义圆环进度组件
	import myCircle from '@/components/myCircle/myCircle.vue'
	
	export default {
		// 注册组件
		components: {
			myCircle
		},
		data() {
			return {
				todayStats: {
					calories: 320,
					duration: 45,
					steps: 8750
				},
				recentRecords: [
					{
						id: "ex001",
						exerciseName: "慢跑",
						startTime: "2025-03-11T08:30:00",
						endTime: "2025-03-11T09:15:00",
						durationMinutes: 45,
						calories: 320,
						distance: 5.2,
						steps: 6500
					},
					{
						id: "ex002",
						exerciseName: "力量训练",
						startTime: "2025-03-10T16:00:00",
						endTime: "2025-03-10T16:40:00",
						durationMinutes: 40,
						calories: 280,
						sets: 4,
						reps: 12
					},
					{
						id: "ex003",
						exerciseName: "瑜伽",
						startTime: "2025-03-09T07:30:00",
						endTime: "2025-03-09T08:20:00",
						durationMinutes: 50,
						calories: 200
					},
					{
						id: "ex004",
						exerciseName: "骑行",
						startTime: "2025-03-08T15:00:00",
						endTime: "2025-03-08T16:10:00",
						durationMinutes: 70,
						calories: 450,
						distance: 18.5
					},
					{
						id: "ex005",
						exerciseName: "游泳",
						startTime: "2025-03-07T18:30:00",
						endTime: "2025-03-07T19:20:00",
						durationMinutes: 50,
						calories: 380,
						distance: 1.2
					}
				],
				monthlyProgress: {
					percent: 68,
					calories: 8650,
					duration: 890,
					count: 15
				},
				weeklyChartData: {
					categories: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
					series: [
						{
							name: "运动时长(分钟)",
							data: [30, 45, 0, 60, 40, 70, 45]
						}
					]
				},
				weeklyChartOpts: {
					color: ["#3cc51f"],
					padding: [15, 15, 0, 5],
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						data: [
							{
								min: 0
							}
						]
					},
					extra: {
						column: {
							width: 20,
							activeBgColor: "#000000",
							activeBgOpacity: 0.1
						}
					}
				},
				weeklyTotal: {
					count: 6,
					duration: 290,
					calories: 1890
				}
			}
		},
		onLoad() {
			this.fetchTodayStats();
			this.fetchRecentRecords();
			this.fetchMonthlyProgress();
			this.fetchWeeklyStats();
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
			},
			fetchTodayStats() {
				// 此处已有演示数据，无需API调用
				/* 
				uni.request({
					url: '/api/exercise/stats',
					method: 'GET',
					data: {
						type: 'daily'
					},
					success: (res) => {
						if (res.data && res.data.code === 200 && res.data.data.length > 0) {
							const today = new Date().toISOString().split('T')[0];
							const todayData = res.data.data.find(item => item.date === today);
							
							if (todayData) {
								this.todayStats = {
									calories: todayData.calories,
									duration: todayData.durationMinutes,
									steps: todayData.steps
								};
							}
						}
					}
				});
				*/
			},
			fetchRecentRecords() {
				// 此处已有演示数据，无需API调用
				/*
				uni.request({
					url: '/api/exercise/records',
					method: 'GET',
					success: (res) => {
						if (res.data && res.data.code === 200) {
							this.recentRecords = res.data.data.slice(0, 5);
						}
					}
				});
				*/
			},
			fetchMonthlyProgress() {
				// 此处已有演示数据，无需API调用
				/*
				uni.request({
					url: '/api/exercise/stats',
					method: 'GET',
					data: {
						type: 'monthly'
					},
					success: (res) => {
						if (res.data && res.data.code === 200 && res.data.data.length > 0) {
							// 处理月度数据...
						}
					}
				});
				*/
			},
			fetchWeeklyStats() {
				// 此处已有演示数据，无需API调用
				/*
				uni.request({
					url: '/api/exercise/stats',
					method: 'GET',
					data: {
						type: 'weekly'
					},
					success: (res) => {
						if (res.data && res.data.code === 200 && res.data.data.length > 0) {
							// 处理周统计数据...
						}
					}
				});
				*/
			}
		}
	}
</script>

<style lang="scss" >
.exercise-index {
	min-height: 100vh;
	background-color: #f5f7fa; // 更改为更柔和的背景色
	padding-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #303133; // 更深的文字颜色
	padding: 30rpx 30rpx 20rpx;
	position: relative;
	padding-left: 50rpx; // 增加左侧内边距，为装饰条留空间

	&::before {
		// 添加与运动指导页面一致的装饰条
		content: '';
		position: absolute;
		left: 30rpx;
		top: 36rpx;
		width: 8rpx;
		height: 28rpx;
		background-color: #409eff; // 主题色改为蓝色
		border-radius: 4rpx;
	}
}

/* 概览卡片 */
.exercise-overview {
	margin: 0 30rpx;
}

.overview-card {
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	display: flex;
	padding: 30rpx 0;
}

.overview-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.overview-item:not(:last-child)::after {
	content: '';
	position: absolute;
	right: 0;
	top: 20%;
	height: 60%;
	width: 1px;
	background-color: #EBEEF5; // 更改分隔线颜色
}

.item-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #409eff; // 更改为主题蓝色
	margin-bottom: 10rpx;
}

.item-label {
	font-size: 26rpx; // 稍微增大字体
	color: #606266; // 调整文字颜色
}

/* 功能导航 */
.exercise-functions {
	margin: 20rpx 30rpx;
}

.function-grid {
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	padding: 24rpx; // 增加内边距
	justify-content: space-around;
}

.function-item {
	width: 45%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 30rpx 0;
}

.function-name {
	font-size: 28rpx; // 增大字体
	color: #303133; // 更深的文字颜色
	margin-top: 16rpx;
}

/* 月度运动进度 */
.exercise-monthly {
	margin: 20rpx 30rpx;
}

.monthly-card {
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	padding: 30rpx;
}

.monthly-progress {
	display: flex;
	align-items: center;
}

.progress-circle {
	margin-right: 40rpx;
}

.progress-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.percent-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #409eff; // 更改为主题蓝色
}

.percent-label {
	font-size: 24rpx;
	color: #606266; // 调整文字颜色
}

.progress-info {
	flex: 1;
}

.info-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.info-item:last-child {
	margin-bottom: 0;
}

.info-label {
	font-size: 26rpx;
	color: #606266; // 调整文字颜色
}

.info-value {
	font-size: 28rpx; // 增大字体
	font-weight: bold;
	color: #303133; // 更深的文字颜色
}

/* 运动记录列表 */
.exercise-records {
	margin: 20rpx 30rpx;
}

.record-item {
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
}

.record-left {
	display: flex;
	flex-direction: column;
}

.record-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #303133; // 更深的文字颜色
	margin-bottom: 10rpx;
}

.record-time {
	font-size: 24rpx;
	color: #909399; // 调整次要文字颜色
}

.record-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.record-duration {
	font-size: 28rpx;
	color: #409eff; // 更改为主题蓝色
	font-weight: bold;
	margin-bottom: 10rpx;
}

.record-calories {
	font-size: 24rpx;
	color: #f56c6c;
}

.empty-records {
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	padding: 50rpx 0;
}

/* 统计图表区域 */
.exercise-stats-preview {
	margin: 20rpx 30rpx;
}

.stats-card {
	background-color: #fff;
	border-radius: 16rpx; // 增大圆角
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08); // 调整阴影效果
	padding: 30rpx;
}

.stats-summary {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
	border-top: 1px solid #EBEEF5; // 更改分隔线颜色
	padding-top: 20rpx;
}

.summary-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.summary-value {
	font-size: 30rpx;
	font-weight: bold;
	color: #409eff; // 更改为主题蓝色
	margin-bottom: 8rpx;
}

.summary-label {
	font-size: 24rpx;
	color: #606266; // 调整文字颜色
}

.icon-wrapper {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background-color: rgba(64, 158, 255, 0.1); // 适应新主题色
	margin-bottom: 10rpx;
}

/* 确保图标能正确居中显示 */
.function-icon {
	/* 删除 display: flex !important; */
	/* 删除自定义的对齐方式，使用 uView 默认的对齐方式 */
}

/* 调整uView图标的视觉效果 */
.u-icon {
	/* 删除这些样式覆盖，避免与 uView 原生样式冲突 */
}

/* 添加图表替代样式 */
	.chart-alternative {
		padding: 20rpx 0;
	}
	
	.chart-bars {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
	}
	
	.chart-bar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 14%;
	}
	
	.chart-bar {
		width: 100%;
		background-color: #409eff;  // 更改为主题蓝色
		border-radius: 10rpx;
	}
	
	.chart-label {
		font-size: 22rpx;
		color: #606266;  // 调整文字颜色
		margin-top: 10rpx;
	}
	
	.chart-value {
		font-size: 24rpx;
		color: #303133;  // 更深的文字颜色
		font-weight: bold;
		margin-top: 10rpx;
	}
	
	.chart-legend {
		display: flex;
		justify-content: center;
		padding: 10rpx 20rpx;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
	}
	
	.legend-color {
		width: 20rpx;
		height: 20rpx;
		background-color: #409eff;  // 更改为主题蓝色
		border-radius: 50%;
		margin-right: 10rpx;
	}
	
	.legend-text {
		font-size: 24rpx;
		color: #606266;  // 调整文字颜色
	}
</style>
