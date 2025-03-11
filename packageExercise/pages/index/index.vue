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
						<u-icon name="play-right-fill" size="38" color="#3cc51f" class="function-icon"></u-icon>
					</view>
					<text class="function-name">运动检测与指导</text>
				</view>
				<view class="function-item" @click="navigateTo('/packageExercise/pages/exercise-stats/exercise-stats')">
					<view class="icon-wrapper">
						<u-icon name="list-dot" size="38" color="#3cc51f" class="function-icon"></u-icon>
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
						<u-circle :percent="monthlyProgress.percent" :size="110" activeColor="#3cc51f">
							<view class="progress-inner">
								<text class="percent-value">{{ monthlyProgress.percent }}%</text>
								<text class="percent-label">完成度</text>
							</view>
						</u-circle>
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
				<qiun-data-charts 
					type="column"
					:chartData="weeklyChartData"
					:opts="weeklyChartOpts"
					:canvas2d="true"
				/>
				
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
	export default {
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

<style>
	@import "./index.scss";
</style>
