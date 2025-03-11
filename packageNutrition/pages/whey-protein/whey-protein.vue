<template>
  <view class="whey-protein-container">
    <u-navbar title="乳清蛋白管理" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <protein-usage :usageData="usageData"></protein-usage>
      <protein-record :recordList="recordList" @add-record="openAddRecord"></protein-record>
      <protein-stock :stockData="stockData" @add-stock="openAddStock"></protein-stock>
    </view>
    
    <!-- 弹窗组件 -->
    <add-record-popup 
      v-if="showAddRecord" 
      @close="showAddRecord = false"
      @submit="submitRecord"
    ></add-record-popup>
    
    <add-stock-popup 
      v-if="showAddStock" 
      @close="showAddStock = false"
      @submit="submitStock"
    ></add-stock-popup>
  </view>
</template>

<script>
import proteinUsage from './components/protein-usage.vue'
import proteinRecord from './components/protein-record.vue'
import proteinStock from './components/protein-stock.vue'
import addRecordPopup from './components/add-record-popup.vue'
import addStockPopup from './components/add-stock-popup.vue'

export default {
  components: {
    proteinUsage,
    proteinRecord,
    proteinStock,
    addRecordPopup,
    addStockPopup
  },
  data() {
    return {
      usageData: {
        total: 0,
        month: 0,
        week: 0,
        today: 0
      },
      recordList: [],
      stockData: {
        total: 0,
        items: []
      },
      showAddRecord: false,
      showAddStock: false
    }
  },
  onLoad() {
    this.loadProteinData();
  },
  methods: {
    loadProteinData() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取乳清蛋白使用数据
      uni.request({
        url: '/api/nutrition/whey-protein/usage',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.usageData = res.data.data;
          }
        }
      });
      
      // 获取乳清蛋白记录
      uni.request({
        url: '/api/nutrition/whey-protein/records',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.recordList = res.data.data;
          }
        }
      });
      
      // 获取乳清蛋白库存数据
      uni.request({
        url: '/api/nutrition/whey-protein/stock',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.stockData = res.data.data;
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
    
    openAddRecord() {
      this.showAddRecord = true;
    },
    
    openAddStock() {
      this.showAddStock = true;
    },
    
    submitRecord(recordData) {
      uni.showLoading({
        title: '提交中...'
      });
      
      uni.request({
        url: '/api/nutrition/whey-protein/add-record',
        method: 'POST',
        data: recordData,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '记录成功',
              icon: 'success'
            });
            
            this.showAddRecord = false;
            this.loadProteinData(); // 刷新数据
          } else {
            uni.showToast({
              title: res.data.message || '记录失败',
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
    
    submitStock(stockData) {
      uni.showLoading({
        title: '提交中...'
      });
      
      uni.request({
        url: '/api/nutrition/whey-protein/add-stock',
        method: 'POST',
        data: stockData,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '添加成功',
              icon: 'success'
            });
            
            this.showAddStock = false;
            this.loadProteinData(); // 刷新数据
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
@import "./whey-protein.scss";
</style>
