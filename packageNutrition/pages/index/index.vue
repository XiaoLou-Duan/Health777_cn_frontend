<template>
  <view class="nutrition-container">
    <u-navbar title="营养健康" :border="false" back-icon-color="#333333"></u-navbar>
    
    <view class="content-wrapper">
      <!-- 用户营养状态概览 -->
      <view class="section user-nutrition-status">
        <view class="section-header">
          <text class="section-title">营养摄入概览</text>
          <text class="today-date">{{todayFormatted}}</text>
        </view>
        <view class="nutrition-cards">
          <view class="nutrition-card" v-for="(item, index) in nutritionMetrics" :key="index">
            <view class="card-header">
              <text class="card-title">{{item.name}}</text>
              <u-icon :name="item.icon" size="24" color="#2979ff"></u-icon>
            </view>
            <view class="card-content">
              <text class="value">{{item.value}}</text>
              <text class="unit">{{item.unit}}</text>
            </view>
            <view class="card-progress">
              <u-line-progress :percentage="item.percentage" :striped="true" :stripedActive="true" height="8"></u-line-progress>
              <text class="target-text">目标: {{item.target}}{{item.unit}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 蛋白质摄入情况 -->
      <view class="section protein-section">
        <view class="section-header">
          <text class="section-title">蛋白质摄入</text>
          <u-button size="mini" type="primary" @click="navToProteinAnalysis">详细分析</u-button>
        </view>
        <view class="protein-chart-container">
          <!-- 临时替换图表组件，使用uView的统计卡片替代 -->
          <view class="protein-chart-alternative">
            <view class="chart-bars">
              <view class="chart-bar-item" v-for="(item, idx) in weeklyProteinData.series[0].data" :key="idx">
                <view class="chart-bar" :style="{height: (item / Math.max(...weeklyProteinData.series[0].data) * 150) + 'rpx'}"></view>
                <text class="chart-label">{{weeklyProteinData.categories[idx]}}</text>
                <text class="chart-value">{{item}}g</text>
              </view>
            </view>
            <view class="chart-legend">
              <view class="legend-item">
                <view class="legend-color"></view>
                <text class="legend-text">蛋白质摄入(g)</text>
              </view>
            </view>
          </view>
        </view>
        <view class="protein-summary">
          <view class="summary-item">
            <text class="label">今日摄入</text>
            <text class="value">{{proteinSummary.today}}g</text>
          </view>
          <view class="summary-item">
            <text class="label">周平均</text>
            <text class="value">{{proteinSummary.weekAverage}}g</text>
          </view>
          <view class="summary-item">
            <text class="label">目标达成</text>
            <text class="value">{{proteinSummary.completion}}%</text>
          </view>
        </view>
      </view>
      
      <!-- 营养计划完成情况 -->
      <view class="section diet-plan-section">
        <view class="section-header">
          <text class="section-title">营养计划进度</text>
          <u-button size="mini" type="primary" @click="navToDietSuggestion">查看建议</u-button>
        </view>
        <view class="diet-plan-progress">
          <view class="plan-item" v-for="(item, index) in dietPlan" :key="index">
            <view class="plan-item-header">
              <text class="plan-item-title">{{item.title}}</text>
              <u-tag :text="item.completed ? '已完成' : '待完成'" :type="item.completed ? 'success' : 'warning'" size="mini"></u-tag>
            </view>
            <text class="plan-item-description">{{item.description}}</text>
            <u-line-progress :percentage="item.progress" :striped="true" height="6"></u-line-progress>
          </view>
        </view>
      </view>
      
      <!-- 快捷功能区 -->
      <view class="section quick-actions">
        <view class="section-header">
          <text class="section-title">快捷功能</text>
        </view>
        <view class="action-grid">
          <view class="action-item" @click="navToFoodRecognition">
            <u-icon name="camera-fill" size="32" color="#2979ff"></u-icon>
            <text class="action-title">食物识别</text>
          </view>
          <view class="action-item" @click="navToWheyProtein">
            <u-icon name="star-fill" size="32" color="#2979ff"></u-icon>
            <text class="action-title">蛋白补充</text>
          </view>
          <view class="action-item" @click="navToFoodLibrary">
            <u-icon name="grid-fill" size="32" color="#2979ff"></u-icon>
            <text class="action-title">食物库</text>
          </view>
          <view class="action-item" @click="navToNutritionHistory">
            <u-icon name="calendar" size="32" color="#2979ff"></u-icon>
            <text class="action-title">历史记录</text>
          </view>
        </view>
      </view>
      
      <!-- 推荐食物 -->
      <view class="section recommended-foods">
        <view class="section-header">
          <text class="section-title">推荐食物</text>
        </view>
        <scroll-view scroll-x class="food-scroll">
          <view class="food-item" v-for="(item, index) in recommendedFoods" :key="index">
            <image class="food-image" :src="item.image" mode="aspectFill"></image>
            <text class="food-name">{{item.name}}</text>
            <text class="food-protein">蛋白质: {{item.protein}}g/100g</text>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 悬浮按钮 - 添加食物记录 -->
    <view class="floating-button">
      <u-button type="primary" shape="circle" icon="plus" @click="showAddFoodPopup"></u-button>
    </view>
    
    <!-- 添加食物记录弹窗 -->
    <u-popup v-model="showAddFood" mode="bottom" border-radius="16">
      <view class="add-food-popup">
        <view class="popup-header">
          <text class="popup-title">添加食物记录</text>
          <u-icon name="close" @click="showAddFood = false"></u-icon>
        </view>
        <view class="popup-content">
          <!-- 这里可以添加选择食物的表单 -->
          <text class="hint-text">选择添加食物的方式:</text>
          <view class="popup-actions">
            <u-button type="primary" @click="navToFoodRecognition">AI识别食物</u-button>
            <u-button type="info" @click="navToFoodLibrary">从食物库选择</u-button>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 今日日期
      todayFormatted: '',
      
      // 营养指标
      nutritionMetrics: [
        {
          name: '热量',
          icon: 'fire-fill',
          value: 0,
          target: 2000,
          unit: 'kcal',
          percentage: 0
        },
        {
          name: '蛋白质',
          icon: 'star',
          value: 0,
          target: 70,
          unit: 'g',
          percentage: 0
        },
        {
          name: '脂肪',
          icon: 'heart',
          value: 0,
          target: 65,
          unit: 'g',
          percentage: 0
        },
        {
          name: '碳水',
          icon: 'arrow-upward',
          value: 0,
          target: 250,
          unit: 'g',
          percentage: 0
        }
      ],
      
      // 蛋白质摄入摘要
      proteinSummary: {
        today: 0,
        weekAverage: 0,
        completion: 0
      },
      
      // 蛋白质周数据图表
      weeklyProteinData: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '蛋白质摄入',
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: '目标摄入',
            data: [70, 70, 70, 70, 70, 70, 70]
          }
        ]
      },
      
      // 营养计划
      dietPlan: [
        {
          title: '增加蛋白质摄入',
          description: '每天摄入70g以上的优质蛋白质',
          progress: 60,
          completed: false
        },
        {
          title: '均衡饮食',
          description: '保证每日膳食多样性，包含足够的蔬果',
          progress: 80,
          completed: false
        },
        {
          title: '减少精制糖',
          description: '控制精制糖的摄入，选择低GI食物',
          progress: 45,
          completed: false
        }
      ],
      
      // 推荐食物
      recommendedFoods: [],
      
      // 控制弹窗
      showAddFood: false
    }
  },
  onLoad() {
    this.formatToday();
    this.loadNutritionData();
    this.loadProteinData();
    this.loadDietPlan();
    this.loadRecommendedFoods();
  },
  methods: {
    // 格式化当前日期
    formatToday() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      this.todayFormatted = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    },
    
    // 加载营养数据
    loadNutritionData() {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.request({
        url: '/api/nutrition/today-summary',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            const data = res.data.data;
            
            // 更新营养指标数据
            this.nutritionMetrics.forEach(metric => {
              if (data[metric.name.toLowerCase()]) {
                metric.value = data[metric.name.toLowerCase()].value;
                metric.percentage = Math.min(100, Math.round((metric.value / metric.target) * 100));
              }
            });
          }
        }
      });
    },
    
    // 加载蛋白质数据
    loadProteinData() {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      // 获取蛋白质摄入汇总数据
      uni.request({
        url: '/api/nutrition/protein-stats/summary',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.proteinSummary = res.data.data;
          }
        }
      });
      
      // 获取周蛋白质摄入数据
      uni.request({
        url: '/api/nutrition/protein-stats/weekly',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            const data = res.data.data;
            
            // 更新图表数据
            if (data.dates && data.values) {
              this.weeklyProteinData.categories = data.dates.map(date => {
                // 将日期格式化为"周一"、"周二"等
                const d = new Date(date);
                const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                return weekDays[d.getDay()];
              });
              
              this.weeklyProteinData.series[0].data = data.values;
              
              // 更新图表目标线
              if (data.target) {
                const targetArray = new Array(7).fill(data.target);
                this.weeklyProteinData.series[1].data = targetArray;
              }
            }
          }
        }
      });
    },
    
    // 加载营养计划
    loadDietPlan() {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.request({
        url: '/api/nutrition/diet-plan',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.dietPlan = res.data.data;
          }
        }
      });
    },
    
    // 加载推荐食物
    loadRecommendedFoods() {
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.request({
        url: '/api/nutrition/recommended-foods',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.recommendedFoods = res.data.data;
          }
        }
      });
    },
    
    // 显示添加食物弹窗
    showAddFoodPopup() {
      this.showAddFood = true;
    },
    
    // 导航到食物识别页面
    navToFoodRecognition() {
      this.showAddFood = false;
      uni.navigateTo({
        url: '/packageNutrition/pages/food-recognition/food-recognition'
      });
    },
    
    // 导航到蛋白质分析页面
    navToProteinAnalysis() {
      uni.navigateTo({
        url: '/packageNutrition/pages/protein-analysis/protein-analysis'
      });
    },
    
    // 导航到饮食建议页面
    navToDietSuggestion() {
      uni.navigateTo({
        url: '/packageNutrition/pages/diet-suggestion/diet-suggestion'
      });
    },
    
    // 导航到乳清蛋白管理页面
    navToWheyProtein() {
      uni.navigateTo({
        url: '/packageNutrition/pages/whey-protein/whey-protein'
      });
    },
    
    // 导航到食物库页面
    navToFoodLibrary() {
      this.showAddFood = false;
      uni.navigateTo({
        url: '/packageNutrition/pages/food-library/food-library'
      });
    },
    
    // 导航到营养历史记录页面
    navToNutritionHistory() {
      uni.navigateTo({
        url: '/packageNutrition/pages/nutrition-history/nutrition-history'
      });
    }
  }
}
</script>

<style lang="scss">
.nutrition-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx;
  margin-bottom: 100rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.today-date {
  font-size: 26rpx;
  color: #666666;
}

/* 营养指标卡片样式 */
.nutrition-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.nutrition-card {
  width: 48%;
  background-color: #f8f9fc;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.card-title {
  font-size: 28rpx;
  color: #333333;
}

.card-content {
  display: flex;
  align-items: baseline;
  margin-bottom: 10rpx;
}

.value {
  font-size: 36rpx;
  font-weight: bold;
  color: #2979ff;
}

.unit {
  font-size: 24rpx;
  color: #666666;
  margin-left: 4rpx;
}

.target-text {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
}

/* 蛋白质摄入样式 */
.protein-chart-container {
  height: 400rpx;
  width: 100%;
  margin-bottom: 20rpx;
}

.protein-chart-alternative {
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
    background-color: #2979ff;
    border-radius: 10rpx;
  }
  
  .chart-label {
    font-size: 22rpx;
    color: #666666;
    margin-top: 10rpx;
  }
  
  .chart-value {
    font-size: 24rpx;
    color: #333333;
    font-weight: bold;
    margin-top: 10rpx;
  }
  
  .chart-legend {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
  }
  
  .legend-color {
    width: 20rpx;
    height: 20rpx;
    background-color: #2979ff;
    border-radius: 50%;
    margin-right: 10rpx;
  }
  
  .legend-text {
    font-size: 24rpx;
    color: #666666;
  }
}

.protein-summary {
  display: flex;
  justify-content: space-between;
  padding-top: 20rpx;
  border-top: 1px solid #f0f0f0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 6rpx;
}

/* 营养计划样式 */
.plan-item {
  margin-bottom: 30rpx;
}

.plan-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.plan-item-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.plan-item-description {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

/* 快捷功能区样式 */
.action-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.action-item {
  width: 23%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  border-radius: 12rpx;
  background-color: #f8f9fc;
}

.action-title {
  font-size: 24rpx;
  color: #333333;
  margin-top: 16rpx;
}

/* 推荐食物区域样式 */
.food-scroll {
  white-space: nowrap;
}

.food-item {
  display: inline-block;
  width: 180rpx;
  margin-right: 20rpx;
}

.food-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
}

.food-name {
  font-size: 26rpx;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-protein {
  font-size: 22rpx;
  color: #666666;
}

/* 悬浮按钮样式 */
.floating-button {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  z-index: 999;
}

/* 添加食物弹窗样式 */
.add-food-popup {
  padding: 30rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.popup-content {
  padding: 20rpx 0;
}

.hint-text {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 30rpx;
  display: block;
}

.popup-actions {
  display: flex;
  flex-direction: column;
}

.popup-actions .u-button {
  margin-bottom: 20rpx;
}
</style>
