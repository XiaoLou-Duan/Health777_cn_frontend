<template>
  <view class="history-container">
    <u-navbar title="反馈历史" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 反馈列表 -->
      <view class="feedback-list" v-if="feedbackList.length > 0">
        <view 
          class="feedback-item" 
          v-for="(item, index) in feedbackList" 
          :key="index"
          @click="viewDetail(item)"
        >
          <view class="item-header">
            <view class="type-tag" :class="getTypeClass(item.type)">{{ getTypeLabel(item.type) }}</view>
            <view class="status-tag" :class="getStatusClass(item.status)">{{ getStatusLabel(item.status) }}</view>
          </view>
          <view class="item-content">{{ item.content }}</view>
          <view class="item-footer">
            <text class="time">{{ formatTime(item.submitTime) }}</text>
            <view class="detail-btn">
              <text>查看详情</text>
              <u-icon name="arrow-right" color="#999" size="24"></u-icon>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <image src="/static/images/empty.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无反馈记录</text>
        <view class="go-feedback-btn" @click="goToFeedback">去反馈</view>
      </view>
    </view>
    
    <!-- 加载更多 -->
    <view class="load-more" v-if="feedbackList.length > 0 && hasMore">
      <text @click="loadMore">点击加载更多</text>
    </view>
    <view class="load-more" v-if="feedbackList.length > 0 && !hasMore">
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      feedbackList: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      userId: ''
    }
  },
  onLoad() {
    this.getUserId();
    this.getFeedbackList();
  },
  methods: {
    // 获取用户ID
    getUserId() {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        const userObj = JSON.parse(userInfo);
        this.userId = userObj.userId || '1001';
      } else {
        this.userId = '1001'; // 默认ID
      }
    },
    
    // 获取反馈列表
    getFeedbackList() {
      uni.showLoading({
        title: '加载中'
      });
      
      // 调用反馈列表API
      uni.request({
        url: '/api/feedback/list',
        method: 'GET',
        data: {
          userId: this.userId,
          page: this.page,
          pageSize: this.pageSize
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            if (this.page === 1) {
              this.feedbackList = res.data.data.list;
            } else {
              this.feedbackList = [...this.feedbackList, ...res.data.data.list];
            }
            
            this.hasMore = res.data.data.hasMore;
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 模拟数据
          if (this.page === 1) {
            this.feedbackList = this.getMockFeedbackList();
            this.hasMore = this.feedbackList.length >= this.pageSize;
          } else {
            // 模拟加载更多，第二页后没有更多数据
            this.hasMore = false;
          }
        }
      });
    },
    
    // 获取模拟反馈列表
    getMockFeedbackList() {
      return [
        {
          id: '100001',
          userId: this.userId,
          type: 'suggestion',
          content: '希望能增加更多的健康饮食推荐功能，特别是适合老年人的食谱。',
          images: [],
          contactInfo: '13812341234',
          submitTime: '2025-03-10 15:30:22',
          status: 'processing',
          reply: '感谢您的建议，我们正在开发相关功能，预计将在下一个版本中上线。'
        },
        {
          id: '100002',
          userId: this.userId,
          type: 'bug',
          content: '运动检测页面在某些情况下会闪退，特别是在连续使用超过10分钟后。',
          images: ['https://example.com/bug_screenshot1.jpg'],
          contactInfo: '',
          submitTime: '2025-03-08 09:15:47',
          status: 'replied',
          reply: '感谢您的反馈，问题已修复，将在下一个版本更新中解决。'
        },
        {
          id: '100003',
          userId: this.userId,
          type: 'experience',
          content: '应用整体使用体验很好，但是字体有点小，对老年人不太友好。',
          images: [],
          contactInfo: 'user@example.com',
          submitTime: '2025-03-05 14:20:33',
          status: 'replied',
          reply: '感谢您的反馈，我们将在下一个版本中优化字体大小设置，并提供字体大小调整功能。'
        }
      ];
    },
    
    // 加载更多
    loadMore() {
      if (this.hasMore) {
        this.page++;
        this.getFeedbackList();
      }
    },
    
    // 查看详情
    viewDetail(item) {
      // 将反馈详情数据存储到本地
      uni.setStorageSync('currentFeedback', JSON.stringify(item));
      
      // 跳转到详情页面
      uni.navigateTo({
        url: '/pages/feedback/detail'
      });
    },
    
    // 跳转到反馈页面
    goToFeedback() {
      uni.navigateBack();
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
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '';
      
      // 简单格式化，实际应用中可能需要更复杂的逻辑
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    }
  }
}
</script>

<style>
.history-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx 30rpx;
}

.feedback-list {
  margin-bottom: 20rpx;
}

.feedback-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.item-header {
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

.item-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.detail-btn {
  display: flex;
  align-items: center;
}

.detail-btn text {
  font-size: 26rpx;
  color: #666;
  margin-right: 10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.go-feedback-btn {
  width: 200rpx;
  height: 70rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-more {
  text-align: center;
  padding: 30rpx;
}

.load-more text {
  font-size: 28rpx;
  color: #999;
}
</style>
