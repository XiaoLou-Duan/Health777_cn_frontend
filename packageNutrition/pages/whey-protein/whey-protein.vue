<template>
  <view class="whey-protein-container">
    <u-navbar title="乳清蛋白管理" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <protein-usage :usageData="usageData"></protein-usage>
      <protein-record :recordList="recordList" @add-record="openAddRecord"></protein-record>
      <!-- <protein-stock :stockData="stockData" @add-stock="openAddStock"></protein-stock> -->
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
    // 使用模拟数据替代实际网络请求
    this.loadMockData();
  },
  methods: {
    // 原有的loadProteinData方法保留不变
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
    
    // 生成模拟数据
    loadMockData() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 生成模拟使用数据
      this.usageData = this.generateMockUsageData();
      
      // 生成模拟记录数据
      this.recordList = this.generateMockRecordList();
      
      // 生成模拟库存数据
      this.stockData = this.generateMockStockData();
      
      setTimeout(() => {
        uni.hideLoading();
      }, 500);
    },
    
    // 生成模拟使用数据
    generateMockUsageData() {
      const today = Math.floor(Math.random() * 30) + 10;
      const week = today + Math.floor(Math.random() * 100) + 50;
      const month = week + Math.floor(Math.random() * 200) + 100;
      const total = month + Math.floor(Math.random() * 500) + 300;
      
      return {
        total, // 总使用量 (g)
        month, // 本月使用量 (g)
        week,  // 本周使用量 (g)
        today  // 今日使用量 (g)
      };
    },
    
    // 生成模拟记录列表
    generateMockRecordList() {
      const brands = ['肌肉科技', '乐力', 'ON', 'MyProtein', '康比特', 'Dymatize'];
      const flavors = ['香草味', '巧克力味', '草莓味', '香蕉味', '原味', '咖啡味'];
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 
                   '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                   '21', '22', '23', '24', '25', '26', '27', '28'];
      const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
      
      const recordList = [];
      const currentYear = new Date().getFullYear();
      
      // 生成20条随机记录
      for (let i = 0; i < 20; i++) {
        const amount = Math.floor(Math.random() * 30) + 20; // 20-50g
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const flavor = flavors[Math.floor(Math.random() * flavors.length)];
        const month = months[Math.floor(Math.random() * months.length)];
        const day = days[Math.floor(Math.random() * days.length)];
        const hour = hours[Math.floor(Math.random() * hours.length)];
        const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        
        recordList.push({
          id: 1000 + i,
          amount: amount,
          brand: brand,
          flavor: flavor,
          remark: Math.random() > 0.7 ? `训练${Math.random() > 0.5 ? '前' : '后'}补充` : '',
          createTime: `${currentYear}-${month}-${day} ${hour}:${minute}:00`
        });
      }
      
      // 按时间倒序排列
      return recordList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },
    
    // 生成模拟库存数据
    generateMockStockData() {
      const brands = ['肌肉科技', '乐力', 'ON', 'MyProtein'];
      const flavors = ['香草味', '巧克力味', '草莓味', '香蕉味', '原味'];
      
      const items = [];
      let total = 0;
      
      // 生成3-5条库存记录
      const itemCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < itemCount; i++) {
        const remaining = Math.floor(Math.random() * 800) + 200; // 200-1000g
        total += remaining;
        
        items.push({
          id: 2000 + i,
          brand: brands[Math.floor(Math.random() * brands.length)],
          flavor: flavors[Math.floor(Math.random() * flavors.length)],
          capacity: Math.floor(Math.random() * 4 + 1) * 500, // 500g, 1kg, 1.5kg, 2kg
          remaining: remaining,
          expiryDate: `2023-${Math.floor(Math.random() * 3 + 10)}-${Math.floor(Math.random() * 28 + 1)}` // 未来3个月内
        });
      }
      
      return {
        total: total,
        items: items
      };
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
      
      // 模拟提交请求
      setTimeout(() => {
        uni.hideLoading();
        
        // 生成新ID
        const newId = this.recordList.length > 0 ? 
          Math.max(...this.recordList.map(item => item.id)) + 1 : 1000;
        
        // 创建新记录
        const newRecord = {
          id: newId,
          ...recordData,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        // 添加到列表开头
        this.recordList.unshift(newRecord);
        
        // 更新使用数据
        this.usageData.total += Number(recordData.amount);
        this.usageData.month += Number(recordData.amount);
        this.usageData.week += Number(recordData.amount);
        this.usageData.today += Number(recordData.amount);
        
        uni.showToast({
          title: '记录成功',
          icon: 'success'
        });
        
        this.showAddRecord = false;
      }, 500);
    },
    
    submitStock(stockData) {
      uni.showLoading({
        title: '提交中...'
      });
      
      // 模拟提交请求
      setTimeout(() => {
        uni.hideLoading();
        
        // 生成新ID
        const newId = this.stockData.items.length > 0 ? 
          Math.max(...this.stockData.items.map(item => item.id)) + 1 : 2000;
        
        // 创建新库存
        const newStock = {
          id: newId,
          ...stockData,
          remaining: stockData.capacity
        };
        
        // 添加到库存列表
        this.stockData.items.push(newStock);
        
        // 更新总库存
        this.stockData.total += Number(stockData.capacity);
        
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });
        
        this.showAddStock = false;
      }, 500);
    }
  }
}
</script>

<style lang="scss">
@import "./whey-protein.scss";
</style>
