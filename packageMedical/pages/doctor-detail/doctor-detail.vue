<template>
  <view class="doctor-detail-container">
    <u-navbar title="医生详情" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 医生基本信息卡片 -->
      <view class="doctor-card">
        <view class="doctor-header">
          <image class="doctor-avatar" :src="doctorInfo.avatar" mode="aspectFill"></image>
          <view class="doctor-info">
            <view class="doctor-name-title">
              <text class="doctor-name">{{ doctorInfo.name }}</text>
              <text class="doctor-title">{{ doctorInfo.title }}</text>
            </view>
            <view class="doctor-hospital">{{ doctorInfo.hospital }}</view>
            <view class="doctor-department">{{ doctorInfo.department }}</view>
          </view>
          <view class="doctor-status" v-if="doctorInfo.isOnline">
            <text class="status-text">在线</text>
          </view>
        </view>
        
        <view class="doctor-rating">
          <view class="rating-stars">
            <u-icon name="star-fill" size="24" color="#ff9900" v-for="i in Math.floor(doctorInfo.rating)" :key="i"></u-icon>
            <u-icon name="star-half-fill" size="24" color="#ff9900" v-if="doctorInfo.rating % 1 >= 0.5"></u-icon>
            <u-icon name="star" size="24" color="#ff9900" v-for="i in (5 - Math.ceil(doctorInfo.rating))" :key="i + 5"></u-icon>
          </view>
          <text class="rating-value">{{ doctorInfo.rating }}</text>
          <text class="rating-count">({{ doctorInfo.ratingCount }}人评价)</text>
        </view>
        
        <view class="doctor-tags">
          <text class="tag-item" v-for="(tag, index) in doctorInfo.specialties" :key="index">{{ tag }}</text>
        </view>
        
        <view class="doctor-statistics">
          <view class="stat-item">
            <text class="stat-value">{{ doctorInfo.consultCount }}</text>
            <text class="stat-label">总咨询量</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ doctorInfo.responseRate }}%</text>
            <text class="stat-label">响应率</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ doctorInfo.goodRatePercent }}%</text>
            <text class="stat-label">好评率</text>
          </view>
        </view>
        
        <view class="doctor-price">
          <text>咨询费用：</text>
          <text class="price-value">¥{{ doctorInfo.price }}/次</text>
        </view>
      </view>
      
      <!-- 医生介绍 -->
      <view class="info-card">
        <view class="card-title">
          <text>医生介绍</text>
        </view>
        <view class="card-content bio-content">
          <text>{{ doctorInfo.bio }}</text>
        </view>
      </view>
      
      <!-- 擅长疾病 -->
      <view class="info-card">
        <view class="card-title">
          <text>擅长疾病</text>
        </view>
        <view class="card-content">
          <view class="skills-list">
            <text class="skill-item" v-for="(skill, index) in doctorInfo.skills" :key="index">{{ skill }}</text>
          </view>
        </view>
      </view>
      
      <!-- 出诊时间 -->
      <view class="info-card">
        <view class="card-title">
          <text>出诊时间</text>
        </view>
        <view class="card-content">
          <view class="schedule-list">
            <view class="schedule-item" v-for="(schedule, index) in doctorInfo.schedule" :key="index">
              <text class="day">{{ schedule.day }}</text>
              <text class="time">{{ schedule.time }}</text>
              <text class="status" :class="{ 'available': schedule.available }">{{ schedule.available ? '可预约' : '约满' }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 患者评价 -->
      <view class="info-card">
        <view class="card-title">
          <text>患者评价</text>
          <text class="view-all" @click="viewAllReviews">查看全部</text>
        </view>
        <view class="card-content">
          <view class="review-list" v-if="doctorInfo.reviews && doctorInfo.reviews.length > 0">
            <view class="review-item" v-for="(review, index) in doctorInfo.reviews.slice(0, 3)" :key="index">
              <view class="review-header">
                <view class="reviewer-info">
                  <image class="reviewer-avatar" :src="review.avatar" mode="aspectFill"></image>
                  <text class="reviewer-name">{{ review.name }}</text>
                </view>
                <view class="review-rating">
                  <u-icon name="star-fill" size="20" color="#ff9900" v-for="i in review.rating" :key="i"></u-icon>
                </view>
              </view>
              <view class="review-content">
                <text>{{ review.content }}</text>
              </view>
              <view class="review-time">
                <text>{{ review.time }}</text>
              </view>
            </view>
          </view>
          <view class="empty-reviews" v-else>
            <text>暂无评价</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="footer-action-bar">
      <view class="action-buttons">
        <view class="action-button favorite" @click="toggleFavorite">
          <u-icon :name="isFavorite ? 'star-fill' : 'star'" size="28" :color="isFavorite ? '#ff9900' : '#999'"></u-icon>
          <text>收藏</text>
        </view>
        <view class="action-button share" @click="shareDoctor">
          <u-icon name="share" size="28" color="#999"></u-icon>
          <text>分享</text>
        </view>
      </view>
      <view class="main-buttons">
        <u-button type="info" @click="makeAppointment">预约挂号</u-button>
        <u-button type="primary" @click="startConsultation">立即咨询</u-button>
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
        title: '',
        hospital: '',
        department: '',
        avatar: '',
        isOnline: false,
        specialties: [],
        rating: 0,
        ratingCount: 0,
        consultCount: 0,
        responseRate: 0,
        goodRatePercent: 0,
        price: 0,
        bio: '',
        skills: [],
        schedule: [],
        reviews: []
      },
      isFavorite: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.doctorId = options.id;
      this.loadDoctorDetail();
    }
  },
  methods: {
    loadDoctorDetail() {
      uni.showLoading({
        title: '加载中'
      });
      
      uni.request({
        url: '/api/medical/doctors/' + this.doctorId,
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.doctorInfo = res.data.data;
            this.checkFavoriteStatus();
          } else {
            uni.showToast({
              title: res.data.message || '获取医生信息失败',
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
    },
    
    checkFavoriteStatus() {
      // 检查是否收藏
      uni.getStorage({
        key: 'favoriteDoctors',
        success: (res) => {
          if (res.data && res.data.includes(this.doctorId)) {
            this.isFavorite = true;
          }
        }
      });
    },
    
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      
      // 保存收藏状态
      uni.getStorage({
        key: 'favoriteDoctors',
        success: (res) => {
          let favorites = res.data || [];
          
          if (this.isFavorite) {
            if (!favorites.includes(this.doctorId)) {
              favorites.push(this.doctorId);
            }
          } else {
            favorites = favorites.filter(id => id !== this.doctorId);
          }
          
          uni.setStorage({
            key: 'favoriteDoctors',
            data: favorites
          });
        },
        fail: () => {
          // 如果没有收藏记录，创建一个新的
          if (this.isFavorite) {
            uni.setStorage({
              key: 'favoriteDoctors',
              data: [this.doctorId]
            });
          }
        }
      });
      
      uni.showToast({
        title: this.isFavorite ? '收藏成功' : '取消收藏',
        icon: 'success'
      });
    },
    
    shareDoctor() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: `${this.doctorInfo.name}医生 - ${this.doctorInfo.hospital}`,
        summary: `${this.doctorInfo.title}，专长：${this.doctorInfo.specialties.join('、')}`,
        imageUrl: this.doctorInfo.avatar,
        success: (res) => {
          console.log('分享成功');
        },
        fail: (err) => {
          console.log('分享失败', err);
        }
      });
    },
    
    makeAppointment() {
      uni.navigateTo({
        url: '../appointment/appointment?doctorId=' + this.doctorId
      });
    },
    
    startConsultation() {
      uni.navigateTo({
        url: '../chat/consultation-chat?doctorId=' + this.doctorId
      });
    },
    
    viewAllReviews() {
      uni.navigateTo({
        url: './reviews/doctor-reviews?doctorId=' + this.doctorId
      });
    }
  }
}
</script>

<style>
@import './doctor-detail.scss';
</style>
