<template>
	<view class="exercise-guidance-container">
		<u-navbar title="运动检测与指导" :border="false" back-icon-color="#333333"></u-navbar>
		
		<view class="content-wrapper">
			<!-- 视频和检测双栏布局 -->
			<view class="dual-panel">
				<!-- 左侧视频区域 -->
				<view class="video-panel">
					<view class="panel-title">指导视频</view>
					<view class="video-player">
						<video 
							:src="currentVideo.url" 
							:poster="currentVideo.thumbnail" 
							controls 
							class="player"
							@play="onVideoPlay"
							@pause="onVideoPause"
						></video>
						<view class="video-info">
							<text class="video-title">{{ currentVideo.title }}</text>
							<view class="video-meta">
								<text class="video-difficulty">难度: {{ getDifficultyText(currentVideo.difficulty) }}</text>
								<text class="video-duration">{{ formatDuration(currentVideo.duration) }}</text>
							</view>
						</view>
					</view>
					
					<!-- 视频列表选择器 -->
					<view class="video-selector">
						<view class="selector-header">
							<text class="header-title">选择指导视频</text>
							<view class="category-tabs">
								<view 
									v-for="(category, index) in categories" 
									:key="index"
									class="category-tab" 
									:class="{ active: currentCategory === category.value }"
									@click="switchCategory(category.value)"
								>
									{{ category.name }}
								</view>
							</view>
						</view>
						<scroll-view class="selector-content" scroll-y>
							<view 
								class="video-item" 
								v-for="(video, index) in filteredVideos" 
								:key="index"
								:class="{ active: currentVideo.id === video.id }"
								@click="selectVideo(video)"
							>
								<image class="video-thumb" :src="video.thumbnail" mode="aspectFill"></image>
								<view class="video-brief">
									<text class="brief-title">{{ video.title }}</text>
									<text class="brief-desc">{{ video.description }}</text>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 右侧检测区域 -->
				<view class="detection-panel">
					<view class="panel-title">运动检测</view>
					<view class="camera-view">
						<view class="camera-content" :class="{ active: cameraActive }">
							<view class="camera-placeholder" v-if="!cameraActive">
								<u-icon name="camera-fill" size="60" color="#cccccc"></u-icon>
								<text class="placeholder-text">点击下方按钮开始运动检测</text>
							</view>
							
							<view class="camera-preview" v-else>
								<!-- 模拟相机预览 -->
								<image class="preview-image" :src="detectionPreviewImage" mode="aspectFill"></image>
								<view class="overlay-info">
									<text class="detection-text">正在检测: {{ selectedExercise }}</text>
									<text class="detection-tip">{{ detectionTip }}</text>
								</view>
							</view>
						</view>
						
						<!-- 检测控制区 -->
						<view class="detection-controls">
							<view class="exercise-type-selector">
								<view 
									class="type-item" 
									v-for="(exercise, index) in exerciseTypes" 
									:key="index"
									:class="{ active: selectedExercise === exercise.name }"
									@click="selectExercise(exercise.name)"
								>
									{{ exercise.name }}
								</view>
							</view>
							
							<view class="control-buttons">
								<u-button 
									type="primary" 
									:disabled="!selectedExercise" 
									@click="toggleDetection"
									class="detection-button"
								>
									{{ cameraActive ? '停止检测' : '开始检测' }}
								</u-button>
							</view>
						</view>
					</view>
					
					<!-- 检测结果与建议 -->
					<view class="detection-results" v-if="hasResult">
						<view class="result-card">
							<view class="result-header">检测结果</view>
							<view class="result-content">
								<view class="result-item">
									<text class="item-label">运动类型</text>
									<text class="item-value">{{ resultData.detectionType }}</text>
								</view>
								<view class="result-item">
									<text class="item-label">动作准确度</text>
									<text class="item-value">{{ resultData.accuracy }}%</text>
								</view>
								<view class="result-item">
									<text class="item-label">动作次数</text>
									<text class="item-value">{{ resultData.repetitions }}次</text>
								</view>
								<view class="result-item">
									<text class="item-label">运动时长</text>
									<text class="item-value">{{ resultData.duration }}秒</text>
								</view>
								<view class="result-item">
									<text class="item-label">消耗热量</text>
									<text class="item-value">{{ resultData.calories }}千卡</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 实时运动建议 -->
					<view class="exercise-suggestions">
						<view class="suggestion-header">实时运动建议</view>
						<view class="suggestion-content">
							<view class="suggestion-item" v-for="(suggestion, index) in currentSuggestions" :key="index">
								<u-icon name="arrow-right" color="#3cc51f" size="24"></u-icon>
								<text class="suggestion-text">{{ suggestion }}</text>
							</view>
							<view class="empty-suggestion" v-if="currentSuggestions.length === 0">
								<text>开始检测后将显示实时建议</text>
							</view>
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
				// 视频相关数据
				categories: [
					{ name: '全部', value: 'all' },
					{ name: '初级', value: 'beginner' },
					{ name: '中级', value: 'intermediate' },
					{ name: '高级', value: 'advanced' },
					{ name: '有氧', value: 'cardio' },
					{ name: '力量', value: 'strength' },
					{ name: '柔韧性', value: 'flexibility' }
				],
				currentCategory: 'all',
				videos: [
					{
						id: 'v001',
						title: '初学者全身训练',
						description: '适合初学者的15分钟全身训练，不需要器械，随时随地可以进行。',
						url: 'https://example.com/videos/beginner-workout.mp4',
						thumbnail: '/static/images/exercise/workout1.jpg',
						duration: 900,
						difficulty: 'beginner',
						categories: ['beginner', 'strength'],
						views: 1258,
						relatedExercises: ['深蹲', '平板支撑', '俯卧撑'],
						tips: [
							'保持腹部收紧以保护腰椎',
							'动作要缓慢，感受肌肉收缩',
							'注意呼吸频率，不要屏气'
						]
					},
					{
						id: 'v002',
						title: '进阶力量训练',
						description: '30分钟中等强度力量训练，专注于上肢和核心肌群。',
						url: 'https://example.com/videos/intermediate-strength.mp4',
						thumbnail: '/static/images/exercise/workout2.jpg',
						duration: 1800,
						difficulty: 'intermediate',
						categories: ['intermediate', 'strength'],
						views: 856,
						relatedExercises: ['俯卧撑', '仰卧起坐', '弓步蹲'],
						tips: [
							'注意控制动作速度，保持良好姿态',
							'每组之间休息30-60秒',
							'如果感到不适，立即停止'
						]
					},
					{
						id: 'v003',
						title: '高强度间歇训练',
						description: '20分钟HIIT训练，快速燃烧脂肪，提高心肺功能。',
						url: 'https://example.com/videos/hiit-cardio.mp4',
						thumbnail: '/static/images/exercise/workout3.jpg',
						duration: 1200,
						difficulty: 'advanced',
						categories: ['advanced', 'cardio'],
						views: 1567,
						relatedExercises: ['弓步蹲', '深蹲', '俯卧撑'],
						tips: [
							'高强度阶段全力以赴',
							'注意保持正确呼吸节奏',
							'适当调整强度适合自己'
						]
					},
					{
						id: 'v004',
						title: '瑜伽基础拉伸',
						description: '25分钟基础瑜伽，改善柔韧性和平衡能力。',
						url: 'https://example.com/videos/yoga-basics.mp4',
						thumbnail: '/static/images/exercise/workout4.jpg',
						duration: 1500,
						difficulty: 'beginner',
						categories: ['beginner', 'flexibility'],
						views: 1032,
						relatedExercises: ['平板支撑'],
						tips: [
							'保持平缓深长的呼吸',
							'不要强行拉伸到疼痛',
							'注意肩膀和颈部放松'
						]
					},
					{
						id: 'v005',
						title: '老年人肌力训练',
						description: '适合老年人的低强度肌力训练，改善日常活动能力。',
						url: 'https://example.com/videos/elderly-training.mp4',
						thumbnail: '/static/images/exercise/workout5.jpg',
						duration: 1080,
						difficulty: 'beginner',
						categories: ['beginner', 'strength'],
						views: 723,
						relatedExercises: ['深蹲', '弓步蹲'],
						tips: [
							'动作要缓慢可控',
							'如有不适立即停止',
							'可以扶着椅子保持平衡'
						]
					}
				],
				currentVideo: {},
				
				// 检测相关数据
				cameraActive: false,
				selectedExercise: '',
				exerciseTypes: [
					{ name: '深蹲', value: 'squat' },
					{ name: '俯卧撑', value: 'pushup' },
					{ name: '仰卧起坐', value: 'situp' },
					{ name: '平板支撑', value: 'plank' },
					{ name: '弓步蹲', value: 'lunge' }
				],
				detectionPreviewImage: '/static/images/exercise/detection-preview.jpg',
				detectionTip: '',
				tipIndex: 0,
				tipInterval: null,
				
				// 结果相关数据
				resultData: {
					detectionType: '',
					accuracy: 0,
					repetitions: 0,
					duration: 0,
					calories: 0
				},
				hasResult: false,
				
				// 建议相关数据
				allSuggestions: {
					'深蹲': [
						'保持背部挺直，不要弯腰',
						'下蹲时膝盖不要超过脚尖',
						'脚尖略微向外，与膝盖方向一致',
						'下蹲至大腿与地面平行即可',
						'上升时通过臀部和大腿发力'
					],
					'俯卧撑': [
						'保持身体成一条直线',
						'肘部靠近身体，不要向外张开',
						'目视前方，不要低头',
						'下降时胸部接近但不触地',
						'呼吸要均匀，不要屏气'
					],
					'仰卧起坐': [
						'弯曲膝盖，脚平放在地面',
						'手可以轻放在耳旁，不要扣住头部',
						'利用腹肌发力，不要用力摆动',
						'每次起坐不必完全躺平',
						'保持均匀呼吸节奏'
					],
					'平板支撑': [
						'保持肩膀、臀部和脚踝在一条直线上',
						'收紧腹部和臀部肌肉',
						'不要下沉腰部或抬高臀部',
						'呼吸保持均匀，不要屏气',
						'注视地面，保持颈部自然位置'
					],
					'弓步蹲': [
						'上半身保持挺直',
						'前腿膝盖不要超过脚尖',
						'后腿膝盖接近但不触地',
						'前后腿大腿尽量成90度角',
						'保持平衡，可微微前倾'
					]
				},
				currentSuggestions: []
			}
		},
		computed: {
			filteredVideos() {
				if (this.currentCategory === 'all') {
					return this.videos;
				}
				
				return this.videos.filter(video => 
					video.categories.includes(this.currentCategory) || 
					video.difficulty === this.currentCategory
				);
			}
		},
		created() {
			// 默认选择第一个视频
			if (this.videos.length > 0) {
				this.currentVideo = this.videos[0];
			}
		},
		methods: {
			// 视频相关方法
			switchCategory(category) {
				this.currentCategory = category;
			},
			selectVideo(video) {
				this.currentVideo = video;
				
				// 如果有与视频相关的运动，自动选择
				if (video.relatedExercises && video.relatedExercises.length > 0) {
					this.selectExercise(video.relatedExercises[0]);
				}
			},
			formatDuration(seconds) {
				if (!seconds) return '00:00';
				
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = seconds % 60;
				
				return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
			},
			getDifficultyText(difficulty) {
				switch(difficulty) {
					case 'beginner': return '初级';
					case 'intermediate': return '中级';
					case 'advanced': return '高级';
					default: return '未知';
				}
			},
			onVideoPlay() {
				console.log('视频开始播放');
				// 可以在此处添加播放计数等逻辑
			},
			onVideoPause() {
				console.log('视频暂停');
			},
			
			// 检测相关方法
			selectExercise(exerciseName) {
				this.selectedExercise = exerciseName;
				// 更新建议
				this.updateSuggestions();
				
				if (this.cameraActive) {
					this.stopDetection();
					this.startDetection();
				}
			},
			toggleDetection() {
				if (this.cameraActive) {
					this.stopDetection();
				} else {
					this.startDetection();
				}
			},
			startDetection() {
				if (!this.selectedExercise) {
					uni.showToast({
						title: '请先选择运动类型',
						icon: 'none'
					});
					return;
				}
				
				this.cameraActive = true;
				this.hasResult = false;
				
				// 开始实时提示循环
				this.tipIndex = 0;
				this.rotateTips();
				this.tipInterval = setInterval(() => {
					this.rotateTips();
				}, 3000);
				
				// 模拟检测过程
				uni.showLoading({
					title: '运动检测中...'
				});
				
				// 实际项目中应该调用相机API进行运动检测
				setTimeout(() => {
					this.simulateDetectionResult();
					uni.hideLoading();
				}, 5000);
			},
			stopDetection() {
				if (this.cameraActive) {
					this.cameraActive = false;
					
					// 清除提示循环
					if (this.tipInterval) {
						clearInterval(this.tipInterval);
						this.tipInterval = null;
					}
					
					uni.showToast({
						title: '已停止检测',
						icon: 'none'
					});
				}
			},
			rotateTips() {
				if (this.allSuggestions[this.selectedExercise]) {
					const tips = this.allSuggestions[this.selectedExercise];
					this.detectionTip = tips[this.tipIndex];
					this.tipIndex = (this.tipIndex + 1) % tips.length;
				}
			},
			simulateDetectionResult() {
				// 模拟返回检测结果
				this.resultData = {
					detectionType: this.selectedExercise,
					accuracy: Math.floor(Math.random() * 30) + 70, // 70-100的随机数
					repetitions: Math.floor(Math.random() * 10) + 5, // 5-15的随机数
					duration: Math.floor(Math.random() * 60) + 30, // 30-90秒的随机数
					calories: Math.floor(Math.random() * 50) + 20 // 20-70卡路里的随机数
				};
				
				this.hasResult = true;
				
				// 根据准确度生成针对性建议
				this.generateAccuracyBasedSuggestions();
				
				// 保存运动记录（实际应调用API）
				console.log('已保存运动记录:', this.resultData);
			},
			updateSuggestions() {
				if (this.allSuggestions[this.selectedExercise]) {
					this.currentSuggestions = [...this.allSuggestions[this.selectedExercise]];
				} else {
					this.currentSuggestions = [];
				}
			},
			generateAccuracyBasedSuggestions() {
				// 根据准确度生成不同的建议
				this.currentSuggestions = [];
				
				if (this.resultData.accuracy < 80) {
					this.currentSuggestions.push('动作准确度较低，请注意调整姿势');
					this.currentSuggestions.push('建议放慢动作速度，注重质量而非数量');
					this.currentSuggestions.push('可以参考视频示范，调整动作细节');
				} else if (this.resultData.accuracy < 90) {
					this.currentSuggestions.push('动作准确度良好，可以适当增加难度');
					this.currentSuggestions.push('注意保持稳定的呼吸节奏');
				} else {
					this.currentSuggestions.push('动作准确度很高，表现出色！');
					this.currentSuggestions.push('可以尝试增加重复次数或者组数');
					this.currentSuggestions.push('考虑增加其他辅助训练，全面提升能力');
				}
				
				// 添加原有的建议
				if (this.allSuggestions[this.selectedExercise]) {
					this.currentSuggestions = [...this.currentSuggestions, ...this.allSuggestions[this.selectedExercise]];
				}
			}
		}
	}
</script>

<style>
	@import "./exercise-guidance.scss";
</style>
