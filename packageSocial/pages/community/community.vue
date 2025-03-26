<template>
  <view class="community-container">
    <u-navbar title="健康社区" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 搜索栏 -->
      <view class="search-bar">
        <u-search placeholder="搜索话题或内容" v-model="searchKeyword" :showAction="false" @search="onSearch"></u-search>
      </view>
      
      <!-- 分类标签 -->
      <view class="category-tabs">
        <scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
          <view class="tabs-list">
            <view 
              class="tab-item" 
              v-for="(tab, index) in categoryTabs" 
              :key="index"
              :class="{ active: currentTab === tab.id }"
              @click="switchTab(tab.id)"
            >
              {{ tab.name }}
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 帖子列表 -->
      <view class="post-list">
        <view class="post-item" v-for="(post, index) in postList" :key="index" @click="viewPostDetail(post.id)">
          <view class="post-header">
            <view class="user-info">
              <image class="user-avatar" :src="post.author.avatar" mode="aspectFill"></image>
              <view class="user-meta">
                <text class="user-name">{{ post.author.nickname }}</text>
                <text class="post-time">{{ formatTime(post.createTime) }}</text>
              </view>
            </view>
            <view class="post-category">{{ post.category }}</view>
          </view>
          
          <view class="post-content">
            <text class="post-title">{{ post.title }}</text>
            <text class="post-summary">{{ post.summary }}</text>
          </view>
          
          <view class="post-media" v-if="post.images && post.images.length > 0">
            <view class="image-list" :class="{ 'single-image': post.images.length === 1 }">
              <image 
                v-for="(img, imgIndex) in post.images.slice(0, 3)" 
                :key="imgIndex" 
                :src="img" 
                mode="aspectFill" 
                class="post-image"
              ></image>
              <view class="image-count" v-if="post.images.length > 3">+{{ post.images.length - 3 }}</view>
            </view>
          </view>
          
          <view class="post-footer">
            <view class="action-item">
              <u-icon name="eye" size="28" color="#999"></u-icon>
              <text class="action-count">{{ post.viewCount }}</text>
            </view>
            <view class="action-item">
              <u-icon name="chat" size="28" color="#999"></u-icon>
              <text class="action-count">{{ post.commentCount }}</text>
            </view>
            <view class="action-item">
              <u-icon name="thumb-up" size="28" color="#999"></u-icon>
              <text class="action-count">{{ post.likeCount }}</text>
            </view>
          </view>
        </view>
        
        <view class="empty-list" v-if="postList.length === 0">
          <u-empty mode="data" text="暂无帖子" marginTop="40"></u-empty>
        </view>
      </view>
    </view>
    
    <!-- 悬浮发帖按钮 -->
    <view class="float-button" @click="createPost">
      <u-icon name="plus" color="#ffffff" size="32"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      currentTab: 'all',
      categoryTabs: [
        { id: 'all', name: '全部' },
        { id: 'nutrition', name: '健康饮食' },
        { id: 'exercise', name: '运动健身' },
        { id: 'medical', name: '医疗咨询' },
        { id: 'experience', name: '经验分享' },
        { id: 'question', name: '问答' }
      ],
      postList: [
        {
          id: 201,
          title: '跑步的正确姿势，避免运动伤害',
          summary: '很多人跑步姿势不正确，长期下来容易导致膝盖、脚踝等部位受伤。本文分享专业的跑步姿势要点和常见错误纠正方法...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            nickname: '马拉松教练'
          },
          createTime: new Date(Date.now() - 2 * 3600000).getTime(), // 2小时前
          viewCount: 877,
          commentCount: 32,
          likeCount: 156,
          category: '运动健身',
          images: [
            'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
            'https://images.unsplash.com/photo-1571008887538-b36bb32f4571'
          ]
        },
        {
          id: 202,
          title: '如何科学控制血糖？营养师告诉你',
          summary: '血糖控制不仅对糖尿病患者重要，对所有人的健康都至关重要。本文将介绍几种有效控制血糖的饮食策略和生活方式调整...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
            nickname: '糖尿病营养师'
          },
          createTime: new Date(Date.now() - 8 * 3600000).getTime(), // 8小时前
          viewCount: 1205,
          commentCount: 45,
          likeCount: 201,
          category: '健康饮食',
          images: [
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352'
          ]
        },
        {
          id: 203,
          title: '健身一年的变化，从肥胖到健壮的心路历程',
          summary: '一年前我体重超标20公斤，现在已经拥有了人生中第一次的六块腹肌。分享我这一年来的锻炼计划、饮食管理和心态调整...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
            nickname: '健身达人阿强'
          },
          createTime: new Date(Date.now() - 12 * 3600000).getTime(), // 12小时前
          viewCount: 3689,
          commentCount: 125,
          likeCount: 532,
          category: '经验分享',
          images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
            'https://images.unsplash.com/photo-1583454155184-870a1f63aebc'
          ]
        },
        {
          id: 204,
          title: '头痛反复发作怎么办？可能是这些原因',
          summary: '频繁头痛严重影响生活质量，但很多人不知道如何有效应对。本文将分析常见头痛类型、诱因和缓解方法，帮助您找到适合自己的解决方案...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
            nickname: '神经内科医生'
          },
          createTime: new Date(Date.now() - 36 * 3600000).getTime(), // 36小时前
          viewCount: 2145,
          commentCount: 87,
          likeCount: 310,
          category: '医疗咨询',
          images: [
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef'
          ]
        },
        {
          id: 205,
          title: '有氧运动和力量训练如何搭配最有效？',
          summary: '很多健身爱好者对有氧和力量训练的搭配存在疑惑。本文根据运动科学的最新研究，详细讲解两者最佳组合方式和训练频率安排...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/men/37.jpg',
            nickname: '运动科学博士'
          },
          createTime: new Date(Date.now() - 48 * 3600000).getTime(), // 48小时前
          viewCount: 1876,
          commentCount: 56,
          likeCount: 289,
          category: '问答',
          images: [
            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
            'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'
          ]
        }
      ]
    }
  },
  onLoad() {
    // 使用本地示例数据，不再调用API加载
    // this.loadPosts();
  },
  methods: {
    loadPosts() {
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/social/posts',
        method: 'GET',
        data: {
          category: this.currentTab === 'all' ? '' : this.currentTab,
          keyword: this.searchKeyword
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.postList = res.data.data;
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
    switchTab(tabId) {
      this.currentTab = tabId;
      this.loadPosts();
    },
    onSearch() {
      this.loadPosts();
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const now = new Date();
      const postTime = new Date(timestamp);
      const diff = now.getTime() - postTime.getTime();
      
      // 小于1分钟
      if (diff < 60 * 1000) {
        return '刚刚';
      }
      
      // 小于1小时
      if (diff < 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 1000)) + '分钟前';
      }
      
      // 小于24小时
      if (diff < 24 * 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
      }
      
      // 小于30天
      if (diff < 30 * 24 * 60 * 60 * 1000) {
        return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
      }
      
      // 大于30天，显示具体日期
      const year = postTime.getFullYear();
      const month = String(postTime.getMonth() + 1).padStart(2, '0');
      const day = String(postTime.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },
    viewPostDetail(postId) {
      uni.navigateTo({
        url: './post-detail/post-detail?id=' + postId
      });
    },
    createPost() {
      uni.navigateTo({
        url: './post-create/post-create'
      });
    }
  }
}
</script>

<style lang="scss">
.community-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
  
  .search-bar {
    padding: 0 0 20rpx 0;
  }
  
  .category-tabs {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .tabs-scroll {
      white-space: nowrap;
      
      .tabs-list {
        display: inline-flex;
        padding: 6rpx 0;
        
        .tab-item {
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
  
  .post-list {
    .post-item {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      
      .post-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .user-info {
          display: flex;
          align-items: center;
          
          .user-avatar {
            width: 70rpx;
            height: 70rpx;
            border-radius: 50%;
            margin-right: 16rpx;
          }
          
          .user-meta {
            .user-name {
              font-size: 28rpx;
              font-weight: 500;
              color: #333333;
              display: block;
              line-height: 1.2;
            }
            
            .post-time {
              font-size: 24rpx;
              color: #999999;
              display: block;
              margin-top: 4rpx;
            }
          }
        }
        
        .post-category {
          font-size: 24rpx;
          color: #2979ff;
          background-color: rgba(41, 121, 255, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
        }
      }
      
      .post-content {
        margin-bottom: 16rpx;
        
        .post-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10rpx;
          display: block;
        }
        
        .post-summary {
          font-size: 28rpx;
          color: #666666;
          line-height: 1.5;
          display: block;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      
      .post-media {
        margin-bottom: 16rpx;
        
        .image-list {
          display: flex;
          flex-wrap: wrap;
          
          &.single-image {
            .post-image {
              width: 400rpx;
              height: 300rpx;
              border-radius: 8rpx;
            }
          }
          
          .post-image {
            width: 220rpx;
            height: 220rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
            border-radius: 8rpx;
          }
          
          .image-count {
            position: absolute;
            right: 20rpx;
            bottom: 20rpx;
            background-color: rgba(0, 0, 0, 0.5);
            color: #ffffff;
            font-size: 24rpx;
            padding: 4rpx 12rpx;
            border-radius: 20rpx;
          }
        }
      }
      
      .post-footer {
        display: flex;
        border-top: 1px solid #f5f5f5;
        padding-top: 16rpx;
        
        .action-item {
          display: flex;
          align-items: center;
          margin-right: 40rpx;
          
          .action-count {
            font-size: 24rpx;
            color: #999999;
            margin-left: 6rpx;
          }
        }
      }
    }
    
    .empty-list {
      padding: 40rpx 0;
    }
  }
  
  .float-button {
    position: fixed;
    right: 40rpx;
    bottom: 120rpx;
    width: 110rpx;
    height: 110rpx;
    background: linear-gradient(to right, #2979ff, #5cadff);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.4);
    z-index: 99;
  }
}

</style>