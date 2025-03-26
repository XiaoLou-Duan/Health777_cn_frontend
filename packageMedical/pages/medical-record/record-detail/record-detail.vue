<template>
  <view class="record-detail-container">
    <u-navbar title="病历详情" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 基本信息卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="header-title">基本信息</text>
          <view class="record-tag" :class="recordInfo.type">{{ getTypeText(recordInfo.type) }}</view>
        </view>
        
        <view class="info-row">
          <text class="info-label">就诊医院：</text>
          <text class="info-value">{{ recordInfo.hospitalName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊科室：</text>
          <text class="info-value">{{ recordInfo.department }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">接诊医生：</text>
          <text class="info-value">{{ recordInfo.doctorName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊时间：</text>
          <text class="info-value">{{ formatDate(recordInfo.visitTime) }}</text>
        </view>
      </view>
      
      <!-- 主诉与症状 -->
      <view class="info-card">
        <view class="card-header">
          <text class="header-title">主诉与症状</text>
        </view>
        
        <view class="content-text">
          {{ recordInfo.symptoms || '暂无记录' }}
        </view>
      </view>
      
      <!-- 诊断结果 -->
      <view class="info-card">
        <view class="card-header">
          <text class="header-title">诊断结果</text>
        </view>
        
        <view class="content-text diagnosis">
          {{ recordInfo.diagnosis || '暂无诊断' }}
        </view>
      </view>
      
      <!-- 处方信息 -->
      <view class="info-card" v-if="recordInfo.hasPrescription">
        <view class="card-header">
          <text class="header-title">处方信息</text>
          <view class="view-detail" @click="viewPrescription">查看详情</view>
        </view>
        
        <view class="prescription-list" v-if="recordInfo.prescription && recordInfo.prescription.length > 0">
          <view class="prescription-item" v-for="(item, index) in recordInfo.prescription" :key="index">
            <view class="medicine-info">
              <text class="medicine-name">{{ item.name }}</text>
              <text class="medicine-spec">{{ item.specification }}</text>
            </view>
            <view class="medicine-usage">
              <text>{{ item.usage }}</text>
            </view>
          </view>
        </view>
        <view class="no-prescription" v-else>
          <text>暂无处方详情</text>
        </view>
      </view>
      
      <!-- 医嘱与注意事项 -->
      <view class="info-card">
        <view class="card-header">
          <text class="header-title">医嘱与注意事项</text>
        </view>
        
        <view class="content-text">
          {{ recordInfo.advice || '暂无医嘱记录' }}
        </view>
      </view>
      
      <!-- 检查报告 -->
      <view class="info-card" v-if="recordInfo.examinations && recordInfo.examinations.length > 0">
        <view class="card-header">
          <text class="header-title">检查报告</text>
        </view>
        
        <view class="exam-list">
          <view 
            class="exam-item" 
            v-for="(exam, index) in recordInfo.examinations" 
            :key="index"
            @click="viewExamReport(exam)"
          >
            <view class="exam-info">
              <text class="exam-name">{{ exam.name }}</text>
              <text class="exam-time">{{ formatDate(exam.time) }}</text>
            </view>
            <u-icon name="arrow-right" size="24" color="#c0c4cc"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 底部操作栏 -->
      <view class="footer-actions">
        <view class="action-item" @click="printRecord">
          <u-icon name="printer" size="32" color="#666666"></u-icon>
          <text>打印</text>
        </view>
        <view class="action-item" @click="shareRecord">
          <u-icon name="share" size="32" color="#666666"></u-icon>
          <text>分享</text>
        </view>
        <view class="action-item" @click="askDoctor">
          <u-icon name="chat" size="32" color="#666666"></u-icon>
          <text>咨询医生</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordId: '',
      recordInfo: {
        id: '',
        hospitalName: '',
        department: '',
        doctorName: '',
        visitTime: 0,
        type: '',
        symptoms: '',
        diagnosis: '',
        advice: '',
        hasPrescription: false,
        prescription: [],
        examinations: []
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.recordId = options.id;
      this.loadRecordDetail();
    }
  },
  methods: {
    // 加载病历详情
    loadRecordDetail() {
      uni.showLoading({
        title: '加载中'
      });
      
      uni.request({
        url: '/api/medical/records/' + this.recordId,
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            this.recordInfo = res.data.data;
          } else {
            uni.showToast({
              title: res.data.message || '获取病历详情失败',
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
        },
        complete: () => {
          // 如果没有数据，添加模拟数据
          if (!this.recordInfo.id) {
            this.addMockData();
          }
        }
      });
    },
    
    // 添加模拟数据
    addMockData() {
      const mockData = {
        id: this.recordId,
        hospitalName: '协和医院',
        department: '内科',
        doctorName: '张医生',
        visitTime: Date.now() - 86400000 * 2, // 2天前
        type: 'offline',
        symptoms: '发热三天，体温最高38.5℃，伴有咳嗽、咽痛、鼻塞、全身酸痛等症状。无明显畏寒，无胸闷、呼吸困难。',
        diagnosis: '上呼吸道感染',
        advice: '1. 多休息，多喝水，避免剧烈运动。\n2. 保持室内空气流通，避免去人群密集场所。\n3. 如体温超过38.5℃可服用退烧药。\n4. 如症状加重请及时就医。',
        hasPrescription: true,
        prescription: [
          {
            name: '连花清瘟胶囊',
            specification: '0.35g*36粒/盒',
            usage: '口服，一次4粒，一日3次'
          },
          {
            name: '布洛芬缓释胶囊',
            specification: '0.3g*10粒/盒',
            usage: '口服，一次1粒，必要时服用，间隔4-6小时'
          },
          {
            name: '银黄颗粒',
            specification: '4g*10袋/盒',
            usage: '口服，一次1袋，一日3次'
          }
        ],
        examinations: [
          {
            id: 'e001',
            name: '血常规检查',
            time: Date.now() - 86400000 * 2,
            report: '白细胞计数略高，以中性粒细胞为主，符合细菌感染表现。'
          },
          {
            id: 'e002',
            name: '胸部X光检查',
            time: Date.now() - 86400000 * 2,
            report: '未见明显异常。'
          }
        ]
      };
      
      this.recordInfo = mockData;
    },
    
    // 查看处方详情
    viewPrescription() {
      uni.navigateTo({
        url: '../prescription/prescription?recordId=' + this.recordId
      });
    },
    
    // 查看检查报告
    viewExamReport(exam) {
      uni.navigateTo({
        url: '../examination/examination-detail?id=' + exam.id
      });
    },
    
    // 打印病历
    printRecord() {
      uni.showLoading({
        title: '准备打印'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '已发送至打印机',
          icon: 'success'
        });
      }, 1500);
    },
    
    // 分享病历
    shareRecord() {
      uni.showActionSheet({
        itemList: ['分享给医生', '导出PDF', '分享给亲友'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.shareToDoctor();
              break;
            case 1:
              this.exportPDF();
              break;
            case 2:
              this.shareToFamily();
              break;
          }
        }
      });
    },
    
    // 分享给医生
    shareToDoctor() {
      uni.navigateTo({
        url: '../../doctor-list/doctor-list?mode=share&recordId=' + this.recordId
      });
    },
    
    // 导出PDF
    exportPDF() {
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
    shareToFamily() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: `${this.recordInfo.hospitalName} - ${this.recordInfo.department}就诊记录`,
        summary: `诊断结果：${this.recordInfo.diagnosis}`,
        success: (res) => {
          console.log('分享成功');
        },
        fail: (err) => {
          console.log('分享失败', err);
        }
      });
    },
    
    // 咨询医生
    askDoctor() {
      uni.navigateTo({
        url: '../../chat/consultation-chat?doctorId=' + this.recordInfo.doctorId
      });
    },
    
    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
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
@import './record-detail.scss';
</style>
