// 帖子详情页面逻辑

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
      isCollected: false,
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
    } else {
      // 没有ID时展示默认测试数据
      this.addMockData();
      this.addMockComments();
      this.addMockRelatedPosts();
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
            this.isCollected = res.data.data.isCollected || false;
          } else {
            uni.showToast({
              title: res.data.message || '获取帖子详情失败',
              icon: 'none'
            });
            
            // 加载失败时展示测试数据
            this.addMockData();
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
          } else {
            // 获取评论失败时显示测试数据
            this.addMockComments();
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
          } else {
            // 获取相关推荐失败时显示测试数据
            this.addMockRelatedPosts();
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
        content: '大家好，我是一名肌少症患者，今天想分享一下我坚持运动一个月的心得体会。\n\n医生给我推荐了一套简单的运动方案，每天只需要10分钟，但效果非常显著。我已经感觉到肌肉力量有所增强，走路也更稳当了。\n\n具体的运动内容包括：\n1. 坐姿抬腿，每次15个，2组\n2. 靠墙半蹲，坚持30秒，3组\n3. 平板支撑，坚持20秒，2组\n\n关键是要保持坚持，希望这个分享能帮助到同样情况的朋友们！\n\n在一个月的锻炼过程中，我也发现了一些小窍门：\n\n- 选择固定的时间段锻炼，养成习惯\n- 锻炼前做充分的热身，避免受伤\n- 根据自己的状态适当调整强度\n- 记录每天的锻炼情况，看到进步会更有动力\n\n希望我的经验分享能帮助到更多人！',
        images: [
          'https://img.freepik.com/free-photo/elderly-woman-exercising-home_23-2149086061.jpg',
          'https://img.freepik.com/free-photo/senior-woman-doing-exercises-with-resistance-band_23-2149086078.jpg',
          'https://img.freepik.com/free-photo/senior-women-doing-tricep-dips-exercise-park_1150-21772.jpg'
        ],
        category: '经验分享',
        author: {
          id: '10001',
          nickname: '健康达人',
          avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
        },
        createTime: Date.now() - 86400000 * 3, // 3天前
        viewCount: 238,
        commentCount: 28,
        likeCount: 56,
        tags: ['肌少症', '康复锻炼', '居家运动']
      };
      
      this.postInfo = mockPost;
    },
    
    // 添加测试评论数据
    addMockComments() {
      const mockComments = [
        {
          id: '101',
          content: '感谢分享，我也是肌少症患者，会尝试你推荐的运动方案。不知道刚开始练习会不会有不适感？',
          createTime: Date.now() - 86400000 * 2, // 2天前
          user: {
            id: '10002',
            nickname: '阳光明媚',
            avatar: 'https://img.freepik.com/free-photo/portrait-senior-man-with-gray-hair-beard_1150-21566.jpg'
          },
          likeCount: 12,
          isLiked: false,
          replyCount: 2,
          replies: [
            {
              id: '1011',
              content: '希望对你有帮助，坚持才是最重要的！刚开始可能会有些酸痛，但一周后就会好很多。',
              createTime: Date.now() - 86400000 * 2 + 3600000, // 2天前，1小时后
              user: {
                id: '10001',
                nickname: '健康达人',
                avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
              },
              replyTo: {
                id: '10002',
                nickname: '阳光明媚'
              }
            },
            {
              id: '1012',
              content: '我也在尝试这套运动，确实很有效果。建议开始时减少组数，循序渐进。',
              createTime: Date.now() - 86400000 * 1, // 1天前
              user: {
                id: '10003',
                nickname: '晨曦微光',
                avatar: 'https://img.freepik.com/free-photo/smiling-senior-man-portrait_23-2149086044.jpg'
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
          content: '请问第二个动作有没有视频示范？我不确定自己做的对不对。靠墙半蹲是否需要特别注意膝关节角度？',
          createTime: Date.now() - 86400000 * 1.5, // 1.5天前
          user: {
            id: '10004',
            nickname: '清风徐来',
            avatar: 'https://img.freepik.com/free-photo/portrait-senior-woman_23-2149086057.jpg'
          },
          likeCount: 5,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              id: '1021',
              content: '你可以在APP的运动指导视频栏目里找到"靠墙半蹲"的详细教程。记得膝关节不要超过脚尖，保持90度角最佳。',
              createTime: Date.now() - 86400000 * 1.2, // 1.2天前
              user: {
                id: '10001',
                nickname: '健康达人',
                avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
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
          content: '坚持就是胜利，加油！肌少症康复是个漫长的过程，但只要持之以恒，一定会有好的结果。',
          createTime: Date.now() - 3600000 * 5, // 5小时前
          user: {
            id: '10005',
            nickname: '乐观向上',
            avatar: 'https://img.freepik.com/free-photo/cheerful-elderly-woman-sits-doctor-s-office_85574-8072.jpg'
          },
          likeCount: 3,
          isLiked: false,
          replyCount: 0,
          replies: []
        },
        {
          id: '104',
          content: '我想问一下，你在运动的时候有没有遇到关节不适的情况？肌少症常常会伴随关节问题。如果有，是怎么解决的？',
          createTime: Date.now() - 3600000 * 10, // 10小时前
          user: {
            id: '10006',
            nickname: '健康研究者',
            avatar: 'https://img.freepik.com/free-photo/portrait-old-man-calling_1098-14026.jpg'
          },
          likeCount: 8,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              id: '1041',
              content: '刚开始有一点不适，但我会在运动前做充分的热身，并且注意控制动作幅度，这样就好多了。也可以考虑配合适当的关节保护品。',
              createTime: Date.now() - 3600000 * 8, // 8小时前
              user: {
                id: '10001',
                nickname: '健康达人',
                avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
              },
              replyTo: {
                id: '10006',
                nickname: '健康研究者'
              }
            }
          ]
        },
        {
          id: '105',
          content: '建议还可以添加一些缓慢的有氧运动，比如散步或轻度游泳，对肌少症也很有帮助。我个人就是通过结合力量训练和游泳，半年时间取得了明显改善。',
          createTime: Date.now() - 3600000 * 12, // 12小时前
          user: {
            id: '10007',
            nickname: '康复专家',
            avatar: 'https://img.freepik.com/free-photo/doctor-checking-senior-man-s-health_23-2149055052.jpg'
          },
          likeCount: 15,
          isLiked: false,
          replyCount: 0,
          replies: []
        },
        {
          id: '106',
          content: '做了两周了，感觉膝盖比以前更有力量了，上下楼梯也不那么费劲了，真心感谢分享！',
          createTime: Date.now() - 3600000 * 3, // 3小时前
          user: {
            id: '10008',
            nickname: '康复路上',
            avatar: 'https://img.freepik.com/free-photo/portrait-senior-man_23-2149086038.jpg'
          },
          likeCount: 6,
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
        },
        {
          id: '5',
          title: '居家肌力训练：不需要器械的全套肌少症康复动作',
          viewCount: 217
        },
        {
          id: '6',
          title: '中老年人肌肉萎缩的早期信号与预防措施',
          viewCount: 242
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
    
    // 收藏帖子
    collectPost() {
      uni.request({
        url: '/api/social/posts/' + this.postId + '/collect',
        method: this.isCollected ? 'DELETE' : 'POST',
        success: (res) => {
          if (res.data.code === 0) {
            this.isCollected = !this.isCollected;
            uni.showToast({
              title: this.isCollected ? '收藏成功' : '已取消收藏',
              icon: 'success'
            });
          }
        }
      });
      
      // 本地模拟效果
      this.isCollected = !this.isCollected;
      uni.showToast({
        title: this.isCollected ? '收藏成功' : '已取消收藏',
        icon: 'success'
      });
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
    
    // 取消回复
    cancelReply() {
      this.replyInfo = null;
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
                  avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
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
              avatar: 'https://img.freepik.com/free-photo/portrait-elderly-woman_23-2149086100.jpg'
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
