<template>
  <view class="nutrition-container">
    <u-navbar title="营养健康" :border="false" back-icon-color="#333333"></u-navbar>

    <view class="content-wrapper">
      <!-- 用户营养状态概览 -->
      <view class="section user-nutrition-status">
        <view class="section-header">
          <text class="section-title">营养摄入概览</text>
          <text class="today-date">{{ todayFormatted }}</text>
        </view>
        <view class="nutrition-grid">
          <view class="nutrition-card" v-for="(item, index) in nutritionMetrics" :key="index">
            <view class="card-header">
              <text class="card-title">{{ item.name }}</text>
              <u-icon :name="item.icon" size="24" color="#2979ff"></u-icon>
            </view>
            <view class="card-content">
              <text class="value" :class="getNutritionStatusClass(item.percentage)">{{ item.value }}</text>
              <text class="unit">{{ item.unit }}</text>
            </view>
            <view class="card-progress">
              <u-line-progress :percentage="item.percentage" :striped="true" :stripedActive="true" height="14"
                :activeColor="getNutritionStatusColor(item.percentage)"></u-line-progress>
              <text class="target-text">目标: {{ item.target }}{{ item.unit }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 蛋白质摄入情况 -->
      <view class="section protein-section">
        <view class="section-header">
          <text class="section-title">蛋白质摄入</text>
          <text class="right-link" @click="navToProteinAnalysis">详细 ></text>
        </view>
        <view class="protein-chart-container">
          <view class="protein-chart-alternative">
            <view class="reference-line"></view>
            <text class="reference-label">标准线(70g)</text>
            <view class="chart-bars">
              <view class="chart-bar-item" v-for="(item, idx) in weeklyProteinData.series[0].data" :key="idx">
                <text class="chart-value">{{ item }}g</text>
                <view class="chart-bar-wrapper">
                  <view class="chart-bar" :style="{
                    height: (item / 100 * 100) + 'px',
                    backgroundColor: item < weeklyProteinData.series[1].data[0] ? '#2979ff' : '#ff4d4f'
                  }"></view>
                </view>
                <text class="chart-label">{{ weeklyProteinData.categories[idx] }}</text>
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
            <text class="value">{{ proteinSummary.today }}g</text>
          </view>
          <view class="summary-item">
            <text class="label">周平均</text>
            <text class="value">{{ proteinSummary.weekAverage }}g</text>
          </view>
          <view class="summary-item">
            <text class="label">目标达成</text>
            <text class="value">{{ proteinSummary.completion }}%</text>
          </view>
        </view>
      </view>

      <!-- 营养计划完成情况 -->
      <view class="section diet-plan-section">
        <view class="section-header">
          <text class="section-title">营养计划进度</text>
          <text class="right-link" @click="navToDietSuggestion">建议 ></text>
        </view>
        <view class="diet-plan-progress">
          <view class="plan-item" v-for="(item, index) in dietPlan" :key="index">
            <view class="plan-item-header">
              <text class="plan-item-title">{{ item.title }}</text>
              <u-tag :text="item.completed ? '已完成' : '待完成'" :type="item.completed ? 'success' : 'warning'"
                size="mini"></u-tag>
            </view>
            <text class="plan-item-description">{{ item.description }}</text>
            <u-line-progress :percentage="item.progress" :striped="true" height="10"></u-line-progress>
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
          <view class="action-item" @click="navToNutritionHistory">
            <u-icon name="calendar" size="32" color="#2979ff"></u-icon>
            <text class="action-title">历史记录</text>
          </view>
          <view class="action-item" @click="showManualRecordPopup">
            <u-icon name="edit-pen" size="32" color="#2979ff"></u-icon>
            <text class="action-title">手动记录</text>
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
            <text class="food-name">{{ item.name }}</text>
            <text class="food-protein">蛋白质: {{ item.protein }}g/100g</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 悬浮按钮 - 添加食物记录 -->
    <view class="floating-button">
      <u-button type="primary" shape="circle" icon="plus" @click="navToFoodRecognition"></u-button>
    </view>

    <!-- 手动记录食物弹窗 -->
    <u-popup v-model="showManualRecord" mode="bottom" border-radius="16">
      <view class="add-food-popup">
        <view class="popup-header">
          <text class="popup-title">手动记录食物</text>
          <u-icon name="close" @click="showManualRecord = false"></u-icon>
        </view>
        <view class="popup-content">
          <!-- 手动记录表单 -->
          <u-form :model="manualFoodData" ref="manualFoodForm" label-width="160">
            <u-form-item label="食物名称" required>
              <u-input v-model="manualFoodData.name" placeholder="请输入食物名称"></u-input>
            </u-form-item>
            <u-form-item label="数量(克)" required>
              <u-number-box v-model="manualFoodData.amount" :min="1" :max="2000"></u-number-box>
            </u-form-item>
            <u-form-item label="热量(卡路里)">
              <u-input v-model="manualFoodData.calories" placeholder="请输入热量" type="number"></u-input>
            </u-form-item>
            <u-form-item label="蛋白质(克)">
              <u-input v-model="manualFoodData.protein" placeholder="请输入蛋白质" type="number"></u-input>
            </u-form-item>
            <u-form-item label="脂肪(克)">
              <u-input v-model="manualFoodData.fat" placeholder="请输入脂肪" type="number"></u-input>
            </u-form-item>
            <u-form-item label="碳水(克)">
              <u-input v-model="manualFoodData.carbs" placeholder="请输入碳水" type="number"></u-input>
            </u-form-item>
            <u-form-item label="餐食类型">
              <u-radio-group v-model="manualFoodData.mealType">
                <u-radio label="早餐" name="breakfast"></u-radio>
                <u-radio label="午餐" name="lunch"></u-radio>
                <u-radio label="晚餐" name="dinner"></u-radio>
                <u-radio label="加餐" name="snack"></u-radio>
              </u-radio-group>
            </u-form-item>
          </u-form>
          <view class="form-actions">
            <u-button type="primary" @click="submitManualFood">确认添加</u-button>
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
          icon: 'eye',
          value: 354,
          target: 2000,
          unit: 'kcal',
          percentage: 2
        },
        {
          name: '蛋白质',
          icon: 'star',
          value: 23,
          target: 70,
          unit: 'g',
          percentage: 23
        },
        {
          name: '脂肪',
          icon: 'heart',
          value: 38,
          target: 65,
          unit: 'g',
          percentage: 65
        },
        {
          name: '碳水',
          icon: 'arrow-upward',
          value: 544,
          target: 250,
          unit: 'g',
          percentage: 150
        }
      ],

      // 蛋白质周数据图表
      weeklyProteinData: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          {
            name: '蛋白质摄入',
            data: [65, 72, 58, 63, 70, 55, 68]
          },
          {
            name: '目标摄入',
            data: [70, 70, 70, 70, 70, 70, 70]
          }
        ]
      },

      // 蛋白质摄入摘要
      proteinSummary: {
        today: 68,
        weekAverage: 64.4,
        completion: 92
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
      showAddFood: false,

      // 手动记录食物
      showManualRecord: false,
      manualFoodData: {
        name: '',
        amount: 100,
        calories: '',
        protein: '',
        fat: '',
        carbs: '',
        mealType: 'lunch'
      },
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

    // 显示手动记录弹窗
    showManualRecordPopup() {
      this.showManualRecord = true;
    },

    // 提交手动记录的食物
    submitManualFood() {
      // 验证必填字段
      if (!this.manualFoodData.name || !this.manualFoodData.amount) {
        uni.showToast({
          title: '请填写食物名称和数量',
          icon: 'none'
        });
        return;
      }

      // 获取认证信息
      const token = uni.getStorageSync('token') || '';

      // 构建食物摄入数据
      const foodData = {
        name: this.manualFoodData.name,
        amount: this.manualFoodData.amount,
        calories: parseFloat(this.manualFoodData.calories) || 0,
        protein: parseFloat(this.manualFoodData.protein) || 0,
        fat: parseFloat(this.manualFoodData.fat) || 0,
        carbs: parseFloat(this.manualFoodData.carbs) || 0,
        mealType: this.manualFoodData.mealType,
        timestamp: new Date().toISOString(),
        notes: '手动添加'
      };

      // 提交数据
      uni.request({
        url: '/api/nutrition/manual-food-intake',
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: foodData,
        success: (res) => {
          if (res.data.code === 0) {
            uni.showToast({
              title: '记录成功',
              icon: 'success'
            });

            // 关闭弹窗并重置表单
            this.showManualRecord = false;
            this.manualFoodData = {
              name: '',
              amount: 100,
              calories: '',
              protein: '',
              fat: '',
              carbs: '',
              mealType: 'lunch'
            };

            // 刷新数据
            this.loadNutritionData();
          } else {
            uni.showToast({
              title: res.data.message || '记录失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
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

    // 导航到营养历史记录页面
    navToNutritionHistory() {
      uni.navigateTo({
        url: '/packageNutrition/pages/nutrition-history/nutrition-history'
      });
    },

    // 获取营养摄入状态对应的样式类名
    getNutritionStatusClass(percentage) {
      if (percentage > 100) {
        return 'value-warning-high';
      } else if (percentage < 50) {
        return 'value-warning-low';
      }
      return '';
    },

    // 获取营养摄入状态对应的颜色
    getNutritionStatusColor(percentage) {
      if (percentage > 100) {
        return '#ff4d4f';  // 红色
      } else if (percentage < 50) {
        return '#fa8c16';  // 橙色
      }
      return '#2979ff';    // 默认蓝色
    }
  }
}
</script>

<style lang="scss">
@import './nutrition-index.scss';
</style>
