<template>
  <view class="protein-stock">
    <view class="stock-header">
      <text class="stock-title">库存管理</text>
      <u-button 
        type="primary" 
        size="mini" 
        @click="$emit('add-stock')"
      >添加库存</u-button>
    </view>
    
    <view class="total-stock">
      <text class="label">当前总库存</text>
      <view class="value-wrapper">
        <text class="value">{{ stockData.total }}</text>
        <text class="unit">克</text>
      </view>
    </view>
    
    <view class="stock-list">
      <view class="stock-item" v-for="(item, index) in stockData.items" :key="index">
        <view class="stock-info">
          <view class="brand-info">
            <text class="brand-name">{{ item.brand }}</text>
            <text class="flavor">{{ item.flavor }}</text>
          </view>
          <view class="amount-info">
            <text class="amount">{{ item.amount }}克</text>
            <text class="date">{{ formatDate(item.expiryDate) }}到期</text>
          </view>
        </view>
        <view class="progress-bar">
          <u-line-progress 
            :percentage="calculatePercentage(item.amount, item.initialAmount)" 
            :show-text="false" 
            height="12" 
            :active-color="getColorByExpiry(item.expiryDate)"
          ></u-line-progress>
          <text class="progress-text">剩余 {{ Math.round(calculatePercentage(item.amount, item.initialAmount)) }}%</text>
        </view>
      </view>
      
      <view class="empty-stock" v-if="!stockData.items || stockData.items.length === 0">
        <u-empty mode="data" text="暂无库存" marginTop="20"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    stockData: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },
    calculatePercentage(amount, initialAmount) {
      if (!initialAmount) return 0;
      return (amount / initialAmount) * 100;
    },
    getColorByExpiry(expiryDate) {
      if (!expiryDate) return '#2979ff';
      
      const now = new Date();
      const expiry = new Date(expiryDate);
      const daysDiff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 30) {
        return '#fa3534'; // 红色，即将过期
      } else if (daysDiff <= 90) {
        return '#ff9900'; // 橙色，90天内过期
      } else {
        return '#19be6b'; // 绿色，充足时间
      }
    }
  }
}
</script>

<style lang="scss">
.protein-stock {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .stock-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .stock-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
  
  .total-stock {
    background-color: #f8f8f8;
    border-radius: 8rpx;
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .label {
      font-size: 28rpx;
      color: #666666;
    }
    
    .value-wrapper {
      display: flex;
      align-items: flex-end;
      
      .value {
        font-size: 36rpx;
        font-weight: bold;
        color: #2979ff;
      }
      
      .unit {
        font-size: 24rpx;
        color: #999999;
        margin-left: 4rpx;
        padding-bottom: 6rpx;
      }
    }
  }
  
  .stock-list {
    .stock-item {
      border-bottom: 1px solid #f5f5f5;
      padding: 20rpx 0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .stock-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .brand-info {
          .brand-name {
            font-size: 28rpx;
            color: #333333;
            font-weight: 500;
            margin-right: 10rpx;
          }
          
          .flavor {
            font-size: 24rpx;
            color: #999999;
          }
        }
        
        .amount-info {
          .amount {
            font-size: 28rpx;
            color: #2979ff;
            font-weight: 500;
            margin-right: 10rpx;
          }
          
          .date {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
      
      .progress-bar {
        margin-bottom: 10rpx;
        
        .progress-text {
          font-size: 24rpx;
          color: #999999;
          margin-top: 6rpx;
          display: block;
        }
      }
    }
    
    .empty-stock {
      padding: 30rpx 0;
    }
  }
}
</style>
