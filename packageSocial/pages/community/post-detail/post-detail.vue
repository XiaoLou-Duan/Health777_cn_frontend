<template>
  <view class="post-detail-container">
    <u-navbar title="帖子详情" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 帖子内容 -->
      <view class="post-section">
        <view class="post-header">
          <view class="user-info">
            <image class="user-avatar" :src="postInfo.author.avatar" mode="aspectFill"></image>
            <view class="user-meta">
              <text class="user-name">{{ postInfo.author.nickname }}</text>
              <text class="post-time">{{ formatTime(postInfo.createTime) }}</text>
            </view>
          </view>
          <view class="post-category">{{ postInfo.category }}</view>
        </view>
        
        <view class="post-content">
          <text class="post-title">{{ postInfo.title }}</text>
          <rich-text class="post-text" :nodes="formatContent(postInfo.content)"></rich-text>
        </view>
        
        <!-- 图片展示 -->
        <view class="post-images" v-if="postInfo.images && postInfo.images.length > 0">
          <image 
            v-for="(img, index) in postInfo.images" 
            :key="index" 
            :src="img" 
            mode="widthFix" 
            class="post-image"
            @click="previewImage(index)"
          ></image>
        </view>
        
        <!-- 帖子操作 -->
        <view class="post-actions">
          <view class="action-item" @click="toggleLike">
            <u-icon :name="isLiked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="isLiked ? '#FF6B6B' : '#999'"></u-icon>
            <text class="action-count" :class="{ active: isLiked }">{{ postInfo.likeCount }}</text>
          </view>
          <view class="action-item" @click="scrollToComment">
            <u-icon name="chat" size="32" color="#999"></u-icon>
            <text class="action-count">{{ postInfo.commentCount }}</text>
          </view>
          <view class="action-item" @click="sharePost">
            <u-icon name="share" size="32" color="#999"></u-icon>
            <text class="action-count">分享</text>
          </view>
        </view>
      </view>
      
      <!-- 相关推荐 -->
      <view class="related-section" v-if="relatedPosts.length > 0">
        <view class="section-title">相关推荐</view>
        <view class="related-list">
          <view 
            class="related-item" 
            v-for="(item, index) in relatedPosts" 
            :key="index"
            @click="navigateToPost(item.id)"
          >
            <text class="related-title">{{ item.title }}</text>
            <text class="related-views">{{ item.viewCount }}浏览</text>
          </view>
        </view>
      </view>
      
      <!-- 评论区 -->
      <view class="comment-section" id="comment-section">
        <view class="section-title">评论区 ({{ postInfo.commentCount }})</view>
        
        <view class="comment-list">
          <view class="empty-comment" v-if="commentList.length === 0">
            <u-empty mode="comment" text="暂无评论，快来抢沙发吧" marginTop="40"></u-empty>
          </view>
          
          <view class="comment-item" v-for="(comment, index) in commentList" :key="index">
            <view class="comment-user">
              <image class="user-avatar" :src="comment.user.avatar" mode="aspectFill"></image>
              <view class="user-info">
                <text class="user-name">{{ comment.user.nickname }}</text>
                <text class="comment-time">{{ formatTime(comment.createTime) }}</text>
              </view>
            </view>
            
            <view class="comment-content">
              <text>{{ comment.content }}</text>
            </view>
            
            <view class="comment-actions">
              <view class="comment-like" @click="likeComment(index)">
                <u-icon :name="comment.isLiked ? 'thumb-up-fill' : 'thumb-up'" size="26" :color="comment.isLiked ? '#FF6B6B' : '#999'"></u-icon>
                <text :class="{ active: comment.isLiked }">{{ comment.likeCount }}</text>
              </view>
              <view class="comment-reply" @click="replyToComment(comment)">
                <u-icon name="chat" size="26" color="#999"></u-icon>
                <text>回复</text>
              </view>
            </view>
            
            <!-- 回复列表 -->
            <view class="reply-list" v-if="comment.replies && comment.replies.length > 0">
              <view class="reply-item" v-for="(reply, replyIndex) in comment.replies" :key="replyIndex">
                <view class="reply-user">
                  <text class="user-name">{{ reply.user.nickname }}</text>
                  <text v-if="reply.replyTo">回复</text>
                  <text v-if="reply.replyTo" class="reply-to">@{{ reply.replyTo.nickname }}</text>
                </view>
                <text class="reply-content">{{ reply.content }}</text>
              </view>
              
              <view class="show-more" v-if="comment.replyCount > comment.replies.length" @click="loadMoreReplies(comment.id, index)">
                <text>查看更多回复</text>
                <u-icon name="arrow-right" size="24" color="#999"></u-icon>
              </view>
            </view>
          </view>
        </view>
        
        <view class="load-more" v-if="hasMoreComments" @click="loadMoreComments">
          <text>加载更多评论</text>
        </view>
      </view>
    </view>
    
    <!-- 评论输入框 -->
    <view class="comment-input-wrapper">
      <view class="comment-input">
        <input 
          type="text" 
          :placeholder="replyInfo ? `回复 @${replyInfo.user.nickname}` : '发表评论...'" 
          v-model="commentContent"
          @confirm="submitComment"
          confirm-type="send"
        />
        <button class="send-btn" :disabled="!commentContent.trim()" @click="submitComment">发送</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postId: '',
      postInfo: {
        id: '',
        title: '',
        content: '',
        images: [],
        category: '',
        author: {
          id: '',
          nickname: '',
          avatar: ''
        },
        createTime: Date.now(),
        viewCount: 0,
        commentCount: 0,
        likeCount: 0
      },
      isLiked: false,
      commentList: [],
      relatedPosts: [],
      commentContent: '',
      replyInfo: null,
      commentPage: 1,
      commentSize: 10,
      hasMoreComments: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.postId = options.id;
      this.loadPostDetail();
      this.loadComments();
      this.loadRelatedPosts();
      this.recordView();
    }
  },
  methods: {
    // 加载帖子详情
    loadPostDetail() {
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/social/posts/' + this.postId,
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.postInfo = res.data.data;
            this.isLiked = res.data.data.isLiked || false;
          } else {
            uni.showToast({
              title: res.data.message || '获取帖子详情失败',
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
          
          // 添加测试数据
          this.addMockData();
        }
      });
    },
    
    // 加载评论列表
    loadComments() {
      uni.request({
        url: '/api/social/comments',
        method: 'GET',
        data: {
          postId: this.postId,
          page: this.commentPage,
          size: this.commentSize
        },
        success: (res) => {
          if (res.data.code === 0) {
            const comments = res.data.data.records || [];
            
            if (this.commentPage === 1) {
              this.commentList = comments;
            } else {
              this.commentList = [...this.commentList, ...comments];
            }
            
            this.hasMoreComments = (this.commentList.length < res.data.data.total);
          }
        },
        fail: () => {
          // 添加测试评论数据
          this.addMockComments();
        }
      });
    },
    
    // 加载相关推荐
    loadRelatedPosts() {
      uni.request({
        url: '/api/social/related-posts',
        method: 'GET',
        data: {
          postId: this.postId
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.relatedPosts = res.data.data || [];
          }
        },
        fail: () => {
          // 添加测试相关推荐数据
          this.addMockRelatedPosts();
        }
      });
    },
    
    // 记录浏览量
    recordView() {
      uni.request({
        url: '/api/social/posts/' + this.postId + '/view',
        method: 'POST'
      });
    },
    
    // 添加测试数据
    addMockData() {
      const mockPost = {
        id: this.postId || '1',
        title: '每天10分钟简单运动，改善肌少症状一个月心得',
        content: '大家好，我是一名肌少症患者，今天想分享一下我坚持运动一个月的心得体会。\n\n医生给我推荐了一套简单的运动方案，每天只需要10分钟，但效果非常显著。我已经感觉到肌肉力量有所增强，走路也更稳当了。\n\n具体的运动内容包括：\n1. 坐姿抬腿，每次15个，2组\n2. 靠墙半蹲，坚持30秒，3组\n3. 平板支撑，坚持20秒，2组\n\n关键是要保持坚持，希望这个分享能帮助到同样情况的朋友们！',
        images: [
          '/static/images/exercise-sample1.jpg',
          '/static/images/exercise-sample2.jpg',
          '/static/images/exercise-sample3.jpg'
        ],
        category: '经验分享',
        author: {
          id: '10001',
          nickname: '健康达人',
          avatar: '/static/images/avatar-1.png'
        },
        createTime: Date.now() - 86400000 * 3, // 3天前
        viewCount: 238,
        commentCount: 28,
        likeCount: 56
      };
      
      this.postInfo = mockPost;
    },
    
    // 添加测试评论数据
    addMockComments() {
      const mockComments = [
        {
          id: '101',
          content: '感谢分享，我也是肌少症患者，会尝试你推荐的运动方案。',
          createTime: Date.now() - 86400000 * 2, // 2天前
          user: {
            id: '10002',
            nickname: '阳光明媚',
            avatar: '/static/images/avatar-2.png'
          },
          likeCount: 12,
          isLiked: false,
          replyCount: 2,
          replies: [
            {
              id: '1011',
              content: '希望对你有帮助，坚持才是最重要的！',
              createTime: Date.now() - 86400000 * 2 + 3600000, // 2天前，1小时后
              user: {
                id: '10001',
                nickname: '健康达人',
                avatar: '/static/images/avatar-1.png'
              },
              replyTo: {
                id: '10002',
                nickname: '阳光明媚'
              }
            },
            {
              id: '1012',
              content: '我也在尝试这套运动，确实很有效果。',
              createTime: Date.now() - 86400000 * 1, // 1天前
              user: {
                id: '10003',
                nickname: '晨曦微光',
                avatar: '/static/images/avatar-3.png'
              },
              replyTo: {
                id: '10002',
                nickname: '阳光明媚'
              }
            }
          ]
        },
        {
          id: '102',
          content: '请问第二个动作有没有视频示范？我不确定自己做的对不对。',
          createTime: Date.now() - 86400000 * 1.5, // 1.5天前
          user: {
            id: '10004',
            nickname: '清风徐来',
            avatar: '/static/images/avatar-4.png'
          },
          likeCount: 5,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              id: '1021',
              content: '你可以在APP的运动指导视频栏目里找到"靠墙半蹲"的详细教程。',
              createTime: Date.now() - 86400000 * 1.2, // 1.2天前
              user: {
                id: '10001',
                nickname: '健康达人',
                avatar: '/static/images/avatar-1.png'
              },
              replyTo: {
                id: '10004',
                nickname: '清风徐来'
              }
            }
          ]
        },
        {
          id: '103',
          content: '坚持就是胜利，加油！',
          createTime: Date.now() - 3600000 * 5, // 5小时前
          user: {
            id: '10005',
            nickname: '乐观向上',
            avatar: '/static/images/avatar-5.png'
          },
          likeCount: 3,
          isLiked: false,
          replyCount: 0,
          replies: []
        }
      ];
      
      this.commentList = mockComments;
      this.hasMoreComments = false;
    },
    
    // 添加测试相关推荐数据
    addMockRelatedPosts() {
      const mockRelatedPosts = [
        {
          id: '2',
          title: '老年人抗阻训练安全指南：预防肌少症进阶方案',
          viewCount: 156
        },
        {
          id: '3',
          title: '六个月肌少症康复历程：从无法自主站立到健步如飞',
          viewCount: 203
        },
        {
          id: '4',
          title: '营养师推荐：5种富含优质蛋白质的简单家常菜做法',
          viewCount: 189
        }
      ];
      
      this.relatedPosts = mockRelatedPosts;
    },
    
    // 点赞帖子
    toggleLike() {
      uni.request({
        url: '/api/social/posts/' + this.postId + '/like',
        method: this.isLiked ? 'DELETE' : 'POST',
        success: (res) => {
          if (res.data.code === 0) {
            this.isLiked = !this.isLiked;
            this.postInfo.likeCount = this.isLiked 
              ? this.postInfo.likeCount + 1 
              : Math.max(0, this.postInfo.likeCount - 1);
          }
        }
      });
      
      // 本地模拟效果
      this.isLiked = !this.isLiked;
      this.postInfo.likeCount = this.isLiked 
        ? this.postInfo.likeCount + 1 
        : Math.max(0, this.postInfo.likeCount - 1);
    },
    
    // 点赞评论
    likeComment(index) {
      const comment = this.commentList[index];
      
      uni.request({
        url: '/api/social/comments/' + comment.id + '/like',
        method: comment.isLiked ? 'DELETE' : 'POST',
        success: (res) => {
          if (res.data.code === 0) {
            comment.isLiked = !comment.isLiked;
            comment.likeCount = comment.isLiked 
              ? comment.likeCount + 1 
              : Math.max(0, comment.likeCount - 1);
            
            this.$set(this.commentList, index, comment);
          }
        }
      });
      
      // 本地模拟效果
      comment.isLiked = !comment.isLiked;
      comment.likeCount = comment.isLiked 
        ? comment.likeCount + 1 
        : Math.max(0, comment.likeCount - 1);
      
      this.$set(this.commentList, index, comment);
    },
    
    // 回复评论
    replyToComment(comment) {
      this.replyInfo = {
        commentId: comment.id,
        user: comment.user
      };
      
      // 获取输入框焦点
      setTimeout(() => {
        const inputEl = document.querySelector('input');
        if (inputEl) {
          inputEl.focus();
        }
      }, 100);
    },
    
    // 提交评论
    submitComment() {
      if (!this.commentContent.trim()) return;
      
      uni.showLoading({
        title: '提交中...'
      });
      
      const data = {
        postId: this.postId,
        content: this.commentContent
      };
      
      if (this.replyInfo) {
        data.parentId = this.replyInfo.commentId;
        data.replyToId = this.replyInfo.user.id;
      }
      
      uni.request({
        url: '/api/social/comments',
        method: 'POST',
        data,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '评论成功',
              icon: 'success'
            });
            
            this.commentContent = '';
            this.replyInfo = null;
            
            // 刷新评论列表
            this.commentPage = 1;
            this.loadComments();
            
            // 更新评论数
            this.postInfo.commentCount++;
          } else {
            uni.showToast({
              title: res.data.message || '评论失败',
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
      
      // 本地模拟效果
      setTimeout(() => {
        uni.hideLoading();
        
        uni.showToast({
          title: '评论成功',
          icon: 'success'
        });
        
        // 添加一条新评论到列表
        if (this.replyInfo) {
          // 添加回复
          for (let i = 0; i < this.commentList.length; i++) {
            if (this.commentList[i].id === this.replyInfo.commentId) {
              if (!this.commentList[i].replies) {
                this.commentList[i].replies = [];
              }
              
              const newReply = {
                id: 'reply-' + Date.now(),
                content: this.commentContent,
                createTime: Date.now(),
                user: {
                  id: '10001',
                  nickname: '健康达人',
                  avatar: '/static/images/avatar-1.png'
                },
                replyTo: {
                  id: this.replyInfo.user.id,
                  nickname: this.replyInfo.user.nickname
                }
              };
              
              this.commentList[i].replies.push(newReply);
              this.commentList[i].replyCount++;
              break;
            }
          }
        } else {
          // 添加新评论
          const newComment = {
            id: 'comment-' + Date.now(),
            content: this.commentContent,
            createTime: Date.now(),
            user: {
              id: '10001',
              nickname: '健康达人',
              avatar: '/static/images/avatar-1.png'
            },
            likeCount: 0,
            isLiked: false,
            replyCount: 0,
            replies: []
          };
          
          this.commentList.unshift(newComment);
          this.postInfo.commentCount++;
        }
        
        this.commentContent = '';
        this.replyInfo = null;
      }, 500);
    },
    
    // 加载更多回复
    loadMoreReplies(commentId, index) {
      uni.request({
        url: '/api/social/comments/replies',
        method: 'GET',
        data: {
          commentId,
          page: 1,
          size: 20
        },
        success: (res) => {
          if (res.data.code === 0) {
            const comment = this.commentList[index];
            comment.replies = res.data.data || [];
            this.$set(this.commentList, index, comment);
          }
        }
      });
    },
    
    // 加载更多评论
    loadMoreComments() {
      this.commentPage++;
      this.loadComments();
    },
    
    // 分享帖子
    sharePost() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: this.postInfo.title,
        summary: this.postInfo.content.substring(0, 40) + '...',
        imageUrl: this.postInfo.images && this.postInfo.images.length > 0 ? this.postInfo.images[0] : '',
        success: (res) => {
          console.log('分享成功');
        },
        fail: (err) => {
          console.log('分享失败', err);
        }
      });
    },
    
    // 预览图片
    previewImage(index) {
      uni.previewImage({
        urls: this.postInfo.images,
        current: index
      });
    },
    
    // 滚动到评论区
    scrollToComment() {
      const commentSection = document.getElementById('comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    // 跳转到相关帖子
    navigateToPost(postId) {
      if (postId === this.postId) return;
      
      uni.navigateTo({
        url: './post-detail?id=' + postId
      });
    },
    
    // 格式化时间
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
    
    // 格式化内容（处理换行等）
    formatContent(content) {
      if (!content) return '';
      return content.replace(/\n/g, '<br>');
    }
  }
}
</script>

<style>
@import './post-detail.scss';
</style>
