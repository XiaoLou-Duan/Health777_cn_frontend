<template>
  <view class="detection-result">
    <view class="result-header">
      <text class="result-title">检测结果</text>
      <u-tag type="success" text="已完成" size="mini"></u-tag>
    </view>
    
    <view class="result-content">
      <view class="result-item">
        <text class="item-label">运动类型</text>
        <text class="item-value">{{ resultData.detectionType }}</text>
      </view>
      
      <view class="result-item">
        <text class="item-label">运动精准度</text>
        <view class="accuracy-wrapper">
          <text class="item-value">{{ resultData.accuracy }}%</text>
          <u-line-progress 
            :percentage="resultData.accuracy" 
            :show-text="false" 
            height="10" 
            :active-color="getAccuracyColor(resultData.accuracy)"
          ></u-line-progress>
        </view>
      </view>
      
      <view class="result-item">
        <text class="item-label">完成次数</text>
        <text class="item-value">{{ resultData.repetitions }} 次</text>
      </view>
      
      <view class="result-item">
        <text class="item-label">持续时间</text>
        <text class="item-value">{{ resultData.duration }} 秒</text>
      </view>
      
      <view class="result-item">
        <text class="item-label">消耗热量</text>
        <text class="item-value">{{ resultData.calories }} 千卡</text>
      </view>
    </view>
    
    <view class="result-actions">
      <u-button type="primary" @click="saveToHistory">保存到历史记录</u-button>
      <u-button @click="shareResult">分享结果</u-button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    resultData: {
      type: Object,
      required: true
    }
  },
  methods: {
    getAccuracyColor(accuracy) {
      if (accuracy >= 90) {
        return '#19be6b'; // 绿色 - 优秀
      } else if (accuracy >= 70) {
        return '#2979ff'; // 蓝色 - 良好
      } else if (accuracy >= 50) {
        return '#ff9900'; // 橙色 - 一般
      } else {
        return '#fa3534'; // 红色 - 不佳
      }
    },
    saveToHistory() {
      uni.showToast({
        title: '已保存到历史记录',
        icon: 'success'
      });
    },
    shareResult() {
      uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        title: "我在HearthGood完成了运动",
        summary: `我完成了${this.resultData.repetitions}次${this.resultData.detectionType}，精准度${this.resultData.accuracy}%，快来和我一起锻炼吧！`,
        success: function (res) {
          console.log("分享成功：" + JSON.stringify(res));
        },
        fail: function (err) {
          console.log("分享失败：" + JSON.stringify(err));
        }
      });
    }
  }
}
</script>

<style lang="scss">
.detection-result {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .result-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
  
  .result-content {
    margin-bottom: 30rpx;
    
    .result-item {
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .item-label {
        font-size: 26rpx;
        color: #999999;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .item-value {
        font-size: 32rpx;
        color: #333333;
        font-weight: 500;
      }
      
      .accuracy-wrapper {
        .item-value {
          margin-bottom: 10rpx;
          display: block;
        }
      }
    }
  }
  
  .result-actions {
    display: flex;
    justify-content: space-between;
    
    .u-button {
      margin: 0 10rpx;
      flex: 1;
    }
  }
}
</style>
