<template>
  <view class="rewards-container">
    <u-navbar title="积分兑换奖励" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="points-balance">
        <view class="balance-card">
          <text class="balance-label">我的积分</text>
          <text class="balance-value">{{ userPoints }}</text>
        </view>
      </view>
      
      <view class="reward-categories">
        <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
          <view class="category-list">
            <view 
              class="category-item" 
              v-for="(category, index) in categories" 
              :key="index"
              :class="{ active: currentCategory === category.value }"
              @click="switchCategory(category.value)"
            >
              {{ category.name }}
            </view>
          </view>
        </scroll-view>
      </view>
      
      <view class="reward-list">
        <view class="reward-item" v-for="(reward, index) in filteredRewards" :key="index">
          <view class="reward-image">
            <image :src="reward.image" mode="aspectFill"></image>
            <view class="reward-tag" v-if="reward.tag">{{ reward.tag }}</view>
          </view>
          
          <view class="reward-info">
            <text class="reward-name">{{ reward.name }}</text>
            <text class="reward-desc">{{ reward.description }}</text>
            
            <view class="reward-footer">
              <view class="reward-points">
                <text class="points-value">{{ reward.points }}</text>
                <text class="points-label">积分</text>
              </view>
              
              <u-button 
                :type="canExchange(reward.points) ? 'primary' : 'info'" 
                size="mini" 
                :disabled="!canExchange(reward.points)"
                @click="exchangeReward(reward)"
              >
                {{ canExchange(reward.points) ? '立即兑换' : '积分不足' }}
              </u-button>
            </view>
          </view>
        </view>
        
        <view class="empty-rewards" v-if="filteredRewards.length === 0">
          <u-empty mode="data" text="暂无奖励" marginTop="40"></u-empty>
        </view>
      </view>
    </view>
    
    <u-popup v-model="showExchangePopup" mode="center" border-radius="12" width="600rpx">
      <view class="exchange-popup">
        <view class="popup-header">
          <text class="popup-title">确认兑换</text>
          <u-icon name="close" color="#999" size="28" @click="closeExchangePopup"></u-icon>
        </view>
        
        <view class="popup-content">
          <view class="reward-preview">
            <image :src="currentReward.image" mode="aspectFill" class="preview-image"></image>
            <text class="preview-name">{{ currentReward.name }}</text>
            <view class="preview-points">
              <text class="points-value">{{ currentReward.points }}</text>
              <text class="points-label">积分</text>
            </view>
          </view>
          
          <view class="exchange-notice">
            <text class="notice-title">兑换须知</text>
            <text class="notice-item">1. 兑换后积分将立即扣除</text>
            <text class="notice-item">2. 虚拟商品兑换后将立即到账</text>
            <text class="notice-item">3. 实物商品需要填写收货地址</text>
            <text class="notice-item">4. 兑换成功后无法退换</text>
          </view>
        </view>
        
        <view class="popup-footer">
          <u-button type="info" @click="closeExchangePopup">取消</u-button>
          <u-button type="primary" @click="confirmExchange">确认兑换</u-button>
        </view>
      </view>
    </u-popup>
    
    <u-popup v-model="showAddressPopup" mode="center" border-radius="12" width="600rpx">
      <view class="address-popup">
        <view class="popup-header">
          <text class="popup-title">填写收货地址</text>
          <u-icon name="close" color="#999" size="28" @click="closeAddressPopup"></u-icon>
        </view>
        
        <view class="popup-content">
          <u-form :model="addressForm" ref="addressForm">
            <u-form-item label="收货人" prop="name" required>
              <u-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
            </u-form-item>
            <u-form-item label="手机号" prop="phone" required>
              <u-input v-model="addressForm.phone" placeholder="请输入手机号码" />
            </u-form-item>
            <u-form-item label="收货地址" prop="address" required>
              <u-input v-model="addressForm.address" placeholder="请输入详细地址" />
            </u-form-item>
          </u-form>
        </view>
        
        <view class="popup-footer">
          <u-button type="info" @click="closeAddressPopup">取消</u-button>
          <u-button type="primary" @click="submitAddress">确认提交</u-button>
        </view>
      </view>
    </u-popup>
    
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userPoints: 2450,
      currentCategory: 'all',
      categories: [
        { name: '全部', value: 'all' },
        { name: '虚拟商品', value: 'virtual' },
        { name: '实物商品', value: 'physical' },
        { name: '优惠券', value: 'coupon' },
        { name: '会员特权', value: 'vip' }
      ],
      rewards: [
        {
          id: 1001,
          name: '健身达人称号',
          description: '在社区展示独特称号，彰显您的健身成就',
          points: 1000,
          category: 'virtual',
          tag: '热门',
          image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5'
        },
        {
          id: 1002,
          name: '瑜伽大师勋章',
          description: '特殊徽章，展示您在瑜伽领域的专业水平',
          points: 1500,
          category: 'virtual',
          tag: '新品',
          image: 'https://images.unsplash.com/photo-1545389336-cf090694435e'
        },
        {
          id: 1003,
          name: '健康食谱电子书',
          description: '包含100+专业营养配餐方案的电子书',
          points: 800,
          category: 'virtual',
          tag: null,
          image: 'https://images.unsplash.com/photo-1467453678174-768ec283a940'
        },
        {
          id: 1004,
          name: '运动水壶',
          description: '800ml大容量，保温防漏，健身必备',
          points: 2000,
          category: 'physical',
          tag: '限量',
          image: 'https://images.unsplash.com/photo-1575373469568-3fc001fa8683'
        },
        {
          id: 1005,
          name: '瑜伽垫',
          description: '加厚防滑，环保材质，舒适健康',
          points: 3500,
          category: 'physical',
          tag: null,
          image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'
        },
        {
          id: 1006,
          name: '蛋白粉优惠券',
          description: '任意蛋白粉产品8折优惠',
          points: 500,
          category: 'coupon',
          tag: '超值',
          image: 'https://images.unsplash.com/photo-1579722821273-0f6c1ddde163'
        },
        {
          id: 1007,
          name: '健身房月卡',
          description: '合作健身房通用月卡一张',
          points: 5000,
          category: 'coupon',
          tag: '抢手',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
        },
        {
          id: 1008,
          name: '会员升级券',
          description: '升级为平台高级会员，享受更多特权',
          points: 8000,
          category: 'vip',
          tag: '尊享',
          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'
        }
      ],
      currentReward: {},
      showExchangePopup: false,
      showAddressPopup: false,
      addressForm: {
        name: '',
        phone: '',
        address: ''
      }
    }
  },
  computed: {
    filteredRewards() {
      if (this.currentCategory === 'all') {
        return this.rewards;
      }
      
      return this.rewards.filter(reward => reward.category === this.currentCategory);
    }
  },
  onLoad() {
    // 使用本地示例数据，不再调用API加载
    // this.loadUserPoints();
    // this.loadRewards();
  },
  methods: {
    loadUserPoints() {
      uni.request({
        url: '/api/social/points/user',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.userPoints = res.data.data.current;
          }
        }
      });
    },
    loadRewards() {
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/social/rewards/list',
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.rewards = res.data.data;
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
    switchCategory(category) {
      this.currentCategory = category;
    },
    canExchange(points) {
      return this.userPoints >= points;
    },
    exchangeReward(reward) {
      this.currentReward = reward;
      this.showExchangePopup = true;
    },
    closeExchangePopup() {
      this.showExchangePopup = false;
    },
    confirmExchange() {
      // 虚拟商品直接兑换，实物商品需填写地址
      if (this.currentReward.category === 'physical') {
        this.showExchangePopup = false;
        this.showAddressPopup = true;
      } else {
        this.proceedExchange();
      }
    },
    proceedExchange() {
      uni.showLoading({
        title: '兑换中...'
      });
      
      const data = {
        rewardId: this.currentReward.id,
        addressInfo: this.currentReward.category === 'physical' ? this.addressForm : null
      };
      
      uni.request({
        url: '/api/social/rewards/exchange',
        method: 'POST',
        data: data,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.showExchangePopup = false;
            this.showAddressPopup = false;
            
            // 更新用户积分
            this.userPoints -= this.currentReward.points;
            
            // 显示兑换成功提示
            this.$refs.uToast.show({
              title: '兑换成功',
              type: 'success',
              position: 'bottom'
            });
            
            // 如果是虚拟商品，显示兑换码
            if (this.currentReward.category === 'virtual' && res.data.data && res.data.data.code) {
              setTimeout(() => {
                uni.showModal({
                  title: '兑换码',
                  content: res.data.data.code,
                  confirmText: '复制',
                  cancelText: '关闭',
                  success: (result) => {
                    if (result.confirm) {
                      uni.setClipboardData({
                        data: res.data.data.code,
                        success: () => {
                          uni.showToast({
                            title: '复制成功',
                            icon: 'success'
                          });
                        }
                      });
                    }
                  }
                });
              }, 500);
            }
          } else {
            uni.showToast({
              title: res.data.message || '兑换失败',
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
    closeAddressPopup() {
      this.showAddressPopup = false;
    },
    submitAddress() {
      // 简单验证
      if (!this.addressForm.name || !this.addressForm.phone || !this.addressForm.address) {
        return uni.showToast({
          title: '请填写完整的收货信息',
          icon: 'none'
        });
      }
      
      // 手机号验证
      if (!/^1\d{10}$/.test(this.addressForm.phone)) {
        return uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
      }
      
      this.proceedExchange();
    }
  }
}
</script>

<style lang="scss">
.rewards-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
  
  .points-balance {
    margin-bottom: 20rpx;
    
    .balance-card {
      background: linear-gradient(to right, #ff9900, #ff6600);
      border-radius: 12rpx;
      padding: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .balance-label {
        font-size: 32rpx;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .balance-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
  
  .reward-categories {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .category-scroll {
      white-space: nowrap;
      
      .category-list {
        display: inline-flex;
        padding: 6rpx 0;
        
        .category-item {
          padding: 10rpx 24rpx;
          margin-right: 20rpx;
          font-size: 26rpx;
          color: #666666;
          background-color: #f5f5f5;
          border-radius: 30rpx;
          transition: all 0.3s;
          
          &.active {
            background-color: rgba(41, 121, 255, 0.1);
            color: #2979ff;
          }
        }
      }
    }
  }
  
  .reward-list {
    .reward-item {
      background-color: #ffffff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
      .reward-image {
        position: relative;
        height: 300rpx;
        
        image {
          width: 100%;
          height: 100%;
        }
        
        .reward-tag {
          position: absolute;
          top: 16rpx;
          right: 16rpx;
          background-color: #ff9900;
          color: #ffffff;
          padding: 4rpx 12rpx;
          border-radius: 6rpx;
          font-size: 24rpx;
        }
      }
      
      .reward-info {
        padding: 20rpx;
        
        .reward-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333333;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .reward-desc {
          font-size: 26rpx;
          color: #666666;
          display: block;
          margin-bottom: 20rpx;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .reward-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .u-button {
            width: 5rem;
            margin:0;
          }
          .reward-points {
            display: flex;
            align-items: baseline;
            
            .points-value {
              font-size: 32rpx;
              font-weight: bold;
              color: #ff9900;
              margin-right: 6rpx;
            }
            
            .points-label {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }
      }
    }
    
    .empty-rewards {
      padding: 40rpx 0;
    }
  }
  
  .exchange-popup, .address-popup {
    padding: 30rpx;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      
      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .popup-content {
      margin-bottom: 30rpx;
      
      .reward-preview {
        text-align: center;
        margin-bottom: 30rpx;
        
        .preview-image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 8rpx;
          margin-bottom: 16rpx;
        }
        
        .preview-name {
          font-size: 28rpx;
          color: #333333;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .preview-points {
          display: inline-flex;
          align-items: baseline;
          
          .points-value {
            font-size: 32rpx;
            font-weight: bold;
            color: #ff9900;
            margin-right: 6rpx;
          }
          
          .points-label {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
      
      .exchange-notice {
        background-color: #f8f8f8;
        padding: 20rpx;
        border-radius: 8rpx;
        
        .notice-title {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
          margin-bottom: 16rpx;
          display: block;
        }
        
        .notice-item {
          font-size: 24rpx;
          color: #666666;
          line-height: 1.6;
          display: block;
        }
      }
    }
    
    .popup-footer {
      display: flex;
      justify-content: space-between;
      
      .u-button {
        flex: 1;
        margin: 0 10rpx;
      }
    }
  }
}
</style>
