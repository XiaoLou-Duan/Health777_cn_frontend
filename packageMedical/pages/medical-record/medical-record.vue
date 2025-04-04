<template>
  <view class="medical-record-container">
    <u-navbar title="我的病历" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 过滤选项 -->
      <view class="filter-bar">
        <view class="filter-item" :class="{ active: activeFilter === 'all' }" @click="changeFilter('all')">
          全部病历
        </view>
        <view class="filter-item" :class="{ active: activeFilter === 'online' }" @click="changeFilter('online')">
          线上问诊
        </view>
        <view class="filter-item" :class="{ active: activeFilter === 'offline' }" @click="changeFilter('offline')">
          门诊记录
        </view>
      </view>

      <!-- 病历列表 -->
      <scroll-view scroll-y class="record-list" @scrolltolower="loadMore" :refresher-enabled="true"
        :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
        <block v-if="recordList.length > 0">
          <view class="record-item" v-for="(record, index) in recordList" :key="index"
            @click="viewRecordDetail(record)">
            <view class="record-header">
              <view class="hospital-name">{{ record.hospitalName }}</view>
              <view class="record-tag" :class="record.type">{{ getTypeText(record.type) }}</view>
            </view>

            <view class="record-main">
              <view class="doctor-info">
                <view class="doctor-name">{{ record.doctorName }}</view>
                <view class="department">{{ record.department }}</view>
              </view>

              <view class="diagnosis-info">
                <view class="diagnosis-label">诊断结果：</view>
                <view class="diagnosis-content">{{ record.diagnosis }}</view>
              </view>
            </view>

            <view class="record-footer">
              <view class="record-time">就诊时间：{{ formatDate(record.visitTime) }}</view>
              <view class="record-actions">
                <view class="action-btn prescription" @click.stop="viewPrescription(record)">
                  <u-icon name="file-text" size="28" color="#2979ff"></u-icon>
                  <text>处方单</text>
                </view>
                <view class="action-btn share" @click.stop="shareRecord(record)">
                  <u-icon name="share" size="28" color="#19be6b"></u-icon>
                  <text>分享</text>
                </view>
              </view>
            </view>
          </view>
        </block>

        <!-- 空状态 -->
        <view class="empty-state" v-if="recordList.length === 0 && !isLoading">
          <image src="/static/images/empty-record.png" mode="aspectFit"></image>
          <text>暂无病历记录</text>
        </view>

        <!-- 加载更多 -->
        <view class="loading-more" v-if="isLoading">
          <u-loading-icon mode="circle" size="24"></u-loading-icon>
          <text>加载中...</text>
        </view>

        <!-- 到底提示 -->
        <view class="list-end" v-if="recordList.length > 0 && !hasMore && !isLoading">
          <text>-- 已经到底了 --</text>
        </view>
      </scroll-view>

      <!-- 将 u-loading 替换为 u-loading-icon -->
      <view class="loading-overlay" v-if="isLoading">
        <u-loading-icon mode="circle" size="36" color="#5FB878"></u-loading-icon>
        <text class="loading-text">正在加载数据...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeFilter: 'all',
      recordList: [],
      pageNum: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      isRefreshing: false
    }
  },
  onLoad() {
    this.loadRecords();
  },
  components: {
    
  },
  methods: {
    // 切换过滤条件
    changeFilter(filter) {
      if (this.activeFilter === filter) return;
      
      this.activeFilter = filter;
      this.recordList = [];
      this.pageNum = 1;
      this.hasMore = true;
      this.loadRecords();
    },
    
    // 加载病历记录
    loadRecords() {
      if (!this.hasMore || this.isLoading) return;
      
      this.isLoading = true;
      
      uni.request({
        url: '/api/medical/records',
        method: 'GET',
        data: {
          type: this.activeFilter === 'all' ? '' : this.activeFilter,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: (res) => {
          if (res.data.code === 0) {
            const { list, total } = res.data.data;
            
            if (this.pageNum === 1) {
              this.recordList = list;
            } else {
              this.recordList = [...this.recordList, ...list];
            }
            
            this.hasMore = this.recordList.length < total;
          } else {
            uni.showToast({
              title: res.data.message || '获取病历失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          this.isLoading = false;
          if (this.isRefreshing) {
            this.isRefreshing = false;
          }
          
          // 为了演示效果，添加模拟数据
          if (this.recordList.length === 0) {
            this.addMockData();
          }
        }
      });
    },
    
    // 添加模拟数据
    addMockData() {
      const mockData = [
        {
          id: '1001',
          hospitalName: '协和医院',
          type: 'offline',
          doctorName: '张医生',
          department: '内科',
          diagnosis: '上呼吸道感染',
          visitTime: Date.now() - 86400000 * 2, // 2天前
          hasPrescription: true
        },
        {
          id: '1002',
          hospitalName: '仁济医院',
          type: 'offline',
          doctorName: '李医生',
          department: '骨科',
          diagnosis: '腰椎间盘突出',
          visitTime: Date.now() - 86400000 * 15, // 15天前
          hasPrescription: true
        },
        {
          id: '1003',
          hospitalName: '在线问诊',
          type: 'online',
          doctorName: '王医生',
          department: '皮肤科',
          diagnosis: '接触性皮炎',
          visitTime: Date.now() - 86400000 * 5, // 5天前
          hasPrescription: true
        },
        {
          id: '1004',
          hospitalName: '在线问诊',
          type: 'online',
          doctorName: '刘医生',
          department: '心理咨询',
          diagnosis: '轻度焦虑',
          visitTime: Date.now() - 86400000 * 1, // 1天前
          hasPrescription: false
        }
      ];
      
      // 根据筛选条件过滤
      let filteredData = mockData;
      if (this.activeFilter !== 'all') {
        filteredData = mockData.filter(item => item.type === this.activeFilter);
      }
      
      this.recordList = filteredData;
      this.hasMore = false;
    },
    
    // 加载更多
    loadMore() {
      if (this.hasMore && !this.isLoading) {
        this.pageNum++;
        this.loadRecords();
      }
    },
    
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      this.pageNum = 1;
      this.recordList = [];
      this.hasMore = true;
      this.loadRecords();
    },
    
    // 查看病历详情
    viewRecordDetail(record) {
      uni.navigateTo({
        url: './record-detail/record-detail?id=' + record.id
      });
    },
    
    // 查看处方单
    viewPrescription(record) {
      if (!record.hasPrescription) {
        uni.showToast({
          title: '暂无处方信息',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: './prescription/prescription?recordId=' + record.id
      });
    },
    
    // 分享病历
    shareRecord(record) {
      uni.showActionSheet({
        itemList: ['分享给医生', '导出PDF', '分享给亲友'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.shareToDoctor(record);
              break;
            case 1:
              this.exportPDF(record);
              break;
            case 2:
              this.shareToFamily(record);
              break;
          }
        }
      });
    },
    
    // 分享给医生
    shareToDoctor(record) {
      uni.navigateTo({
        url: '../doctor-list/doctor-list?mode=share&recordId=' + record.id
      });
    },
    
    // 导出PDF
    exportPDF(record) {
      uni.showLoading({
        title: '正在生成PDF'
      });
      
      // 模拟PDF生成过程
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: 'PDF已保存至相册',
          icon: 'success'
        });
      }, 1500);
    },
    
    // 分享给亲友
    shareToFamily(record) {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: `${record.hospitalName} - ${record.department}就诊记录`,
        summary: `诊断结果：${record.diagnosis}`,
        success: (res) => {
          console.log('分享成功');
        },
        fail: (err) => {
          console.log('分享失败', err);
        }
      });
    },
    
    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },
    
    // 获取类型文本
    getTypeText(type) {
      switch (type) {
        case 'online':
          return '线上问诊';
        case 'offline':
          return '门诊';
        default:
          return '其他';
      }
    }
  }
}
</script>

<style>
@import './medical-record.scss';
</style>
