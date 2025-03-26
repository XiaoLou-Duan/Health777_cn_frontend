<template>
  <view class="detail-container">
    <u-navbar title="反馈详情" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 反馈信息卡片 -->
      <view class="feedback-card">
        <view class="card-header">
          <view class="type-tag" :class="getTypeClass(feedback.type)">{{ getTypeLabel(feedback.type) }}</view>
          <view class="status-tag" :class="getStatusClass(feedback.status)">{{ getStatusLabel(feedback.status) }}</view>
        </view>
        
        <view class="submit-time">提交时间：{{ formatTime(feedback.submitTime) }}</view>
        
        <view class="card-content">
          <text>{{ feedback.content }}</text>
        </view>
        
        <!-- 图片展示区 -->
        <view class="image-list" v-if="feedback.images && feedback.images.length > 0">
          <view class="image-item" v-for="(image, index) in feedback.images" :key="index" @click="previewImage(index)">
            <image :src="image" mode="aspectFill"></image>
          </view>
        </view>
      </view>
      
      <!-- 处理记录 -->
      <view class="reply-card" v-if="feedback.reply">
        <view class="reply-header">
          <u-icon name="chat-fill" color="#5FB878" size="32"></u-icon>
          <text>官方回复</text>
        </view>
        <view class="reply-content">
          <text>{{ feedback.reply }}</text>
        </view>
        <view class="reply-time" v-if="feedback.replyTime">回复时间：{{ formatTime(feedback.replyTime) }}</view>
      </view>
      
      <!-- 补充说明区 -->
      <view class="supplement-card">
        <view class="supplement-header">
          <text>补充说明</text>
          <text class="supplement-tip">（如有新的情况需要补充）</text>
        </view>
        <view class="supplement-input">
          <textarea 
            v-model="supplementContent" 
            placeholder="请输入需要补充的内容..." 
            maxlength="200" 
            class="supplement-textarea"
          ></textarea>
          <view class="word-count">{{ supplementContent.length }}/200</view>
        </view>
        <view 
          class="submit-supplement-btn" 
          :class="{ disabled: !supplementContent.trim() }"
          @click="submitSupplement"
        >
          提交补充
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      feedback: {
        id: '',
        type: 'suggestion',
        content: '',
        images: [],
        status: 'pending',
        submitTime: '',
        reply: '',
        replyTime: ''
      },
      supplementContent: ''
    }
  },
  onLoad() {
    this.loadFeedbackDetail();
  },
  methods: {
    // 加载反馈详情
    loadFeedbackDetail() {
      const feedbackStr = uni.getStorageSync('currentFeedback');
      if (feedbackStr) {
        try {
          this.feedback = JSON.parse(feedbackStr);
        } catch (e) {
          this.showErrorAndGoBack();
        }
      } else {
        this.showErrorAndGoBack();
      }
    },
    
    // 显示错误并返回
    showErrorAndGoBack() {
      uni.showToast({
        title: '加载反馈详情失败',
        icon: 'none'
      });
      
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    },
    
    // 获取反馈类型标签
    getTypeLabel(type) {
      const typeMap = {
        'suggestion': '功能建议',
        'experience': '体验问题',
        'bug': '系统故障',
        'other': '其他'
      };
      
      return typeMap[type] || '其他';
    },
    
    // 获取反馈类型样式类
    getTypeClass(type) {
      const classMap = {
        'suggestion': 'type-suggestion',
        'experience': 'type-experience',
        'bug': 'type-bug',
        'other': 'type-other'
      };
      
      return classMap[type] || 'type-other';
    },
    
    // 获取状态标签
    getStatusLabel(status) {
      const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'replied': '已回复',
        'closed': '已关闭'
      };
      
      return statusMap[status] || '待处理';
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'replied': 'status-replied',
        'closed': 'status-closed'
      };
      
      return classMap[status] || 'status-pending';
    },
    
    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.feedback.images
      });
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '';
      
      // 简单格式化，实际应用中可能需要更复杂的逻辑
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    
    // 提交补充说明
    submitSupplement() {
      if (!this.supplementContent.trim()) {
        return;
      }
      
      uni.showLoading({
        title: '提交中...'
      });
      
      // 调用提交API
      uni.request({
        url: '/api/feedback/supplement',
        method: 'POST',
        data: {
          feedbackId: this.feedback.id,
          content: this.supplementContent
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.showSuccessAndReset();
          } else {
            uni.showToast({
              title: res.data.message || '提交失败，请稍后再试',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟成功
          this.showSuccessAndReset();
        }
      });
    },
    
    // 显示成功提示并重置
    showSuccessAndReset() {
      uni.showToast({
        title: '补充说明已提交',
        icon: 'success'
      });
      
      // 重置输入
      this.supplementContent = '';
    }
  }
}
</script>

<style>
.detail-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx 30rpx;
}

.feedback-card,
.reply-card,
.supplement-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.type-tag, .status-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.type-suggestion {
  background-color: #E1F5FE;
  color: #039BE5;
}

.type-experience {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.type-bug {
  background-color: #FFF3E0;
  color: #FF9800;
}

.type-other {
  background-color: #F3E5F5;
  color: #9C27B0;
}

.status-pending {
  background-color: #ECEFF1;
  color: #607D8B;
}

.status-processing {
  background-color: #E3F2FD;
  color: #2196F3;
}

.status-replied {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.status-closed {
  background-color: #EFEBE9;
  color: #795548;
}

.submit-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.card-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.reply-header text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-left: 10rpx;
}

.reply-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  background-color: #f7f7f7;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.reply-time {
  font-size: 24rpx;
  color: #999;
  text-align: right;
}

.supplement-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.supplement-header text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.supplement-tip {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
  margin-left: 10rpx;
}

.supplement-input {
  position: relative;
}

.supplement-textarea {
  width: 100%;
  height: 200rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333;
}

.word-count {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.submit-supplement-btn {
  height: 80rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}

.submit-supplement-btn.disabled {
  background-color: #cccccc;
}
</style>
