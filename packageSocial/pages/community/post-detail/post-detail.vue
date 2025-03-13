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
        
        <!-- 标签展示 -->
        <view class="post-tags" v-if="postInfo.tags && postInfo.tags.length > 0">
          <view class="tag-item" v-for="(tag, index) in postInfo.tags" :key="index">
            #{{ tag }}
          </view>
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
            <u-icon :name="isLiked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="isLiked ? '#409eff' : '#909399'"></u-icon>
            <text class="action-count" :class="{ active: isLiked }">{{ postInfo.likeCount }}</text>
          </view>
          <view class="action-item" @click="scrollToComment">
            <u-icon name="chat" size="32" color="#909399"></u-icon>
            <text class="action-count">{{ postInfo.commentCount }}</text>
          </view>
          <view class="action-item" @click="sharePost">
            <u-icon name="share" size="32" color="#909399"></u-icon>
            <text class="action-count">分享</text>
          </view>
          <view class="action-item" @click="collectPost">
            <u-icon :name="isCollected ? 'star-fill' : 'star'" size="32" :color="isCollected ? '#409eff' : '#909399'"></u-icon>
            <text class="action-count" :class="{ active: isCollected }">收藏</text>
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
                <u-icon :name="comment.isLiked ? 'thumb-up-fill' : 'thumb-up'" size="26" :color="comment.isLiked ? '#409eff' : '#909399'"></u-icon>
                <text :class="{ active: comment.isLiked }">{{ comment.likeCount }}</text>
              </view>
              <view class="comment-reply" @click="replyToComment(comment)">
                <u-icon name="chat" size="26" color="#909399"></u-icon>
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
                <u-icon name="arrow-right" size="24" color="#409eff"></u-icon>
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
// 导入独立的业务逻辑文件
import postDetailMethods from './post-detail.js';

export default {
  ...postDetailMethods,
}
</script>

<style>
@import './post-detail.scss';

/* 添加标签样式 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.tag-item {
  font-size: 24rpx;
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 16rpx;
  margin-bottom: 12rpx;
}

/* 修正评论输入框样式 */
.comment-input-wrapper .comment-input input {
  height: 70rpx;
  font-size: 28rpx;
}

/* 增强图片预览体验 */
.post-image {
  transition: opacity 0.3s ease;
}

.post-image:active {
  opacity: 0.8;
}

/* 增强点击反馈 */
.action-item, .related-item, .load-more {
  transition: opacity 0.2s ease;
}

.action-item:active, .related-item:active, .load-more:active {
  opacity: 0.7;
}
</style>
