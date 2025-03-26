<template>
  <view class="reviews-container">
    <u-navbar title="医生评价" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 统计摘要 -->
      <view class="summary-card">
        <view class="doctor-info">
          <image class="doctor-avatar" :src="doctorInfo.avatar" mode="aspectFill"></image>
          <view class="doctor-detail">
            <text class="doctor-name">{{ doctorInfo.name }}</text>
            <view class="doctor-rating">
              <u-icon name="star-fill" size="24" color="#ff9900" v-for="i in Math.floor(doctorInfo.rating)" :key="i"></u-icon>
              <u-icon name="star-half-fill" size="24" color="#ff9900" v-if="doctorInfo.rating % 1 >= 0.5"></u-icon>
              <u-icon name="star" size="24" color="#ff9900" v-for="i in (5 - Math.ceil(doctorInfo.rating))" :key="i + 5"></u-icon>
              <text class="rating-value">{{ doctorInfo.rating }}</text>
              <text class="rating-count">({{ doctorInfo.ratingCount }})</text>
            </view>
          </view>
        </view>
        
        <view class="rating-stats">
          <view class="stat-item" v-for="(item, index) in ratingStats" :key="index">
            <text class="stat-label">{{ item.label }}</text>
            <view class="progress-bar">
              <view class="progress" :style="{ width: item.percentage + '%' }"></view>
            </view>
            <text class="stat-value">{{ item.percentage }}%</text>
          </view>
        </view>
      </view>
      
      <!-- 过滤器 -->
      <view class="filter-options">
        <view class="filter-title">评价筛选：</view>
        <view class="filter-tabs">
          <view 
            class="filter-tab" 
            v-for="(tab, index) in filterTabs" 
            :key="index"
            :class="{ active: currentFilter === tab.value }"
            @click="changeFilter(tab.value)"
          >
            {{ tab.label }}
          </view>
        </view>
      </view>
      
      <!-- 评价列表 -->
      <view class="review-list">
        <view class="review-item" v-for="(review, index) in filteredReviews" :key="index">
          <view class="review-header">
            <view class="reviewer-info">
              <image class="reviewer-avatar" :src="review.avatar" mode="aspectFill"></image>
              <text class="reviewer-name">{{ review.name }}</text>
            </view>
            <view class="review-time">{{ review.time }}</view>
          </view>
          
          <view class="review-rating">
            <u-icon name="star-fill" size="20" color="#ff9900" v-for="i in review.rating" :key="i"></u-icon>
          </view>
          
          <view class="review-content">
            <text>{{ review.content }}</text>
          </view>
          
          <view class="review-images" v-if="review.images && review.images.length > 0">
            <image 
              v-for="(image, imgIndex) in review.images" 
              :key="imgIndex" 
              :src="image" 
              mode="aspectFill"
              @tap="previewImage(image, review.images)"
            ></image>
          </view>
          
          <view class="review-reply" v-if="review.reply">
            <text class="reply-header">医生回复：</text>
            <text class="reply-content">{{ review.reply }}</text>
          </view>
        </view>
        
        <view class="empty-reviews" v-if="filteredReviews.length === 0">
          <u-empty mode="data" text="暂无评价" marginTop="40"></u-empty>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
    data() {
        return {
            doctorId: '',
            doctorInfo: {
                id: '',
                name: '',
                avatar: '',
                rating: 0,
                ratingCount: 0
            },
            currentFilter: 'all',
            filterTabs: [
                { value: 'all', label: '全部' },
                { value: 'positive', label: '好评' },
                { value: 'neutral', label: '中评' },
                { value: 'negative', label: '差评' },
                { value: 'withImages', label: '有图' },
                { value: 'withReplies', label: '有回复' }
            ],
            ratingStats: [
                { label: '5星', percentage: 0, count: 0 },
                { label: '4星', percentage: 0, count: 0 },
                { label: '3星', percentage: 0, count: 0 },
                { label: '2星', percentage: 0, count: 0 },
                { label: '1星', percentage: 0, count: 0 }
            ],
            allReviews: [],
            filteredReviews: [],
            // 测试数据
            testDoctors: {
                '1001': {
                    id: '1001',
                    name: '张医生',
                    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
                    rating: 4.9,
                    ratingCount: 524,
                    reviews: [
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
                            name: '患者1',
                            rating: 5,
                            content: '张医生医术精湛，态度和蔼，给了我很多专业的建议，手术非常成功，恢复得很好！',
                            time: '2023-12-15',
                            images: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/238/200/300'],
                            reply: '谢谢您的信任，祝您健康！'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
                            name: '患者2',
                            rating: 5,
                            content: '张医生很耐心，详细解答了我所有的问题，治疗方案很有效，现在已经痊愈了。',
                            time: '2023-11-20',
                            images: [],
                            reply: null
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
                            name: '患者3',
                            rating: 4,
                            content: '专业水平很高，诊断准确，治疗得当。就是预约有点难。',
                            time: '2023-10-05',
                            images: [],
                            reply: '感谢您的评价，我们会继续改进预约系统，提供更便捷的服务。'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
                            name: '患者4',
                            rating: 5,
                            content: '医生非常专业，诊断精准，给出的治疗方案非常适合我的情况，效果明显。',
                            time: '2023-09-22',
                            images: ['https://picsum.photos/id/239/200/300'],
                            reply: null
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
                            name: '患者5',
                            rating: 3,
                            content: '医生诊疗能力还不错，但是总感觉有点急急忙忙的，可能是病人太多了吧。',
                            time: '2023-09-15',
                            images: [],
                            reply: '非常抱歉给您带来不好的体验，我们会安排更合理的就诊时间，确保每位患者都能得到充分的诊疗。'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/27.jpg',
                            name: '患者6',
                            rating: 5,
                            content: '张医生不仅专业知识丰富，而且非常有耐心，会详细地解释病情和治疗方案，让人非常安心。',
                            time: '2023-08-30',
                            images: [],
                            reply: '谢谢您的肯定，我会继续努力提供优质的医疗服务。'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
                            name: '患者7',
                            rating: 2,
                            content: '等待时间太长，预约了但还是要等很久，感觉医院管理有问题。',
                            time: '2023-08-15',
                            images: [],
                            reply: '非常抱歉，我们正在改进排班和预约系统，争取减少等待时间。感谢您的反馈。'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
                            name: '患者8',
                            rating: 5,
                            content: '手术效果非常好，术后恢复也很快，张医生术前术后都给了很多专业的建议，非常感谢！',
                            time: '2023-07-28',
                            images: ['https://picsum.photos/id/240/200/300', 'https://picsum.photos/id/241/200/300'],
                            reply: '祝您健康！有任何问题随时咨询。'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
                            name: '患者9',
                            rating: 4,
                            content: '治疗效果很好，但是门诊环境有点嘈杂，影响沟通。',
                            time: '2023-07-15',
                            images: [],
                            reply: null
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
                            name: '患者10',
                            rating: 5,
                            content: '张医生给我制定的康复计划非常适合我，恢复得比预期要快，特别感谢！',
                            time: '2023-06-30',
                            images: [],
                            reply: '康复顺利是我们共同的心愿，继续保持，祝您身体健康！'
                        }
                    ]
                },
                '1002': {
                    id: '1002',
                    name: '李医生',
                    avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
                    rating: 4.7,
                    ratingCount: 352,
                    reviews: [
                        // 李医生的评价数据...
                        {
                            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                            name: '患者11',
                            rating: 5,
                            content: '李医生的康复治疗方案非常专业，我的恢复速度超出预期！',
                            time: '2023-12-10',
                            images: ['https://picsum.photos/id/242/200/300'],
                            reply: '很高兴看到您恢复顺利，继续保持！'
                        },
                        {
                            avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
                            name: '患者12',
                            rating: 4,
                            content: '李医生很专业，康复指导很详细，但诊所设施可以再改善一下。',
                            time: '2023-11-18',
                            images: [],
                            reply: '感谢您的建议，我们正在升级诊所设施，希望下次能给您带来更好的体验。'
                        }
                    ]
                },
                // 其他医生的数据...
            }
        }
    },

    onLoad(options) {
        if (options.doctorId) {
            this.doctorId = options.doctorId;
            this.loadDoctorInfo();
            this.loadReviews();
        }
    },

    methods: {
        // 加载医生基本信息
        loadDoctorInfo() {
            if (this.testDoctors[this.doctorId]) {
                const doctor = this.testDoctors[this.doctorId];
                this.doctorInfo = {
                    id: doctor.id,
                    name: doctor.name,
                    avatar: doctor.avatar,
                    rating: doctor.rating,
                    ratingCount: doctor.ratingCount
                };
            } else {
                uni.showToast({
                    title: '未找到医生信息',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
        },

        // 加载评价
        loadReviews() {
            uni.showLoading({
                title: '加载中...'
            });

            setTimeout(() => {
                uni.hideLoading();

                if (this.testDoctors[this.doctorId] && this.testDoctors[this.doctorId].reviews) {
                    this.allReviews = this.testDoctors[this.doctorId].reviews;

                    // 计算统计数据
                    this.calculateStats();

                    // 应用过滤器
                    this.applyFilter();
                } else {
                    this.allReviews = [];
                    this.filteredReviews = [];
                }
            }, 500);
        },

        // 计算评分统计数据
        calculateStats() {
            const reviews = this.allReviews;
            const totalCount = reviews.length;

            if (totalCount === 0) return;

            // 重置计数
            this.ratingStats.forEach(stat => {
                stat.count = 0;
                stat.percentage = 0;
            });

            // 统计各星级数量
            reviews.forEach(review => {
                const rating = Math.floor(review.rating);
                if (rating > 0 && rating <= 5) {
                    this.ratingStats[5 - rating].count++;
                }
            });

            // 计算百分比
            this.ratingStats.forEach(stat => {
                stat.percentage = Math.round((stat.count / totalCount) * 100);
            });
        },

        // 切换过滤器
        changeFilter(filterValue) {
            this.currentFilter = filterValue;
            this.applyFilter();
        },

        // 应用过滤器
        applyFilter() {
            switch (this.currentFilter) {
                case 'positive':
                    this.filteredReviews = this.allReviews.filter(review => review.rating >= 4);
                    break;
                case 'neutral':
                    this.filteredReviews = this.allReviews.filter(review => review.rating === 3);
                    break;
                case 'negative':
                    this.filteredReviews = this.allReviews.filter(review => review.rating <= 2);
                    break;
                case 'withImages':
                    this.filteredReviews = this.allReviews.filter(review => review.images && review.images.length > 0);
                    break;
                case 'withReplies':
                    this.filteredReviews = this.allReviews.filter(review => review.reply);
                    break;
                default: // 'all'
                    this.filteredReviews = [...this.allReviews];
            }
        },

        // 预览图片
        previewImage(current, urls) {
            uni.previewImage({
                current: current,
                urls: urls
            });
        }
    }
}

</script>

<style lang="scss">
.reviews-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;

    .content-wrapper {
        padding: 20rpx;
        flex: 1;
    }

    .summary-card {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

        .doctor-info {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;

            .doctor-avatar {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }

            .doctor-detail {
                flex: 1;

                .doctor-name {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333333;
                    margin-bottom: 10rpx;
                    display: block;
                }

                .doctor-rating {
                    display: flex;
                    align-items: center;

                    .rating-value {
                        font-size: 28rpx;
                        color: #ff9900;
                        margin: 0 8rpx;
                    }

                    .rating-count {
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
            }
        }

        .rating-stats {
            border-top: 1px solid #f0f0f0;
            padding-top: 20rpx;

            .stat-item {
                display: flex;
                align-items: center;
                margin-bottom: 16rpx;

                .stat-label {
                    width: 80rpx;
                    font-size: 26rpx;
                    color: #666666;
                }

                .progress-bar {
                    flex: 1;
                    height: 16rpx;
                    background-color: #f0f0f0;
                    border-radius: 8rpx;
                    margin: 0 20rpx;
                    overflow: hidden;

                    .progress {
                        height: 100%;
                        background-color: #ff9900;
                        border-radius: 8rpx;
                    }
                }

                .stat-value {
                    width: 80rpx;
                    font-size: 26rpx;
                    color: #666666;
                    text-align: right;
                }
            }
        }
    }

    .filter-options {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 20rpx 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;

        .filter-title {
            font-size: 28rpx;
            color: #333333;
            margin-right: 20rpx;
            white-space: nowrap;
        }

        .filter-tabs {
            flex: 1;
            display: flex;
            flex-wrap: wrap;

            .filter-tab {
                padding: 10rpx 20rpx;
                font-size: 26rpx;
                color: #666666;
                background-color: #f8f8f8;
                border-radius: 30rpx;
                margin-right: 16rpx;
                margin-bottom: 16rpx;

                &.active {
                    color: #ffffff;
                    background-color: #2979ff;
                }
            }
        }
    }

    .review-list {
        .review-item {
            background-color: #ffffff;
            border-radius: 12rpx;
            padding: 30rpx;
            margin-bottom: 20rpx;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16rpx;

                .reviewer-info {
                    display: flex;
                    align-items: center;

                    .reviewer-avatar {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 50%;
                        margin-right: 16rpx;
                    }

                    .reviewer-name {
                        font-size: 28rpx;
                        color: #333333;
                    }
                }

                .review-time {
                    font-size: 24rpx;
                    color: #999999;
                }
            }

            .review-rating {
                display: flex;
                margin-bottom: 16rpx;
            }

            .review-content {
                font-size: 28rpx;
                color: #333333;
                line-height: 1.6;
                margin-bottom: 16rpx;
            }

            .review-images {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 16rpx;

                image {
                    width: 160rpx;
                    height: 160rpx;
                    margin-right: 16rpx;
                    margin-bottom: 16rpx;
                    border-radius: 8rpx;
                }
            }

            .review-reply {
                background-color: #f8f8f8;
                padding: 16rpx 20rpx;
                border-radius: 8rpx;

                .reply-header {
                    font-size: 26rpx;
                    color: #2979ff;
                    font-weight: bold;
                }

                .reply-content {
                    font-size: 26rpx;
                    color: #666666;
                    line-height: 1.6;
                }
            }
        }

        .empty-reviews {
            padding: 50rpx 0;
        }
    }
}
</style>
