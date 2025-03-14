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
            <u-icon name="star-fill" size="24" color="#ff9900" v-for="i in Math.floor(doctorInfo.rating)"
              :key="i"></u-icon>
            <u-icon name="star-half-fill" size="24" color="#ff9900" v-if="doctorInfo.rating % 1 >= 0.5"></u-icon>
            <u-icon name="star" size="24" color="#ff9900" v-for="i in (5 - Math.ceil(doctorInfo.rating))"
              :key="i + 5"></u-icon>
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

        <!-- 移除价格信息 -->
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
              <text class="status" :class="{ 'available': schedule.available }">
                {{ schedule.available ? '可预约' : '约满' }}
              </text>
            </view>
          </view>
        </view>
      </view>

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
        <view class="button-wrapper" @click="makeAppointment">
          <u-button type="info">预约挂号</u-button>
        </view>
        <view class="button-wrapper" @click="startConsultation">
          <u-button type="primary">立即咨询</u-button>
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
      isFavorite: false,
      // 测试数据
      testDoctors: {
        '1001': {
          id: '1001',
          name: '张医生',
          title: '主任医师',
          hospital: '北京协和医院',
          department: '骨科',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          isOnline: true,
          specialties: ['骨科', '运动损伤'],
          rating: 4.9,
          ratingCount: 524,
          consultCount: 1289,
          responseRate: 98,
          goodRatePercent: 99,
          price: 150,
          bio: '张医生，男，主任医师，教授，博士生导师。从事骨科临床、教学和科研工作30余年，专注于运动创伤和骨科疾病的诊疗。曾在美国哈佛大学和德国慕尼黑大学进修学习，掌握国际先进的骨科治疗技术。先后主持和参与国家级、省部级科研项目多项，发表学术论文100余篇，获得国家发明专利5项，荣获多项科研成果奖。',
          skills: ['运动损伤', '关节炎', '骨质疏松', '颈椎病', '腰椎间盘突出', '骨折', '韧带损伤'],
          schedule: [
            { day: '周一', time: '上午 8:00-12:00', available: true },
            { day: '周二', time: '下午 14:00-17:00', available: false },
            { day: '周四', time: '上午 8:00-12:00', available: true },
            { day: '周五', time: '下午 14:00-17:00', available: true }
          ],
          reviews: [
            {
              avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
              name: '患者1',
              rating: 5,
              content: '张医生医术精湛，态度和蔼，给了我很多专业的建议，手术非常成功，恢复得很好！',
              time: '2023-12-15'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
              name: '患者2',
              rating: 5,
              content: '张医生很耐心，详细解答了我所有的问题，治疗方案很有效，现在已经痊愈了。',
              time: '2023-11-20'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
              name: '患者3',
              rating: 4,
              content: '专业水平很高，诊断准确，治疗得当。就是预约有点难。',
              time: '2023-10-05'
            }
          ]
        },
        '1002': {
          id: '1002',
          name: '李医生',
          title: '副主任医师',
          hospital: '上海市第一人民医院',
          department: '康复科',
          avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
          isOnline: false,
          specialties: ['康复医学', '理疗'],
          rating: 4.7,
          ratingCount: 352,
          consultCount: 865,
          responseRate: 96,
          goodRatePercent: 97,
          price: 120,
          bio: '李医生，女，副主任医师，硕士生导师。毕业于上海交通大学医学院，从事康复医学临床工作15年，擅长运动康复、神经康复、骨科康复等领域。曾赴美国梅奥诊所进修学习现代康复技术，是国内较早开展运动功能评定与康复治疗的专家之一。致力于康复医学的推广与普及，开发了多种适合国人的康复训练方法。',
          skills: ['运动康复', '神经康复', '骨科康复', '言语吞咽康复', '理疗', '物理治疗', '作业治疗'],
          schedule: [
            { day: '周一', time: '全天 8:00-17:00', available: true },
            { day: '周三', time: '上午 8:00-12:00', available: true },
            { day: '周五', time: '上午 8:00-12:00', available: false }
          ],
          reviews: [
            {
              avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
              name: '患者4',
              rating: 5,
              content: '李医生的康复治疗方案非常有效，我的肩周炎恢复得很好，感谢李医生细心的治疗和指导！',
              time: '2023-12-20'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
              name: '患者5',
              rating: 4,
              content: '理疗很专业，每次治疗都有明显的效果，医生也很耐心解答问题。',
              time: '2023-11-15'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/men/27.jpg',
              name: '患者6',
              rating: 5,
              content: '我父亲中风后的康复就是在李医生的指导下进行的，恢复效果超出预期，非常感谢！',
              time: '2023-10-25'
            }
          ]
        },
        '1003': {
          id: '1003',
          name: '王医生',
          title: '主治医师',
          hospital: '广州市第一人民医院',
          department: '营养科',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          isOnline: true,
          specialties: ['临床营养', '运动营养'],
          rating: 4.8,
          ratingCount: 412,
          consultCount: 953,
          responseRate: 99,
          goodRatePercent: 98,
          price: 100,
          bio: '王医生，女，主治医师，营养学博士。毕业于中山大学医学院，专注临床营养与运动营养研究10年。曾在加拿大多伦多大学营养学院访学，回国后致力于临床营养治疗与健康管理工作。擅长针对各类慢性疾病的营养干预，尤其是代谢性疾病和运动人群的营养支持。发表相关学术论文30余篇，参与编写《临床营养手册》等专业书籍。',
          skills: ['糖尿病营养', '减重营养', '运动营养', '孕产营养', '肠胃病营养', '肿瘤患者营养支持', '儿童营养'],
          schedule: [
            { day: '周一', time: '下午 14:00-17:00', available: true },
            { day: '周二', time: '全天 8:00-17:00', available: true },
            { day: '周四', time: '上午 8:00-12:00', available: true },
            { day: '周六', time: '上午 8:00-12:00', available: false }
          ],
          reviews: [
            {
              avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
              name: '患者7',
              rating: 5,
              content: '王医生的营养方案非常科学，按照她的建议饮食和运动，3个月减了15斤，而且各项指标都恢复正常了！',
              time: '2023-12-10'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
              name: '患者8',
              rating: 5,
              content: '王医生很专业，为我的糖尿病制定了详细的饮食计划，血糖控制得很好，不需要增加药物剂量。',
              time: '2023-11-28'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
              name: '患者9',
              rating: 4,
              content: '作为一名马拉松爱好者，王医生给我的运动营养建议非常实用，比赛成绩有了明显提升。',
              time: '2023-10-15'
            }
          ]
        },
        '1004': {
          id: '1004',
          name: '刘医生',
          title: '主任医师',
          hospital: '四川大学华西医院',
          department: '内科',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          isOnline: false,
          specialties: ['内分泌科', '代谢病'],
          rating: 4.9,
          ratingCount: 628,
          consultCount: 1532,
          responseRate: 97,
          goodRatePercent: 99,
          price: 180,
          bio: '刘医生，男，主任医师，医学博士，博士生导师。从事内分泌代谢疾病诊疗工作25年，是国内知名的内分泌专家。擅长糖尿病、甲状腺疾病、肥胖症、骨质疏松等常见内分泌疾病的诊治。主持国家自然科学基金项目5项，省部级科研项目10余项，发表SCI论文60余篇。曾获国家科技进步二等奖1项，省部级科技进步一等奖2项。',
          skills: ['糖尿病', '甲状腺疾病', '肥胖症', '代谢综合征', '骨质疏松', '高尿酸血症', '垂体疾病'],
          schedule: [
            { day: '周一', time: '上午 8:30-11:30', available: false },
            { day: '周三', time: '全天 8:30-17:00', available: true },
            { day: '周四', time: '下午 13:30-17:00', available: true }
          ],
          reviews: [
            {
              avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
              name: '患者10',
              rating: 5,
              content: '刘医生是我见过最负责任的医生，我的糖尿病在他的治疗下得到了很好的控制，并且没有任何并发症。',
              time: '2023-12-22'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
              name: '患者11',
              rating: 5,
              content: '我的甲状腺结节在刘医生这里治疗，效果很好，医生很专业，解释得很详细。',
              time: '2023-11-18'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
              name: '患者12',
              rating: 4,
              content: '刘医生的医术很好，态度也非常和蔼，就是挂号太难了，每次都要提前很久预约。',
              time: '2023-10-30'
            }
          ]
        },
        '1005': {
          id: '1005',
          name: '陈医生',
          title: '副主任医师',
          hospital: '浙江大学医学院附属第一医院',
          department: '运动医学科',
          avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
          isOnline: true,
          specialties: ['运动医学', '关节损伤'],
          rating: 4.6,
          ratingCount: 325,
          consultCount: 745,
          responseRate: 95,
          goodRatePercent: 96,
          price: 130,
          bio: '陈医生，男，副主任医师，医学博士。专注于运动损伤的诊疗与康复研究，尤其在关节损伤方面有深入研究。曾在德国和美国进修运动医学技术，回国后致力于推广运动医学和科学健身理念。担任多支专业运动队的队医，积累了丰富的运动损伤救治经验。在国内权威期刊发表论文30余篇，参与编写《运动医学指南》等专著。',
          skills: ['运动损伤', '关节镜手术', '韧带修复', '膝关节疾病', '肩关节疾病', '运动康复', '运动处方'],
          schedule: [
            { day: '周二', time: '上午 8:30-11:30', available: true },
            { day: '周三', time: '下午 13:30-17:00', available: false },
            { day: '周五', time: '全天 8:30-17:00', available: true },
            { day: '周六', time: '上午 8:30-11:30', available: true }
          ],
          reviews: [
            {
              avatar: 'https://randomuser.me/api/portraits/women/34.jpg',
              name: '患者13',
              rating: 5,
              content: '陈医生对我的膝盖损伤诊断非常准确，手术和术后康复都很成功，现在已经可以恢复训练了。',
              time: '2023-12-05'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
              name: '患者14',
              rating: 4,
              content: '医生的专业素养很高，对运动损伤有独到见解，给出的康复建议非常有针对性。',
              time: '2023-11-12'
            },
            {
              avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
              name: '患者15',
              rating: 5,
              content: '作为一名业余马拉松跑者，陈医生不仅治好了我的跑步膝，还给了我很多科学训练的建议，非常感谢！',
              time: '2023-10-20'
            }
          ]
        }
      }
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

      // 使用测试数据代替网络请求
      setTimeout(() => {
        uni.hideLoading();

        if (this.testDoctors[this.doctorId]) {
          this.doctorInfo = this.testDoctors[this.doctorId];
          this.checkFavoriteStatus();
        } else {
          uni.showToast({
            title: '未找到医生信息',
            icon: 'none'
          });
        }
      }, 500); // 模拟网络延迟
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
        url: '/packageMedical/pages/appointment/appointment?doctorId=' + this.doctorId
      });
    },

    startConsultation() {
      uni.navigateTo({
        url: '/packageMedical/pages/chat/consultation-chat?doctorId=' + this.doctorId
      });
    },

    viewAllReviews() {
      uni.navigateTo({
        url: '/packageMedical/pages/doctor-detail/reviews/doctor-reviews?doctorId=' + this.doctorId
      });
    }
  }
}

</script>

<style lang="scss">
.doctor-detail-container {
  min-height: 100vh;
  background-color: #f8f8f8;

  .content-wrapper {
    padding: 20rpx;
    padding-bottom: 120rpx;
  }

        .review-rating {
          display: flex;
        }
  .doctor-card {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .doctor-header {
      display: flex;
      align-items: center;
      position: relative;

      .doctor-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }

      .doctor-info {
        flex: 1;

        .doctor-name-title {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;

          .doctor-name {
            font-size: 34rpx;
            font-weight: bold;
            color: #333333;
            margin-right: 16rpx;
          }

          .doctor-title {
            font-size: 24rpx;
            color: #666666;
          }
        }

        .doctor-hospital,
        .doctor-department {
          font-size: 26rpx;
          color: #666666;
          margin-bottom: 6rpx;
        }
      }

      .doctor-status {
        position: absolute;
        right: 0;
        top: 0;

        .status-text {
          font-size: 24rpx;
          color: #19be6b;
          background-color: rgba(25, 190, 107, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
        }
      }
    }

    .doctor-rating {
      display: flex;
      align-items: center;
      margin: 20rpx 0;

      .rating-stars {
        display: flex;
        margin-right: 10rpx;
      }

      .rating-value {
        font-size: 28rpx;
        color: #ff9900;
        margin-right: 10rpx;
      }

      .rating-count {
        font-size: 24rpx;
        color: #999999;
      }
    }

    .doctor-tags {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20rpx;

      .tag-item {
        font-size: 24rpx;
        color: #2979ff;
        background-color: rgba(41, 121, 255, 0.1);
        padding: 6rpx 16rpx;
        border-radius: 30rpx;
        margin-right: 16rpx;
        margin-bottom: 10rpx;
      }
    }

    .doctor-statistics {
      display: flex;
      justify-content: space-around;
      padding: 20rpx 0;
      border-top: 1px solid #f5f5f5;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 20rpx;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .stat-value {
          font-size: 32rpx;
          color: #333333;
          font-weight: bold;
          margin-bottom: 6rpx;
        }

        .stat-label {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }

    .doctor-price {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 26rpx;
      color: #666666;

      .price-value {
        font-size: 32rpx;
        color: #ff9900;
        font-weight: bold;
        margin-left: 10rpx;
      }
    }
  }

  .info-card {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .card-title {
      position: relative;
      padding-left: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      text {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8rpx;
        width: 6rpx;
        height: 30rpx;
        background-color: #2979ff;
        border-radius: 3rpx;
      }

      .view-all {
        font-size: 26rpx;
        color: #2979ff;
        font-weight: normal;
      }
    }

    .card-content {
      &.bio-content {
        font-size: 28rpx;
        color: #666666;
        line-height: 1.8;
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;

        .skill-item {
          font-size: 26rpx;
          color: #666666;
          background-color: #f5f5f5;
          padding: 10rpx 20rpx;
          border-radius: 6rpx;
          margin-right: 16rpx;
          margin-bottom: 16rpx;
        }
      }

      .schedule-list {
        .schedule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 0;
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }

          .day {
            font-size: 28rpx;
            color: #333333;
            font-weight: bold;
            width: 160rpx;
          }

          .time {
            flex: 1;
            font-size: 26rpx;
            color: #666666;
          }

          .status {
            font-size: 24rpx;
            color: #999999;

            &.available {
              color: #19be6b;
            }
          }
        }
      }

      .review-list {
        .review-item {
          padding: 20rpx 0;
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }

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
                margin-right: 10rpx;
              }

              .reviewer-name {
                font-size: 26rpx;
                color: #333333;
              }
            }
          }

          .review-content {
            font-size: 26rpx;
            color: #666666;
            line-height: 1.6;
            margin-bottom: 10rpx;
          }

          .review-time {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }

      .empty-reviews {
        padding: 30rpx 0;
        text-align: center;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }

  .footer-action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    padding: 20rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;

    .action-buttons {
      display: flex;

      .action-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 40rpx;

        text {
          font-size: 24rpx;
          color: #999999;
          margin-top: 6rpx;
        }
      }
    }

    .main-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;

      .button-wrapper {
        flex: 1;
        padding: 0 5px;
      }

      .u-button {
        margin-left: 20rpx;
        min-width: 180rpx;
      }
    }
  }
}
</style>
