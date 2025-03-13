<template>
  <view class="nutrition-history-container">
    <u-navbar title="营养记录" :border="false" back-icon-color="#333333"></u-navbar>
    
    <view class="content-wrapper">
      <!-- 日期选择器 -->
      <view class="date-picker-section">
        <view class="date-tabs">
          <view 
            class="date-tab" 
            :class="{'active': dateRange === 'today'}" 
            @click="changeRange('today')"
          >今日</view>
          <view 
            class="date-tab" 
            :class="{'active': dateRange === 'week'}" 
            @click="changeRange('week')"
          >本周</view>
          <view 
            class="date-tab" 
            :class="{'active': dateRange === 'month'}" 
            @click="changeRange('month')"
          >本月</view>
          <view 
            class="date-tab custom-tab" 
            :class="{'active': dateRange === 'custom'}" 
            @click="showDatePicker"
          >自定义</view>
        </view>
        <view class="selected-date-range" v-if="dateRange === 'custom'">
          <text>{{startDateFormatted}} 至 {{endDateFormatted}}</text>
        </view>
      </view>
      
      <!-- 营养摄入统计 -->
      <view class="nutrition-summary">
        <view class="summary-card">
          <view class="card-header">
            <text class="card-title">总计摄入</text>
          </view>
          <view class="summary-grid">
            <view class="summary-item" v-for="(item, index) in nutritionSummary" :key="index">
              <text class="summary-label">{{item.name}}</text>
              <text class="summary-value">{{item.value}}{{item.unit}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 按日期分组的食物记录 -->
      <view class="food-records">
        <view class="date-group" v-for="(group, index) in groupedRecords" :key="index">
          <view class="date-header">
            <text class="date-text">{{group.date}}</text>
            <text class="total-calories">{{group.totalCalories}} 卡路里</text>
          </view>
          
          <view class="meal-group" v-for="(meal, mIndex) in group.meals" :key="mIndex">
            <view class="meal-header">
              <text class="meal-title">{{getMealTypeName(meal.type)}}</text>
              <text class="meal-calories">{{meal.calories}} 卡路里</text>
            </view>
            
            <view class="food-item" v-for="(food, fIndex) in meal.foods" :key="fIndex">
              <image class="food-image" :src="food.image" mode="aspectFill"></image>
              <view class="food-info">
                <text class="food-name">{{food.name}}</text>
                <text class="food-amount">{{food.amount}}g</text>
              </view>
              <view class="food-nutrition">
                <text class="nutrition-text">{{food.calories}}卡路里</text>
                <text class="nutrition-text">蛋白质: {{food.protein}}g</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 无数据提示 -->
      <view class="empty-state" v-if="groupedRecords.length === 0">
        <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
        <text class="empty-text">该日期范围内暂无食物记录</text>
        <u-button type="primary" size="medium" @click="navToFoodRecognition">添加食物记录</u-button>
      </view>
    </view>
    
    <!-- 日期选择器弹窗 -->
    <u-calendar 
      v-model="showCalendar" 
      mode="range" 
      :max-date="maxDate" 
      :min-date="minDate"
      @confirm="onDateSelected"
      @close="showCalendar = false"
    ></u-calendar>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 日期范围
      dateRange: 'today', // today, week, month, custom
      startDate: new Date(),
      endDate: new Date(),
      startDateFormatted: '',
      endDateFormatted: '',
      showCalendar: false,
      minDate: this.getYearAgoStr(),
      maxDate: this.formatDate(new Date()),
      
      // 营养摄入统计
      nutritionSummary: [
        { name: '热量', value: 0, unit: '卡路里' },
        { name: '蛋白质', value: 0, unit: 'g' },
        { name: '脂肪', value: 0, unit: 'g' },
        { name: '碳水', value: 0, unit: 'g' }
      ],
      
      // 食物记录
      foodRecords: [],
      groupedRecords: [],
      
      // 示例数据
      demoFoodRecords: [
        {
          id: '001',
          name: '煎鸡胸肉',
          amount: 150,
          calories: 240,
          protein: 45,
          fat: 6,
          carbs: 0,
          image: '/static/img/demo/chicken-breast.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5小时前
          mealType: 'lunch'
        },
        {
          id: '002',
          name: '燕麦片',
          amount: 100,
          calories: 389,
          protein: 13,
          fat: 7,
          carbs: 66,
          image: '/static/img/demo/oatmeal.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 10, // 10小时前
          mealType: 'breakfast'
        },
        {
          id: '003',
          name: '蔬菜沙拉',
          amount: 200,
          calories: 120,
          protein: 4,
          fat: 5,
          carbs: 15,
          image: '/static/img/demo/salad.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4小时前
          mealType: 'lunch'
        },
        {
          id: '004',
          name: '香蕉',
          amount: 120,
          calories: 105,
          protein: 1.3,
          fat: 0.4,
          carbs: 27,
          image: '/static/img/demo/banana.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8小时前
          mealType: 'breakfast'
        },
        {
          id: '005',
          name: '牛肉炒饭',
          amount: 300,
          calories: 450,
          protein: 25,
          fat: 15,
          carbs: 55,
          image: '/static/img/demo/beef-rice.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1小时前
          mealType: 'dinner'
        },
        {
          id: '006',
          name: '酸奶',
          amount: 200,
          calories: 150,
          protein: 8,
          fat: 3.5,
          carbs: 12,
          image: '/static/img/demo/yogurt.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3小时前
          mealType: 'snack'
        },
        // 昨天的食物
        {
          id: '007',
          name: '全麦面包',
          amount: 80,
          calories: 216,
          protein: 8,
          fat: 3,
          carbs: 41,
          image: '/static/img/demo/bread.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 60 * 10, // 昨天早上
          mealType: 'breakfast'
        },
        {
          id: '008',
          name: '鲑鱼',
          amount: 180,
          calories: 367,
          protein: 39,
          fat: 22,
          carbs: 0,
          image: '/static/img/demo/salmon.jpg',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 60 * 5, // 昨天午餐
          mealType: 'lunch'
        }
      ],
      
      // 是否使用示例数据(测试环境使用)
      useDemo: true
    }
  },
  onLoad() {
    this.initDates();
    this.loadFoodRecords();
  },
  methods: {
    // 初始化日期
    initDates() {
      const now = new Date();
      this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      this.formatDates();
    },
    
    // 格式化日期显示
    formatDates() {
      this.startDateFormatted = this.formatDate(this.startDate);
      this.endDateFormatted = this.formatDate(this.endDate);
    },
    
    // 日期格式化工具
    formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    },
    
    // 获取一年前的日期
    getYearAgo() {
      const now = new Date();
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    },
    
    // 获取一年前的日期字符串
    getYearAgoStr() {
      return this.formatDate(this.getYearAgo());
    },
    
    // 修改日期范围
    changeRange(range) {
      this.dateRange = range;
      const now = new Date();
      
      switch(range) {
        case 'today':
          this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          // 设置为本周的周一到周日
          const dayOfWeek = now.getDay() || 7; // 转换周日为7
          this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1);
          this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 7);
          break;
        case 'month':
          // 设置为本月第一天到本月最后一天
          this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
      }
      
      this.formatDates();
      this.loadFoodRecords();
    },
    
    // 显示日期选择器
    showDatePicker() {
      this.dateRange = 'custom';
      this.showCalendar = true;
    },
    
    // 日期选择确认
    onDateSelected(e) {
      // 组件返回的日期格式可能需要转换，这里假设返回的是两个日期对象
      this.startDate = new Date(e[0]);
      this.endDate = new Date(e[1]);
      this.formatDates();
      this.loadFoodRecords();
    },
    
    // 加载食物记录
    loadFoodRecords() {
      // 使用示例数据(测试时或开发时)
      if(this.useDemo) {
        // 过滤示例数据，只保留选定日期范围内的记录
        this.foodRecords = this.demoFoodRecords.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= this.startDate && recordDate <= new Date(this.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
        });
        this.processRecords();
        this.calculateSummary();
        return;
      }
      
      // 正式环境获取API数据
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      let isLoading = true;
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/nutrition/food-intake-history',
        method: 'GET',
        header: header,
        data: {
          startDate: this.formatDate(this.startDate),
          endDate: this.formatDate(this.endDate)
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.foodRecords = res.data.data || [];
            this.processRecords();
            this.calculateSummary();
          } else {
            uni.showToast({
              title: res.data.message || '获取记录失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          // API请求失败时，使用示例数据
          this.foodRecords = this.demoFoodRecords.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= this.startDate && recordDate <= new Date(this.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
          });
          this.processRecords();
          this.calculateSummary();
          
          uni.showToast({
            title: '使用示例数据',
            icon: 'none'
          });
        },
        complete: () => {
          if (isLoading) {
            isLoading = false;
            uni.hideLoading();
          }
        }
      });
    },
    
    // 处理记录，按日期和餐食类型分组
    processRecords() {
      // 按日期分组
      const dateGroups = {};
      
      this.foodRecords.forEach(record => {
        const recordDate = new Date(record.timestamp);
        const dateStr = this.formatDate(recordDate);
        
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            date: dateStr,
            totalCalories: 0,
            meals: {
              breakfast: { type: 'breakfast', calories: 0, foods: [] },
              lunch: { type: 'lunch', calories: 0, foods: [] },
              dinner: { type: 'dinner', calories: 0, foods: [] },
              snack: { type: 'snack', calories: 0, foods: [] }
            }
          };
        }
        
        // 添加到对应的餐食类型
        const mealType = record.mealType || 'snack';
        dateGroups[dateStr].meals[mealType].foods.push(record);
        dateGroups[dateStr].meals[mealType].calories += record.calories || 0;
        dateGroups[dateStr].totalCalories += record.calories || 0;
      });
      
      // 转换为数组并排序
      this.groupedRecords = Object.values(dateGroups)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(group => {
          // 转换餐食对象为数组
          group.meals = Object.values(group.meals).filter(meal => meal.foods.length > 0);
          return group;
        });
    },
    
    // 计算营养摄入总计
    calculateSummary() {
      // 重置统计数据
      this.nutritionSummary.forEach(item => {
        item.value = 0;
      });
      
      // 统计所有记录的营养成分
      this.foodRecords.forEach(record => {
        this.nutritionSummary[0].value += record.calories || 0;
        this.nutritionSummary[1].value += record.protein || 0;
        this.nutritionSummary[2].value += record.fat || 0;
        this.nutritionSummary[3].value += record.carbs || 0;
      });
      
      // 保留两位小数
      this.nutritionSummary.forEach(item => {
        item.value = parseFloat(item.value.toFixed(1));
      });
    },
    
    // 获取餐食类型名称
    getMealTypeName(type) {
      const mealTypes = {
        breakfast: '早餐',
        lunch: '午餐',
        dinner: '晚餐',
        snack: '加餐'
      };
      
      return mealTypes[type] || '其它';
    },
    
    // 导航到食物识别页面
    navToFoodRecognition() {
      uni.navigateTo({
        url: '/packageNutrition/pages/food-recognition/food-recognition'
      });
    }
  }
}
</script>

<style lang="scss">
  @import "./nutrition-history.scss";
</style>
