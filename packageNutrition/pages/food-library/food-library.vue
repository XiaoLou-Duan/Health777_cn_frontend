<template>
  <view class="food-library-container">
    <u-navbar title="食物库" :border="false" back-icon-color="#333333"></u-navbar>
    
    <view class="content-wrapper">
      <!-- 搜索区域 -->
      <view class="search-container">
        <u-search
          v-model="searchKeyword"
          placeholder="搜索食物名称"
          :show-action="true"
          @search="searchFood"
          @clear="resetSearch"
        ></u-search>
        <view class="filter-tags">
          <u-tag 
            v-for="(tag, index) in filterTags" 
            :key="index"
            :text="tag.text" 
            :plain="!tag.active"
            @click="toggleFilter(index)"
            size="mini"
            :type="tag.active ? 'primary' : 'info'"
            class="filter-tag"
          ></u-tag>
        </view>
      </view>
      
      <!-- 食物分类列表 -->
      <view class="food-categories" v-if="!searchKeyword">
        <view class="category-section" v-for="(category, cIndex) in foodCategories" :key="cIndex">
          <view class="category-header">
            <text class="category-title">{{category.name}}</text>
            <u-icon name="arrow-right" color="#999999" size="28"></u-icon>
          </view>
          <scroll-view scroll-x class="food-scroll">
            <view 
              class="food-item" 
              v-for="(food, fIndex) in category.foods" 
              :key="fIndex"
              @click="showFoodDetail(food)"
            >
              <image class="food-image" :src="food.image" mode="aspectFill"></image>
              <text class="food-name">{{food.name}}</text>
              <text class="food-protein">蛋白质: {{food.protein}}g/100g</text>
            </view>
          </scroll-view>
        </view>
      </view>
      
      <!-- 搜索结果列表 -->
      <view class="search-results" v-else>
        <text class="result-count">找到 {{searchResults.length}} 个结果</text>
        <view class="food-grid">
          <view 
            class="food-grid-item" 
            v-for="(food, index) in searchResults" 
            :key="index"
            @click="showFoodDetail(food)"
          >
            <image class="food-grid-image" :src="food.image" mode="aspectFill"></image>
            <view class="food-grid-info">
              <text class="food-grid-name">{{food.name}}</text>
              <view class="food-grid-nutrition">
                <text class="nutrition-item">蛋白质: {{food.protein}}g</text>
                <text class="nutrition-item">热量: {{food.calories}}kcal</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多提示 -->
      <u-loadmore :status="loadMoreStatus" v-if="!isLoading && foodList.length > 0"></u-loadmore>
    </view>
    
    <!-- 食物详情弹窗 -->
    <u-popup v-model="showDetail" mode="bottom" border-radius="16">
      <view class="food-detail-popup">
        <view class="popup-header">
          <text class="popup-title">食物详情</text>
          <u-icon name="close" @click="showDetail = false"></u-icon>
        </view>
        <view class="food-detail-content" v-if="selectedFood">
          <view class="food-detail-basic">
            <image class="detail-image" :src="selectedFood.image" mode="aspectFill"></image>
            <view class="detail-info">
              <text class="detail-name">{{selectedFood.name}}</text>
              <text class="detail-category">分类: {{selectedFood.category}}</text>
              <view class="detail-tags">
                <u-tag v-for="(tag, index) in selectedFood.tags" :key="index" :text="tag" size="mini" type="info" class="detail-tag"></u-tag>
              </view>
            </view>
          </view>
          
          <view class="nutrition-table">
            <view class="table-header">
              <text class="table-title">营养成分表 (每100g)</text>
            </view>
            <view class="table-row">
              <text class="row-label">热量</text>
              <text class="row-value">{{selectedFood.calories}} kcal</text>
            </view>
            <view class="table-row">
              <text class="row-label">蛋白质</text>
              <text class="row-value">{{selectedFood.protein}} g</text>
            </view>
            <view class="table-row">
              <text class="row-label">脂肪</text>
              <text class="row-value">{{selectedFood.fat}} g</text>
            </view>
            <view class="table-row">
              <text class="row-label">碳水化合物</text>
              <text class="row-value">{{selectedFood.carbs}} g</text>
            </view>
            <view class="table-row">
              <text class="row-label">膳食纤维</text>
              <text class="row-value">{{selectedFood.fiber}} g</text>
            </view>
          </view>
          
          <view class="food-description">
            <text class="description-title">简介</text>
            <text class="description-content">{{selectedFood.description}}</text>
          </view>
          
          <view class="cooking-methods" v-if="selectedFood.cookingMethods && selectedFood.cookingMethods.length > 0">
            <text class="cooking-title">推荐烹饪方式</text>
            <view class="cooking-tags">
              <u-tag 
                v-for="(method, index) in selectedFood.cookingMethods" 
                :key="index" 
                :text="method" 
                type="primary" 
                plain 
                size="mini"
                class="cooking-tag"
              ></u-tag>
            </view>
          </view>
          
          <view class="add-intake-section">
            <text class="add-title">添加到今日摄入</text>
            <view class="portion-control">
              <text class="portion-label">份量(克):</text>
              <u-number-box v-model="intakeAmount" :min="10" :max="500" :step="10"></u-number-box>
            </view>
            <view class="meal-type-selection">
              <text class="meal-type-label">餐食类型:</text>
              <u-radio-group v-model="mealType">
                <u-radio 
                  v-for="(type, index) in mealTypes" 
                  :key="index" 
                  :name="type.value" 
                  :label="type.label"
                ></u-radio>
              </u-radio-group>
            </view>
            <view class="notes-input">
              <u-form-item> 
                v-model="intakeNotes" 
                label="备注" 
                placeholder="添加备注信息"
                :border-bottom="false"
              ></u-form-item>
            </view>
            <u-button type="primary" @click="addFoodIntake">确认添加</u-button>
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
      // 搜索相关
      searchKeyword: '',
      searchResults: [],
      
      // 筛选标签
      filterTags: [
        { text: '高蛋白', active: false },
        { text: '低脂肪', active: false },
        { text: '低碳水', active: false },
        { text: '高纤维', active: false },
        { text: '易消化', active: false },
        { text: '肌少症友好', active: false }
      ],
      
      // 食物数据
      foodList: [],
      foodCategories: [],
      isLoading: true,
      loadMoreStatus: 'loading', // 'loadmore', 'loading', 'nomore'
      
      // 详情弹窗
      showDetail: false,
      selectedFood: null,
      
      // 添加食物摄入
      intakeAmount: 100,
      mealType: 'lunch',
      mealTypes: [
        { label: '早餐', value: 'breakfast' },
        { label: '午餐', value: 'lunch' },
        { label: '晚餐', value: 'dinner' },
        { label: '加餐', value: 'snack' }
      ],
      intakeNotes: ''
    }
  },
  onLoad() {
    this.loadFoodLibrary();
  },
  onReachBottom() {
    if (this.loadMoreStatus !== 'nomore') {
      this.loadMoreFoods();
    }
  },
  methods: {
    // 加载食物库数据
    loadFoodLibrary() {
      this.isLoading = true;
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.request({
        url: '/api/nutrition/food-library',
        method: 'GET',
        header: header,
        success: (res) => {
          if (res.data.code === 0) {
            this.foodList = res.data.data || [];
            this.processFoodData();
          } else {
            uni.showToast({
              title: res.data.message || '获取食物库失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          this.isLoading = false;
          uni.stopPullDownRefresh();
        }
      });
    },
    
    // 处理食物数据，按分类整理
    processFoodData() {
      // 获取所有分类
      const categories = [...new Set(this.foodList.map(item => item.category))];
      
      // 构建分类数据
      this.foodCategories = categories.map(category => {
        return {
          name: category,
          foods: this.foodList.filter(food => food.category === category)
        };
      });
      
      // 设置加载状态
      this.loadMoreStatus = this.foodList.length < 50 ? 'nomore' : 'loadmore';
    },
    
    // 加载更多食物
    loadMoreFoods() {
      if (this.isLoading) return;
      
      this.loadMoreStatus = 'loading';
      this.isLoading = true;
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.request({
        url: '/api/nutrition/food-library',
        method: 'GET',
        header: header,
        data: {
          offset: this.foodList.length,
          limit: 20
        },
        success: (res) => {
          if (res.data.code === 0) {
            const newFoods = res.data.data || [];
            
            if (newFoods.length > 0) {
              this.foodList = [...this.foodList, ...newFoods];
              this.processFoodData();
              this.loadMoreStatus = 'loadmore';
            } else {
              this.loadMoreStatus = 'nomore';
            }
          } else {
            this.loadMoreStatus = 'loadmore';
            uni.showToast({
              title: res.data.message || '加载失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          this.loadMoreStatus = 'loadmore';
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    },
    
    // 搜索食物
    searchFood() {
      if (!this.searchKeyword.trim()) {
        this.resetSearch();
        return;
      }
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      this.isLoading = true;
      
      // 构建筛选条件
      const filters = this.filterTags
        .filter(tag => tag.active)
        .map(tag => tag.text);
      
      uni.request({
        url: '/api/nutrition/search-food',
        method: 'GET',
        header: header,
        data: {
          keyword: this.searchKeyword,
          filters: filters.length > 0 ? filters.join(',') : ''
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.searchResults = res.data.data || [];
          } else {
            uni.showToast({
              title: res.data.message || '搜索失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    },
    
    // 重置搜索
    resetSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      
      // 重置筛选标签
      this.filterTags.forEach(tag => {
        tag.active = false;
      });
    },
    
    // 切换筛选标签
    toggleFilter(index) {
      this.filterTags[index].active = !this.filterTags[index].active;
      
      // 如果有关键词，则重新搜索
      if (this.searchKeyword.trim()) {
        this.searchFood();
      }
    },
    
    // 显示食物详情
    showFoodDetail(food) {
      this.selectedFood = food;
      this.showDetail = true;
      
      // 重置添加摄入相关数据
      this.intakeAmount = 100;
      this.mealType = 'lunch';
      this.intakeNotes = '';
    },
    
    // 添加食物摄入记录
    addFoodIntake() {
      if (!this.selectedFood) return;
      
      // 获取认证信息
      const token = uni.getStorageSync('token') || '';
      const header = {
        'Authorization': 'Bearer ' + token
      };
      
      uni.showLoading({
        title: '添加中...'
      });
      
      uni.request({
        url: '/api/nutrition/food-intake',
        method: 'POST',
        header: header,
        data: {
          foodId: this.selectedFood.id,
          amount: this.intakeAmount,
          mealType: this.mealType,
          notes: this.intakeNotes,
          timestamp: new Date().toISOString()
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '添加成功',
              icon: 'success'
            });
            
            // 关闭弹窗
            this.showDetail = false;
          } else {
            uni.showToast({
              title: res.data.message || '添加失败',
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
    }
  }
}
</script>

<style lang="scss">
.food-library-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx;
}

/* 搜索区域样式 */
.search-container {
  margin-bottom: 30rpx;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.filter-tag {
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}

/* 食物分类样式 */
.food-categories {
  margin-top: 20rpx;
}

.category-section {
  margin-bottom: 40rpx;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

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

/* 搜索结果样式 */
.search-results {
  padding: 20rpx 0;
}

.result-count {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 20rpx;
  display: block;
}

.food-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.food-grid-item {
  width: 48%;
  margin-bottom: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.food-grid-image {
  width: 100%;
  height: 200rpx;
}

.food-grid-info {
  padding: 16rpx;
}

.food-grid-name {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 10rpx;
}

.food-grid-nutrition {
  display: flex;
  flex-direction: column;
}

.nutrition-item {
  font-size: 22rpx;
  color: #666666;
  margin-top: 4rpx;
}

/* 食物详情弹窗样式 */
.food-detail-popup {
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: scroll;
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

.food-detail-basic {
  display: flex;
  margin-bottom: 30rpx;
}

.detail-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.detail-category {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
}

.detail-tag {
  margin-right: 12rpx;
  margin-bottom: 12rpx;
}

/* 营养成分表样式 */
.nutrition-table {
  background-color: #f8f9fc;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.table-header {
  margin-bottom: 16rpx;
}

.table-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  border-bottom: 1px solid #eeeeee;
}

.table-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 26rpx;
  color: #666666;
}

.row-value {
  font-size: 26rpx;
  color: #333333;
  font-weight: bold;
}

/* 食物描述样式 */
.food-description {
  margin-bottom: 30rpx;
}

.description-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
  display: block;
}

.description-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}

/* 烹饪方式样式 */
.cooking-methods {
  margin-bottom: 30rpx;
}

.cooking-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.cooking-tags {
  display: flex;
  flex-wrap: wrap;
}

.cooking-tag {
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}

/* 添加摄入部分样式 */
.add-intake-section {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1px solid #eeeeee;
}

.add-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

.portion-control {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.portion-label {
  font-size: 26rpx;
  color: #666666;
  margin-right: 20rpx;
}

.meal-type-selection {
  margin-bottom: 30rpx;
}

.meal-type-label {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 16rpx;
  display: block;
}

.notes-input {
  margin-bottom: 30rpx;
}
</style>
