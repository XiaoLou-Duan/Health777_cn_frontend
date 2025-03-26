<template>
  <view class="feedback-container">
    <u-navbar title="意见反馈" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 反馈类型选择 -->
      <view class="feedback-type">
        <view class="section-title">反馈类型</view>
        <view class="type-options">
          <view
            class="type-item"
            v-for="(item, index) in feedbackTypes"
            :key="index"
            :class="{ active: selectedType === item.value }"
            @click="selectedType = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>
      
      <!-- 反馈内容 -->
      <view class="feedback-content">
        <view class="section-title">反馈内容</view>
        <view class="content-area">
          <textarea
            v-model="content"
            placeholder="请详细描述您遇到的问题或建议..."
            maxlength="500"
            class="content-textarea"
          ></textarea>
          <view class="word-count">{{ content.length }}/500</view>
        </view>
      </view>
      
      <!-- 图片上传区 -->
      <view class="feedback-images">
        <view class="section-title">上传图片（选填，最多3张）</view>
        <view class="image-upload-area">
          <view
            class="image-item"
            v-for="(item, index) in imageList"
            :key="index"
          >
            <image :src="item" mode="aspectFill"></image>
            <view class="delete-icon" @click="deleteImage(index)">
              <u-icon name="close" color="#ffffff" size="20"></u-icon>
            </view>
          </view>
          <view
            class="upload-btn"
            @click="chooseImage"
            v-if="imageList.length < 3"
          >
            <u-icon name="camera" color="#c0c4cc" size="40"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 联系方式 -->
      <view class="contact-info">
        <view class="section-title">联系方式（选填）</view>
        <view class="contact-input">
          <input
            v-model="contactInfo"
            placeholder="请留下您的联系方式，方便我们反馈..."
            class="contact-text"
          />
        </view>
      </view>
      
      <!-- 提交按钮 -->
      <view
        class="submit-btn"
        :class="{ disabled: !isValid }"
        @click="submitFeedback"
      >
        提交反馈
      </view>
      
      <!-- 反馈历史入口 -->
      <view class="history-entry" @click="goToHistory">
        <text>查看历史反馈</text>
        <u-icon name="arrow-right" color="#5FB878" size="28"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      feedbackTypes: [
        { label: '功能建议', value: 'suggestion' },
        { label: '体验问题', value: 'experience' },
        { label: '系统故障', value: 'bug' },
        { label: '其他', value: 'other' }
      ],
      selectedType: 'suggestion',
      content: '',
      imageList: [],
      contactInfo: ''
    }
  },
  computed: {
    // 验证表单是否有效
    isValid() {
      return this.selectedType && this.content.trim().length > 0;
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.imageList.length,
        sizeType: ['compressed'],
        success: (res) => {
          this.imageList = [...this.imageList, ...res.tempFilePaths];
        }
      });
    },
    
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    
    // 提交反馈
    submitFeedback() {
      if (!this.isValid) {
        if (!this.content.trim()) {
          uni.showToast({
            title: '请填写反馈内容',
            icon: 'none'
          });
        }
        return;
      }
      
      uni.showLoading({
        title: '提交中...'
      });
      
      // 模拟上传图片过程
      const uploadImages = () => {
        return new Promise((resolve) => {
          if (this.imageList.length === 0) {
            resolve([]);
            return;
          }
          
          // 模拟上传时间
          setTimeout(() => {
            // 模拟返回图片URL
            const imageUrls = this.imageList.map((item, index) => {
              return `https://example.com/feedback/image_${index + 1}.jpg`;
            });
            resolve(imageUrls);
          }, 1000);
        });
      };
      
      // 上传图片后提交反馈
      uploadImages().then((imageUrls) => {
        // 组装反馈数据
        const feedbackData = {
          userId: uni.getStorageSync('userId') || '1001',
          type: this.selectedType,
          content: this.content,
          images: imageUrls,
          contactInfo: this.contactInfo,
          submitTime: new Date().toISOString()
        };
        
        // 调用提交API
        uni.request({
          url: '/api/feedback/submit',
          method: 'POST',
          data: feedbackData,
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
      });
    },
    
    // 显示成功提示并重置表单
    showSuccessAndReset() {
      uni.showToast({
        title: '提交成功，感谢您的反馈',
        icon: 'success'
      });
      
      // 重置表单
      setTimeout(() => {
        this.selectedType = 'suggestion';
        this.content = '';
        this.imageList = [];
        this.contactInfo = '';
      }, 1500);
    },
    
    // 跳转到反馈历史页面
    goToHistory() {
      uni.navigateTo({
        url: '/pages/feedback/history'
      });
    }
  }
}
</script>

<style>
.feedback-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20rpx 30rpx 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.feedback-type,
.feedback-content,
.feedback-images,
.contact-info {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.type-options {
  display: flex;
  flex-wrap: wrap;
}

.type-item {
  height: 70rpx;
  padding: 0 30rpx;
  background-color: #f5f5f5;
  color: #666;
  font-size: 28rpx;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.type-item.active {
  background-color: #5FB878;
  color: #ffffff;
}

.content-area {
  position: relative;
}

.content-textarea {
  width: 100%;
  height: 240rpx;
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

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-icon {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.contact-input {
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 20rpx;
}

.contact-text {
  width: 100%;
  height: 70rpx;
  font-size: 28rpx;
  color: #333;
}

.submit-btn {
  height: 90rpx;
  background-color: #5FB878;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60rpx;
}

.submit-btn.disabled {
  background-color: #cccccc;
}

.history-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
  padding: 20rpx;
}

.history-entry text {
  font-size: 28rpx;
  color: #5FB878;
  margin-right: 10rpx;
}
</style>
