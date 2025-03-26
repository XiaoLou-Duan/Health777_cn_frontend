<template>
  <view class="social-index-container">
    <u-navbar title="社交健康" :border="false" back-icon-color="#333333"></u-navbar>
    
    <view class="content-wrapper">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill"></image>
          <view class="user-meta">
            <view class="user-name-wrapper">
              <text class="user-name">{{ userInfo.nickname }}</text>
              <view class="user-title" v-if="userInfo.activeTitle">{{ userInfo.activeTitle.name }}</view>
            </view>
            <view class="user-stats">
              <text class="stat-item">积分: {{ userInfo.points }}</text>
              <text class="stat-item">徽章: {{ userInfo.badgeCount }}</text>
            </view>
          </view>
        </view>
        <view class="user-level">
          <text class="level-text">Lv.{{ userInfo.level }}</text>
        </view>
      </view>
      
      <!-- 功能模块导航 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">功能导航</text>
        </view>
        <view class="action-grid">
          <view class="action-item" @click="navigateTo('/packageSocial/pages/community/community')">
            <view class="action-icon community-icon">
              <u-icon name="chat" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">健康社区</text>
          </view>
          
          <view class="action-item" @click="navigateTo('/packageSocial/pages/points/points')">
            <view class="action-icon points-icon">
              <u-icon name="star" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">积分系统</text>
          </view>
          
          <view class="action-item" @click="navigateTo('/packageSocial/pages/rewards/rewards')">
            <view class="action-icon rewards-icon">
              <u-icon name="gift" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">虚拟奖励</text>
          </view>
          
          <view class="action-item" @click="showComingSoon">
            <view class="action-icon events-icon">
              <u-icon name="calendar" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">活动中心</text>
          </view>
        </view>
      </view>
      
      <!-- 热门话题 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">热门话题</text>
          <text class="section-more" @click="navigateTo('/packageSocial/pages/community/community')">查看更多</text>
        </view>
        
        <scroll-view scroll-x class="topics-scroll" show-scrollbar="false">
          <view class="topics-list">
            <view 
              class="topic-item" 
              v-for="(topic, index) in hotTopics" 
              :key="index"
              :style="{ backgroundColor: topic.color }"
              @click="navigateToTopic(topic.id)"
            >
              <text class="topic-name">{{ topic.name }}</text>
              <text class="topic-count">{{ topic.postCount }}篇</text>
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 推荐帖子 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">推荐帖子</text>
          <text class="section-more" @click="navigateTo('/packageSocial/pages/community/community')">查看更多</text>
        </view>
        
        <view class="post-list">
          <view class="post-item" v-for="(post, index) in recommendPosts" :key="index" @click="viewPostDetail(post.id)">
            <view class="post-header">
              <view class="user-info">
                <image class="user-avatar" :src="post.author.avatar" mode="aspectFill"></image>
                <view class="user-meta">
                  <text class="user-name">{{ post.author.nickname }}</text>
                  <text class="post-time">{{ formatTime(post.createTime) }}</text>
                </view>
              </view>
              <view class="post-topic" :style="{ backgroundColor: post.topicColor }">{{ post.topicName }}</view>
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
        </view>
      </view>
      
      <!-- 积分排行榜 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">积分排行榜</text>
          <text class="section-more" @click="navigateTo('/packageSocial/pages/points/points')">查看更多</text>
        </view>
        
        <view class="ranking-list">
          <view class="ranking-item" v-for="(user, index) in pointsRanking" :key="index">
            <view class="ranking-number" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
            <image class="ranking-avatar" :src="user.avatar" mode="aspectFill"></image>
            <view class="ranking-info">
              <text class="ranking-name">{{ user.nickname }}</text>
              <text class="ranking-title" v-if="user.title">{{ user.title }}</text>
            </view>
            <view class="ranking-points">{{ user.points }}分</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        nickname: '健康达人',
        points: 2450,
        badgeCount: 8,
        level: 15,
        activeTitle: {
          name: '营养专家',
          id: 1
        }
      },
      hotTopics: [
        {
          id: 1,
          name: '蛋白质摄入',
          postCount: 124,
          color: '#2196f3'
        },
        {
          id: 2,
          name: '减脂饮食',
          postCount: 98,
          color: '#ff9800'
        },
        {
          id: 3,
          name: '力量训练',
          postCount: 156,
          color: '#9c27b0'
        },
        {
          id: 4,
          name: '健康心理',
          postCount: 76,
          color: '#4caf50'
        },
        {
          id: 5,
          name: '睡眠改善',
          postCount: 53,
          color: '#f44336'
        }
      ],
      recommendPosts: [
        {
          id: 101,
          title: '每天吃多少蛋白质才算足够？来看看最新研究',
          summary: '很多人都知道蛋白质很重要，但究竟每天需要摄入多少才算足够呢？本文根据最新研究和个人经验，分享几点关于蛋白质摄入的建议...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            nickname: '营养师小李'
          },
          createTime: new Date(Date.now() - 3600000 * 3).getTime(), // 3小时前
          viewCount: 1256,
          commentCount: 48,
          likeCount: 234,
          topicName: '蛋白质摄入',
          topicColor: '#2196f3',
          images: [
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
            'https://images.unsplash.com/photo-1494390248081-4e521a5940db'
          ]
        },
        {
          id: 102,
          title: '我的12周减脂计划分享：成功瘦了15kg',
          summary: '从今年1月开始，我坚持了12周的科学减脂计划，最终成功减掉了15kg体重。这个过程并不容易，但非常值得，现在分享我的完整计划和感受...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            nickname: '健身达人小王'
          },
          createTime: new Date(Date.now() - 86400000 * 2).getTime(), // 2天前
          viewCount: 3560,
          commentCount: 156,
          likeCount: 712,
          topicName: '减脂饮食',
          topicColor: '#ff9800',
          images: [
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61'
          ]
        },
        {
          id: 103,
          title: '推荐5个居家力量训练动作，不去健身房也能练出好身材',
          summary: '疫情期间很多健身房关闭，但这不应该成为停止锻炼的理由。这里推荐5个简单有效的居家力量训练动作，只需要很少的器材甚至零器材...',
          author: {
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            nickname: '私教小张'
          },
          createTime: new Date(Date.now() - 86400000 * 5).getTime(), // 5天前
          viewCount: 2378,
          commentCount: 89,
          likeCount: 456,
          topicName: '力量训练',
          topicColor: '#9c27b0',
          images: [
            'https://images.unsplash.com/photo-1599058917212-d750089bc07e'
          ]
        }
      ],
      pointsRanking: [
        {
          nickname: '营养专家',
          avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
          points: 5680,
          title: '膳食达人'
        },
        {
          nickname: '健身教练',
          avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
          points: 4930,
          title: '力量之王'
        },
        {
          nickname: '健康顾问',
          avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
          points: 3845,
          title: '瑜伽大师'
        },
        {
          nickname: '跑步爱好者',
          avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
          points: 3210,
          title: '马拉松达人'
        },
        {
          nickname: '营养师小李',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          points: 2890,
          title: null
        }
      ]
    }
  },
  onLoad() {
    // 将网络请求方法注释掉，改用本地示例数据
    // this.loadUserInfo();
    // this.loadHotTopics();
    // this.loadRecommendPosts();
    // this.loadPointsRanking();
  },
  methods: {
    loadUserInfo() {
      // ...existing code...
    },
    loadHotTopics() {
      // ...existing code...
    },
    loadRecommendPosts() {
      // ...existing code...
    },
    loadPointsRanking() {
      // ...existing code...
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    navigateToTopic(topicId) {
      uni.navigateTo({
        url: '/packageSocial/pages/community/community?topicId=' + topicId
      });
    },
    viewPostDetail(postId) {
      uni.navigateTo({
        url: '/packageSocial/pages/community/post-detail/post-detail?id=' + postId
      });
    },
    showComingSoon() {
      uni.showToast({
        title: '功能即将上线',
        icon: 'none'
      });
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
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
