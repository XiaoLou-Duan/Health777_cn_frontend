<template>
  <view class="food-card" :class="{'is-elderly': isElderly}" @click="handleCardClick">
    <view class="food-image-container">
      <image :src="food.image || defaultImage" mode="aspectFill" class="food-image"></image>
      <view v-if="food.recommended" class="recommended-tag">推荐</view>
    </view>
    <view class="food-info">
      <view class="food-name-row">
        <text class="food-name">{{ food.name }}</text>
        <view v-if="food.favorite" class="favorite-icon">
          <u-icon name="star-fill" color="#ff9800" size="40"></u-icon>
        </view>
      </view>
      <view class="food-protein">
        <text class="label">蛋白质：</text>
        <text class="value">{{ food.protein }}g</text>
      </view>
      <view class="food-calories">
        <text class="label">热量：</text>
        <text class="value">{{ food.calories }}kcal</text>
      </view>
      <view class="food-portion">
        <text class="label">份量：</text>
        <text class="value">{{ food.portion }}</text>
      </view>
      <view v-if="showActions" class="food-actions">
        <u-button 
          text="添加" 
          type="primary" 
          size="mini" 
          shape="circle"
          @click.stop="handleAddClick"
        ></u-button>
        <u-button 
          text="详情" 
          type="info" 
          size="mini" 
          shape="circle"
          @click.stop="handleDetailClick"
        ></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { ELDERLY_CONFIG } from '@/config/config.js';

export default {
  name: 'FoodCard',
  props: {
    // 食物数据
    food: {
      type: Object,
      required: true
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 默认图片
      defaultImage: '/static/images/placeholder.png',
      // 是否为老年人模式
      isElderly: ELDERLY_CONFIG.simplifiedInterface
    };
  },
  methods: {
    // 处理卡片点击
    handleCardClick() {
      this.$emit('click', this.food);
    },
    
    // 处理添加点击
    handleAddClick() {
      this.$emit('add', this.food);
    },
    
    // 处理详情点击
    handleDetailClick() {
      this.$emit('detail', this.food);
    }
  }
};
</script>

<style lang="scss" scoped>
.food-card {
  display: flex;
  background-color: var(--cardBackground, #ffffff);
  border-radius: var(--borderRadius, 12rpx);
  box-shadow: var(--shadow, 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1));
  overflow: hidden;
  margin-bottom: 20rpx;
  
  &.is-elderly {
    border-radius: var(--borderRadiusLarge, 24rpx);
  }
  
  .food-image-container {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    
    .food-image {
      width: 100%;
      height: 100%;
    }
    
    .recommended-tag {
      position: absolute;
      top: 10rpx;
      left: 0;
      background-color: var(--primary, #5677fc);
      color: #ffffff;
      font-size: 20rpx;
      padding: 4rpx 10rpx;
      border-radius: 0 8rpx 8rpx 0;
    }
  }
  
  .food-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    
    .food-name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .food-name {
        font-size: 32rpx;
        font-weight: 500;
        color: var(--textPrimary, #303133);
      }
    }
    
    .food-protein, .food-calories, .food-portion {
      font-size: 26rpx;
      color: var(--textRegular, #606266);
      margin-bottom: 6rpx;
      
      .label {
        color: var(--textSecondary, #909399);
      }
      
      .value {
        font-weight: 500;
      }
    }
    
    .food-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10rpx;
      gap: 20rpx;
    }
  }
}

.is-elderly {
  .food-image-container {
    width: 220rpx;
    height: 220rpx;
    
    .recommended-tag {
      font-size: 24rpx;
      padding: 6rpx 12rpx;
    }
  }
  
  .food-info {
    padding: 24rpx;
    
    .food-name-row .food-name {
      font-size: 36rpx;
    }
    
    .food-protein, .food-calories, .food-portion {
      font-size: 30rpx;
      margin-bottom: 8rpx;
    }
  }
}
</style>
