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
            <view 
              class="tab-item" 
              v-for="(tab, index) in specialtyTabs" 
              :key="index"
              :class="{ active: currentSpecialty === tab.value }"
              @click="switchSpecialty(tab.value)"
            >
              {{ tab.name }}
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 筛选条件 -->
      <view class="filter-options">
        <view class="filter-item" @click="showSortPopup = true">
          <text>{{ sortOptions[currentSort] ? sortOptions[currentSort].text : '综合排序' }}</text>xt>
          <u-icon name="arrow-down" size="24" color="#666"></u-icon>
        </view>
        <view class="filter-item" @click="showLevelPopup = true">
          <text>{{ currentLevel && levelOptions.find(item => item.value === currentLevel) ? levelOptions.find(item => item.value === currentLevel).text : '医生级别' }}</text>
          <u-icon name="arrow-down" size="24" color="#666"></u-icon>
        </view>
      </view>
      
      <!-- 医生列表 -->
      <view class="doctor-list">
        <view class="doctor-item" v-for="(doctor, index) in filteredDoctorList" :key="index" @click="viewDoctorDetail(doctor.id)">or.id)">
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
              <text class="specialty-tag" v-for="(specialty, sIndex) in doctor.specialties" :key="sIndex">{{ specialty }}</text>
            </view>
            
            <view class="doctor-hospital">{{ doctor.hospital }}</view>
            
            <view class="doctor-stats">
              <text class="stats-item">咨询量：{{ doctor.consultCount }}</text>
              <text class="stats-item">好评率：{{ doctor.goodRatePercent }}%</text>
            </view>
          </view>
          
          <view class="doctor-action">
            <text class="consultation-price">¥{{ doctor.price }}/次</text>
            <u-button type="primary" size="mini" @click.stop="startConsultation(doctor.id)">咨询</u-button>
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
          <view 
            class="popup-item" 
            v-for="(option, index) in sortOptions" 
            :key="index"
            :class="{ active: currentSort === option.value }"
            @click="selectSort(option.value)"
          >
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
          <view 
            class="popup-item" 
            v-for="(option, index) in levelOptions" 
            :key="index"
            :class="{ active: currentLevel === option.value }"
            @click="selectLevel(option.value)"
          >
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
      filteredDoctorList: []
    }
  },
  onLoad() {
    this.loadDoctors();
  },
  methods: {
    loadDoctors() {
      uni.showLoading({
        title: '加载中...'
      });
      
      uni.request({
        url: '/api/medical/doctors',
        method: 'GET',
        data: {
          specialty: this.currentSpecialty === 'all' ? '' : this.currentSpecialty,
          keyword: this.searchKeyword,
          sort: this.currentSort,
          level: this.currentLevel
        },
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.doctorList = res.data.data;
            this.filteredDoctorList = this.doctorList;
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
        url: './doctor-detail/doctor-detail?id=' + doctorId
      });
    },
    startConsultation(doctorId) {
      uni.navigateTo({
        url: './chat/consultation-chat?doctorId=' + doctorId
      });
    }
  }
}
</script>

<style>
@import './consultation.scss';
</style>
