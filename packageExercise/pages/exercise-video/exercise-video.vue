<template>
  <view class="exercise-video-container">
    <u-navbar title="运动指导视频" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <view class="video-category">
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
      
      <view class="video-list">
        <view class="video-card" v-for="(video, index) in filteredVideos" :key="index" @click="playVideo(video)">
          <view class="video-thumbnail">
            <image class="thumbnail-image" :src="video.thumbnail" mode="aspectFill"></image>
            <view class="video-duration">{{ formatDuration(video.duration) }}</view>
          </view>
          <view class="video-info">
            <text class="video-title">{{ video.title }}</text>
            <text class="video-desc">{{ video.description }}</text>
            <view class="video-meta">
              <text class="video-difficulty">难度: {{ getDifficultyText(video.difficulty) }}</text>
              <text class="video-views">{{ video.views }} 次观看</text>
            </view>
          </view>
        </view>
        
        <view class="empty-list" v-if="filteredVideos.length === 0">
          <u-empty mode="data" text="暂无视频" marginTop="40"></u-empty>
        </view>
      </view>
    </view>
    
    <u-popup v-model="showVideoPlayer" mode="center" border-radius="12" width="680rpx">
      <view class="video-player-container">
        <view class="player-header">
          <text class="player-title">{{ currentVideo.title }}</text>
          <u-icon name="close" color="#999" size="28" @click="closeVideoPlayer"></u-icon>
        </view>
        <view class="player-content">
          <video :src="currentVideo.url" controls autoplay class="video-player"></video>
          <view class="video-description">{{ currentVideo.description }}</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: 'all',
      categories: [
        { name: '全部', value: 'all' },
        { name: '初级', value: 'beginner' },
        { name: '中级', value: 'intermediate' },
        { name: '高级', value: 'advanced' },
        { name: '有氧', value: 'cardio' },
        { name: '力量', value: 'strength' },
        { name: '柔韧性', value: 'flexibility' }
      ],
      videos: [],
      currentVideo: {},
      showVideoPlayer: false
    }
  },
  computed: {
    filteredVideos() {
      if (this.currentCategory === 'all') {
        return this.videos;
      }
      
      return this.videos.filter(video => 
        video.categories.includes(this.currentCategory) || 
        video.difficulty === this.currentCategory
      );
    }
  },
  onLoad() {
    this.loadVideos();
  },
  methods: {
    loadVideos() {
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/exercise/videos',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.videos = res.data.data;
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
    switchCategory(category) {
      this.currentCategory = category;
    },
    formatDuration(seconds) {
      if (!seconds) return '00:00';
      
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    },
    getDifficultyText(difficulty) {
      switch(difficulty) {
        case 'beginner': return '初级';
        case 'intermediate': return '中级';
        case 'advanced': return '高级';
        default: return '未知';
      }
    },
    playVideo(video) {
      this.currentVideo = video;
      this.showVideoPlayer = true;
      
      // 记录观看次数
      uni.request({
        url: '/api/exercise/video/view',
        method: 'POST',
        data: {
          videoId: video.id
        }
      });
    },
    closeVideoPlayer() {
      this.showVideoPlayer = false;
    }
  }
}
</script>

<style lang="scss">
.exercise-video-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
  
  .video-category {
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
  
  .video-list {
    .video-card {
      background-color: #ffffff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
      .video-thumbnail {
        position: relative;
        height: 360rpx;
        
        .thumbnail-image {
          width: 100%;
          height: 100%;
        }
        
        .video-duration {
          position: absolute;
          bottom: 16rpx;
          right: 16rpx;
          background-color: rgba(0, 0, 0, 0.6);
          color: #ffffff;
          padding: 4rpx 12rpx;
          border-radius: 6rpx;
          font-size: 24rpx;
        }
      }
      
      .video-info {
        padding: 20rpx;
        
        .video-title {
          font-size: 30rpx;
          font-weight: bold;
          color: #333333;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .video-desc {
          font-size: 26rpx;
          color: #666666;
          display: block;
          margin-bottom: 16rpx;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .video-meta {
          display: flex;
          justify-content: space-between;
          
          .video-difficulty {
            font-size: 24rpx;
            color: #2979ff;
          }
          
          .video-views {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
    }
    
    .empty-list {
      padding: 40rpx 0;
    }
  }
  
  .video-player-container {
    padding: 20rpx;
    
    .player-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .player-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
      }
    }
    
    .player-content {
      .video-player {
        width: 100%;
        height: 400rpx;
        margin-bottom: 20rpx;
      }
      
      .video-description {
        font-size: 26rpx;
        color: #666666;
        line-height: 1.5;
      }
    }
  }
}
</style>
