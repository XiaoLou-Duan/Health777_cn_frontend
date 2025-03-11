
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
      postList: []
    }
  },
  onLoad() {
    this.loadPosts();
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

<style>
@import './community.scss';
</style>