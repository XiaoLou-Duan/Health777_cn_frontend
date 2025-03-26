<template>
  <view class="consultation-container">
    <u-navbar title="医生咨询" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 搜索栏 -->
      <view class="search-bar">
        <u-search placeholder="搜索医生姓名或专长" v-model="searchKeyword" :showAction="false" @search="onSearch"></u-search>
      </view>

      <!-- 医生分类选项卡 -->
      <view class="doctor-tabs">
        <scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
          <view class="tabs-list">
            <view class="tab-item" v-for="(tab, index) in specialtyTabs" :key="index"
              :class="{ active: currentSpecialty === tab.value }" @click="switchSpecialty(tab.value)">
              {{ tab.name }}
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 筛选条件 -->
      <view class="filter-options">
        <view class="filter-item" @click="showSortPopup = true">
          <text>{{ sortOptions[currentSort] ? sortOptions[currentSort].text : '综合排序' }}</text>
          <u-icon name="arrow-down" size="24" color="#666"></u-icon>
        </view>
        <view class="filter-item" @click="showLevelPopup = true">
          <text>{{currentLevel && levelOptions.find(item => item.value === currentLevel) ? levelOptions.find(item =>
            item.value === currentLevel).text : '医生级别'}}</text>
          <u-icon name="arrow-down" size="24" color="#666"></u-icon>
        </view>
      </view>

      <!-- 医生列表 -->
      <view class="doctor-list">
        <view class="doctor-item" v-for="(doctor, index) in filteredDoctorList" :key="index"
          @click="viewDoctorDetail(doctor.id)">
          <view class="doctor-avatar">
            <image :src="doctor.avatar" mode="aspectFill"></image>
            <view class="doctor-online" v-if="doctor.isOnline"></view>
          </view>

          <view class="doctor-info">
            <view class="doctor-header">
              <view class="doctor-name">
                <text>{{ doctor.name }}</text>
                <text class="doctor-title">{{ doctor.title }}</text>
              </view>
              <view class="doctor-rating">
                <u-icon name="star-fill" size="24" color="#ff9900"></u-icon>
                <text>{{ doctor.rating }}</text>
              </view>
            </view>

            <view class="doctor-specialty">
              <text class="specialty-tag" v-for="(specialty, sIndex) in doctor.specialties" :key="sIndex">{{ specialty
                }}</text>
            </view>

            <view class="doctor-hospital">{{ doctor.hospital }}</view>

            <view class="doctor-stats">
              <text class="stats-item">咨询量：{{ doctor.consultCount }}</text>
              <text class="stats-item">好评率：{{ doctor.goodRatePercent }}%</text>
            </view>
          </view>

          <view class="doctor-action">
            <view class="button-wrapper" @click.stop="startConsultation(doctor.id)">
              <u-button type="primary" size="mini">咨询</u-button>
            </view>
          </view>
        </view>

        <view class="empty-list" v-if="filteredDoctorList.length === 0">
          <u-empty mode="data" text="暂无医生" marginTop="40"></u-empty>
        </view>
      </view>
    </view>

    <!-- 排序弹窗 -->
    <u-popup v-model="showSortPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">排序方式</text>
          <u-icon name="close" color="#999" size="28" @click="showSortPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <view class="popup-item" v-for="(option, index) in sortOptions" :key="index"
            :class="{ active: currentSort === option.value }" @click="selectSort(option.value)">
            <text>{{ option.text }}</text>
            <u-icon name="checkmark" size="24" color="#2979ff" v-if="currentSort === option.value"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 级别筛选弹窗 -->
    <u-popup v-model="showLevelPopup" mode="bottom" border-radius="12">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">医生级别</text>
          <u-icon name="close" color="#999" size="28" @click="showLevelPopup = false"></u-icon>
        </view>
        <view class="popup-content">
          <view class="popup-item" v-for="(option, index) in levelOptions" :key="index"
            :class="{ active: currentLevel === option.value }" @click="selectLevel(option.value)">
            <text>{{ option.text }}</text>
            <u-icon name="checkmark" size="24" color="#2979ff" v-if="currentLevel === option.value"></u-icon>
          </view>
          <view class="popup-item" @click="selectLevel('')">
            <text>全部</text>
            <u-icon name="checkmark" size="24" color="#2979ff" v-if="!currentLevel"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      currentSpecialty: 'all',
      specialtyTabs: [
        { value: 'all', name: '全部' },
        { value: 'nutrition', name: '营养科' },
        { value: 'rehabilitation', name: '康复科' },
        { value: 'orthopedics', name: '骨科' },
        { value: 'internal', name: '内科' },
        { value: 'sports', name: '运动医学' }
      ],
      currentSort: 'rating',
      sortOptions: [
        { value: 'rating', text: '综合排序' },
        { value: 'consultCount', text: '咨询量优先' },
        { value: 'goodRate', text: '好评率优先' },
        { value: 'price-asc', text: '价格从低到高' },
        { value: 'price-desc', text: '价格从高到低' }
      ],
      currentLevel: '',
      levelOptions: [
        { value: 'chief', text: '主任医师' },
        { value: 'associate', text: '副主任医师' },
        { value: 'attending', text: '主治医师' },
        { value: 'resident', text: '住院医师' }
      ],
      showSortPopup: false,
      showLevelPopup: false,
      doctorList: [],
      filteredDoctorList: [],
      // 测试数据
      testDoctors: [
        {
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
          price: 150
        },
        {
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
          price: 120
        },
        {
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
          price: 100
        },
        {
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
          price: 180
        },
        {
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
          price: 130
        }
      ]
    }
  },
  onLoad() {
    // 使用模拟数据而不是加载网络数据
    this.loadDoctors();
  },
  methods: {
    loadDoctors() {
      uni.showLoading({
        title: '加载中...'
      });

      // 使用测试数据代替网络请求
      setTimeout(() => {
        uni.hideLoading();

        let filteredList = [...this.testDoctors];

        // 按照专科筛选
        if (this.currentSpecialty !== 'all') {
          const specialty = this.currentSpecialty;
          filteredList = filteredList.filter(doctor => {
            return doctor.department.includes(this.getSpecialtyName(specialty)) ||
              doctor.specialties.some(s => s.includes(this.getSpecialtyName(specialty)));
          });
        }

        // 按照医生级别筛选
        if (this.currentLevel) {
          const levelText = this.levelOptions.find(item => item.value === this.currentLevel).text;
          filteredList = filteredList.filter(doctor => doctor.title.includes(levelText));
        }

        // 按关键词搜索
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase();
          filteredList = filteredList.filter(doctor =>
            doctor.name.toLowerCase().includes(keyword) ||
            doctor.specialties.some(s => s.toLowerCase().includes(keyword)) ||
            doctor.department.toLowerCase().includes(keyword) ||
            doctor.hospital.toLowerCase().includes(keyword)
          );
        }

        // 排序
        switch (this.currentSort) {
          case 'consultCount':
            filteredList.sort((a, b) => b.consultCount - a.consultCount);
            break;
          case 'goodRate':
            filteredList.sort((a, b) => b.goodRatePercent - a.goodRatePercent);
            break;
          case 'price-asc':
            filteredList.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredList.sort((a, b) => b.price - a.price);
            break;
          default: // rating
            filteredList.sort((a, b) => b.rating - a.rating);
        }

        this.doctorList = filteredList;
        this.filteredDoctorList = filteredList;
      }, 500); // 模拟网络延迟
    },

    // 将值转换为名称
    getSpecialtyName(value) {
      const tab = this.specialtyTabs.find(tab => tab.value === value);
      return tab ? tab.name : '';
    },

    switchSpecialty(specialty) {
      this.currentSpecialty = specialty;
      this.loadDoctors();
    },

    onSearch() {
      this.loadDoctors();
    },

    selectSort(sort) {
      this.currentSort = sort;
      this.showSortPopup = false;
      this.loadDoctors();
    },

    selectLevel(level) {
      this.currentLevel = level;
      this.showLevelPopup = false;
      this.loadDoctors();
    },

    viewDoctorDetail(doctorId) {
      uni.navigateTo({
        url: '../doctor-detail/doctor-detail?id=' + doctorId
      });
    },

    startConsultation(doctorId) {
      uni.navigateTo({
        url: '../chat/consultation-chat?doctorId=' + doctorId
      });
    }
  }
}
</script>

<style lang="scss">
.consultation-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;

  .content-wrapper {
    flex: 1;
    padding-bottom: 20rpx;
  }

  .search-bar {
    padding: 20rpx 30rpx;
    background-color: #ffffff;
  }

  .doctor-tabs {
    background-color: #ffffff;
    padding: 0 20rpx;
    margin-top: 20rpx;

    .tabs-scroll {
      white-space: nowrap;

      .tabs-list {
        display: flex;
        padding: 10rpx 0;

        .tab-item {
          display: inline-block;
          padding: 20rpx 30rpx;
          font-size: 28rpx;
          color: #666;
          position: relative;

          &.active {
            color: #2979ff;
            font-weight: bold;

            &::after {
              content: '';
              position: absolute;
              left: 30rpx;
              right: 30rpx;
              bottom: 10rpx;
              height: 4rpx;
              background-color: #2979ff;
              border-radius: 2rpx;
            }
          }
        }
      }
    }
  }

  .filter-options {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    margin-top: 2rpx;
    border-bottom: 1px solid #f0f0f0;

    .filter-item {
      display: flex;
      align-items: center;
      margin-right: 40rpx;
      font-size: 26rpx;
      color: #666;

      text {
        margin-right: 6rpx;
      }
    }
  }

  .doctor-list {
    padding: 20rpx 30rpx;

    .doctor-item {
      display: flex;
      background-color: #ffffff;
      padding: 30rpx;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

      .doctor-avatar {
        position: relative;
        width: 120rpx;
        height: 120rpx;
        margin-right: 20rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .doctor-online {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 20rpx;
          height: 20rpx;
          background-color: #19be6b;
          border-radius: 50%;
          border: 4rpx solid #ffffff;
        }
      }

      .doctor-info {
        flex: 1;
        overflow: hidden;
        margin-right: 20rpx;

        .doctor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;

          .doctor-name {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;

            .doctor-title {
              font-size: 24rpx;
              color: #666;
              background-color: #f5f7fa;
              padding: 2rpx 10rpx;
              border-radius: 4rpx;
              margin-left: 10rpx;
              font-weight: normal;
            }
          }

          .doctor-rating {
            display: flex;
            align-items: center;
            font-size: 24rpx;
            color: #ff9900;

            text {
              margin-left: 4rpx;
            }
          }
        }

        .doctor-specialty {
          margin-top: 10rpx;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10rpx;

          .specialty-tag {
            font-size: 24rpx;
            color: #2979ff;
            background-color: rgba(41, 121, 255, 0.1);
            padding: 4rpx 16rpx;
            border-radius: 20rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
          }
        }

        .doctor-hospital {
          font-size: 26rpx;
          color: #666;
          margin-top: 6rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 10rpx;
        }

        .doctor-stats {
          display: flex;
          margin-top: 10rpx;
          font-size: 24rpx;
          color: #999;

          .stats-item {
            margin-right: 20rpx;
          }
        }
      }

      .doctor-action {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .button-wrapper {
          width: 100%;
        }
      }
    }

    .empty-list {
      padding: 100rpx 0;
      text-align: center;
    }
  }

  .popup-container {
    padding: 30rpx;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20rpx;
      border-bottom: 1px solid #f0f0f0;

      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .popup-content {
      padding: 20rpx 0;

      .popup-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 10rpx;
        font-size: 28rpx;
        color: #333;
        border-bottom: 1px solid #f0f0f0;

        &.active {
          color: #2979ff;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
