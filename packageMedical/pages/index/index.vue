<template>
  <view class="medical-index-container">
    <u-navbar title="医疗健康" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 用户健康卡片 -->
      <view class="user-card">
        <view class="user-info">
          <image class="user-avatar" src="https://randomuser.me/api/portraits/men/85.jpg" mode="aspectFill"></image>
          <view class="user-meta">
            <view class="user-name-wrapper">
              <text class="user-name">健康用户</text>
              <text class="user-tag">已实名认证</text>
            </view>
            <view class="user-stats">
              <text class="stat-item">上次体检：2024-12-15</text>
              <text class="stat-item">健康状态：良好</text>
            </view>
          </view>
        </view>
        <view class="health-score">
          <text>92</text>
          <text class="score-label">健康分</text>
        </view>
      </view>
      
      <!-- 功能模块导航 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">功能导航</text>
        </view>
        <view class="action-grid">
          <view class="action-item" @click="navigateTo('/packageMedical/pages/consultation/consultation')">
            <view class="action-icon consultation-icon">
              <u-icon name="chat" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">医生咨询</text>
          </view>
          
          <view class="action-item" @click="navigateTo('/packageMedical/pages/appointment/appointment')">
            <view class="action-icon appointment-icon">
              <u-icon name="calendar" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">预约挂号</text>
          </view>
          
          <view class="action-item" @click="navigateTo('/packageMedical/pages/medical-record/medical-record')">
            <view class="action-icon record-icon">
              <u-icon name="file-text" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">我的病历</text>
          </view>
          
          <view class="action-item" @click="showComingSoon">
            <view class="action-icon health-icon">
              <u-icon name="heart" size="32" color="#ffffff"></u-icon>
            </view>
            <text class="action-title">健康报告</text>
          </view>
        </view>
      </view>
      
      <!-- 健康提醒 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">健康提醒</text>
          <text class="section-more" @click="navigateTo('/pages/reminder/reminder-settings')">更多</text>
        </view>
        <view class="reminder-list">
          <view class="reminder-item">
            <view class="reminder-icon medication-icon">
              <u-icon name="bell" size="24" color="#ffffff"></u-icon>
            </view>
            <view class="reminder-content">
              <text class="reminder-title">服药提醒</text>
              <text class="reminder-time">今天 12:30</text>
              <text class="reminder-desc">钙片 2片，饭后服用</text>
            </view>
            <view class="reminder-status">
              <u-tag text="待完成" type="warning" size="mini"></u-tag>
            </view>
          </view>
          
          <view class="reminder-item">
            <view class="reminder-icon appointment-icon">
              <u-icon name="calendar" size="24" color="#ffffff"></u-icon>
            </view>
            <view class="reminder-content">
              <text class="reminder-title">复诊提醒</text>
              <text class="reminder-time">明天 09:30</text>
              <text class="reminder-desc">骨科复诊，张医生</text>
            </view>
            <view class="reminder-status">
              <u-tag text="未开始" type="primary" size="mini"></u-tag>
            </view>
          </view>
          
          <view class="reminder-item">
            <view class="reminder-icon exercise-icon">
              <u-icon name="heart" size="24" color="#ffffff"></u-icon>
            </view>
            <view class="reminder-content">
              <text class="reminder-title">运动提醒</text>
              <text class="reminder-time">今天 18:00</text>
              <text class="reminder-desc">力量训练，30分钟</text>
            </view>
            <view class="reminder-status">
              <u-tag text="待完成" type="warning" size="mini"></u-tag>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 推荐医生 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">推荐医生</text>
          <text class="section-more" @click="navigateTo('/packageMedical/pages/consultation/consultation')">查看全部</text>
        </view>
        <scroll-view scroll-x class="doctor-scroll" show-scrollbar="false">
          <view class="doctor-list">
            <view class="doctor-item" v-for="(doctor, index) in recommendDoctors" :key="index" @click="viewDoctorDetail(doctor.id)">
              <image class="doctor-avatar" :src="doctor.avatar" mode="aspectFill"></image>
              <text class="doctor-name">{{ doctor.name }}</text>
              <text class="doctor-title">{{ doctor.title }}</text>
              <text class="doctor-hospital">{{ doctor.hospital }}</text>
              <view class="doctor-rating">
                <u-icon name="star-fill" size="14" color="#ff9900"></u-icon>
                <text>{{ doctor.rating }}</text>
              </view>
              <view class="doctor-consult">
                <u-button type="primary" size="mini" @click.stop="startConsultation(doctor.id)">咨询</u-button>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 健康资讯 -->
      <view class="section-container">
        <view class="section-header">
          <text class="section-title">健康资讯</text>
          <text class="section-more" @click="showComingSoon">更多</text>
        </view>
        <view class="article-list">
          <view class="article-item" v-for="(article, index) in healthArticles" :key="index" @click="viewArticle(article.id)">
            <view class="article-content">
              <text class="article-title">{{ article.title }}</text>
              <text class="article-desc">{{ article.summary }}</text>
              <view class="article-meta">
                <text class="article-source">{{ article.source }}</text>
                <text class="article-time">{{ article.time }}</text>
              </view>
            </view>
            <image class="article-image" :src="article.image" mode="aspectFill"></image>
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
      recommendDoctors: [
        {
          id: '1001',
          name: '张医生',
          title: '主任医师',
          hospital: '协和医院·骨科',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          rating: 4.9,
          specialties: ['骨科', '关节炎', '肌少症']
        },
        {
          id: '1002',
          name: '李医生',
          title: '副主任医师',
          hospital: '仁济医院·营养科',
          avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
          rating: 4.8,
          specialties: ['营养学', '蛋白质摄入', '肌少症']
        },
        {
          id: '1003',
          name: '王医生',
          title: '主治医师',
          hospital: '同济医院·康复科',
          avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
          rating: 4.7,
          specialties: ['康复医学', '运动康复', '肌肉训练']
        },
        {
          id: '1004',
          name: '赵医生',
          title: '主任医师',
          hospital: '华山医院·内科',
          avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
          rating: 4.9,
          specialties: ['内分泌科', '代谢疾病', '老年医学']
        },
        {
          id: '1005',
          name: '陈医生',
          title: '副主任医师',
          hospital: '瑞金医院·运动医学科',
          avatar: 'https://randomuser.me/api/portraits/men/37.jpg',
          rating: 4.6,
          specialties: ['运动医学', '肌肉康复', '运动损伤']
        }
      ],
      healthArticles: [
        {
          id: '2001',
          title: '肌少症患者如何科学补充蛋白质？',
          summary: '肌少症患者需要合理增加蛋白质摄入，但过量摄入可能增加肾脏负担。本文介绍科学的蛋白质补充方案...',
          source: '中国营养学会',
          time: '2天前',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'
        },
        {
          id: '2002',
          title: '老年人肌少症预防指南发布，这些运动最有效',
          summary: '国际老年医学会最新发布肌少症预防指南，推荐5种最有效的力量训练方法，每周至少进行3次...',
          source: '健康时报',
          time: '3天前',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
        },
        {
          id: '2003',
          title: '新研究：维生素D不足与肌少症风险增加显著相关',
          summary: '最新研究表明，维生素D水平低于30ng/ml的人群肌少症风险增加40%，老年人尤应重视维生素D的补充...',
          source: '医学前沿',
          time: '1周前',
          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352'
        }
      ]
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url
      });
    },
    viewDoctorDetail(doctorId) {
      uni.navigateTo({
        url: `/packageMedical/pages/doctor-detail/doctor-detail?id=${doctorId}`
      });
    },
    startConsultation(doctorId) {
      uni.navigateTo({
        url: `/packageMedical/pages/chat/consultation-chat?doctorId=${doctorId}`
      });
    },
    viewArticle(articleId) {
      // 暂时使用提示
      this.showComingSoon();
    },
    showComingSoon() {
      uni.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.medical-index-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .content-wrapper {
    padding: 20rpx;
  }
  
  // 用户健康卡片
  .user-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .user-info {
      display: flex;
      align-items: center;
      
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        margin-right: 20rpx;
      }
      
      .user-meta {
        .user-name-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          .user-name {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
            margin-right: 16rpx;
          }
          
          .user-tag {
            font-size: 24rpx;
            color: #ffffff;
            background-color: #19be6b;
            padding: 4rpx 12rpx;
            border-radius: 20rpx;
          }
        }
        
        .user-stats {
          font-size: 28rpx;
          color: #666;
          
          .stat-item {
            margin-right: 20rpx;
          }
        }
      }
    }
    
    .health-score {
      background-color: #2979ff;
      color: #ffffff;
      padding: 16rpx 24rpx;
      border-radius: 16rpx;
      text-align: center;
      
      text {
        font-size: 40rpx;
        font-weight: bold;
        display: block;
      }
      
      .score-label {
        font-size: 24rpx;
        font-weight: normal;
        margin-top: 4rpx;
      }
    }
  }
  
  // 通用区块样式
  .section-container {
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .section-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
      }
      
      .section-more {
        font-size: 28rpx;
        color: #2979ff;
      }
    }
  }
  
  // 功能导航
  .action-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .action-item {
      width: 22%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20rpx;
      
      .action-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16rpx;
      }
      
      .consultation-icon {
        background-color: #2979ff;
      }
      
      .appointment-icon {
        background-color: #ff9900;
      }
      
      .record-icon {
        background-color: #19be6b;
      }
      
      .health-icon {
        background-color: #f44336;
      }
      
      .action-title {
        font-size: 28rpx;
        color: #333;
        text-align: center;
      }
    }
  }
  
  // 健康提醒
  .reminder-list {
    .reminder-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .reminder-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
      }
      
      .medication-icon {
        background-color: #ff9900;
      }
      
      .appointment-icon {
        background-color: #2979ff;
      }
      
      .exercise-icon {
        background-color: #19be6b;
      }
      
      .reminder-content {
        flex: 1;
        
        .reminder-title {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 6rpx;
          display: block;
        }
        
        .reminder-time {
          font-size: 26rpx;
          color: #999;
          margin-bottom: 6rpx;
          display: block;
        }
        
        .reminder-desc {
          font-size: 28rpx;
          color: #666;
          display: block;
        }
      }
      
      .reminder-status {
        margin-left: 20rpx;
      }
    }
  }
  
  // 推荐医生
  .doctor-scroll {
    width: 100%;
    white-space: nowrap;
    
    .doctor-list {
      display: inline-flex;
      padding: 10rpx 0;
      
      .doctor-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        background-color: #f9f9f9;
        padding: 20rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
        width: 200rpx;
        
        .doctor-avatar {
          width: 120rpx;
          height: 120rpx;
          border-radius: 60rpx;
          margin-bottom: 16rpx;
        }
        
        .doctor-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 6rpx;
        }
        
        .doctor-title {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 6rpx;
        }
        
        .doctor-hospital {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 10rpx;
          text-align: center;
          white-space: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          overflow: hidden;
        }
        
        .doctor-rating {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;
          
          text {
            font-size: 24rpx;
            color: #ff9900;
            margin-left: 6rpx;
          }
        }
      }
    }
  }
  
  // 健康资讯
  .article-list {
    .article-item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .article-content {
        flex: 1;
        margin-right: 20rpx;
        
        .article-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
          display: block;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
        
        .article-desc {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: block;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
        
        .article-meta {
          display: flex;
          align-items: center;
          
          .article-source {
            font-size: 24rpx;
            color: #999;
            margin-right: 20rpx;
          }
          
          .article-time {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
      
      .article-image {
        width: 200rpx;
        height: 150rpx;
        border-radius: 8rpx;
      }
    }
  }
}
</style>
