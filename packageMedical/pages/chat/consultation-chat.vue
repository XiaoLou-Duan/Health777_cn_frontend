<template>
  <view class="chat-container">
    <u-navbar :title="doctorInfo.name || '医患咨询'" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 聊天消息列表 -->
      <scroll-view 
        scroll-y 
        class="chat-messages"
        :scroll-into-view="scrollIntoView"
        :scroll-with-animation="true"
        @scrolltoupper="loadMoreMessages"
        upper-threshold="50"
      >
        <!-- 加载更多指示器 -->
        <view class="loading-more" v-if="isLoadingMore">
          <u-loading-icon mode="circle" size="24"></u-loading-icon>
          <text>加载更多消息...</text>
        </view>
        
        <!-- 消息列表 -->
        <view 
          class="message-wrapper" 
          v-for="(message, index) in messageList" 
          :key="message.id"
          :id="'msg-' + message.id"
        >
          <!-- 时间分割线 -->
          <view class="time-divider" v-if="showTimeDivider(index)">
            <text>{{ formatChatTime(message.time) }}</text>
          </view>
          
          <!-- 消息气泡 -->
          <view class="message-item" :class="{ 'message-self': message.isSelf }">
            <!-- 头像 -->
            <image 
              class="avatar" 
              :src="message.isSelf ? userAvatar : doctorInfo.avatar" 
              mode="aspectFill"
            ></image>
            
            <!-- 消息内容 -->
            <view class="message-content">
              <!-- 文本消息 -->
              <view class="message-text" v-if="message.type === 'text'">
                <text>{{ message.content }}</text>
              </view>
              
              <!-- 图片消息 -->
              <view class="message-image" v-else-if="message.type === 'image'">
                <image 
                  :src="message.content" 
                  mode="widthFix" 
                  @tap="previewImage(message.content)"
                ></image>
              </view>
              
              <!-- 语音消息 -->
              <view 
                class="message-voice" 
                v-else-if="message.type === 'voice'"
                @tap="playVoice(message)"
                :class="{ 'playing': currentPlayingId === message.id }"
              >
                <u-icon name="mic" size="24" :color="message.isSelf ? '#ffffff' : '#333333'"></u-icon>
                <text>{{ message.duration }}''</text>
                <view class="voice-waves">
                  <view class="wave" v-for="i in 3" :key="i"></view>
                </view>
              </view>
            </view>
            
            <!-- 消息状态 -->
            <view class="message-status" v-if="message.isSelf">
              <u-icon name="checkmark-circle" size="18" color="#19be6b" v-if="message.status === 'sent'"></u-icon>
              <u-icon name="error-circle" size="18" color="#fa3534" v-if="message.status === 'failed'"></u-icon>
              <u-loading-icon mode="circle" size="18" v-if="message.status === 'sending'"></u-loading-icon>
            </view>
          </view>
        </view>
        
        <!-- 底部占位 -->
        <view class="bottom-space"></view>
      </scroll-view>
      
      <!-- 输入区域 -->
      <view class="input-area">
        <view class="input-tools">
          <view class="tool-item" @tap="toggleRecording">
            <u-icon :name="isRecording ? 'keyboard' : 'mic'" size="32" color="#666666"></u-icon>
          </view>
        </view>
        
        <view class="input-main">
          <!-- 文本输入框 -->
          <view class="text-input" v-if="!isRecording">
            <u-input 
              v-model="messageText" 
              type="text" 
              placeholder="请输入消息..." 
              :border="false"
              confirmType="send"
              @confirm="sendTextMessage"
            ></u-input>
          </view>
          
          <!-- 语音录制按钮 -->
          <view class="voice-record" v-else>
            <view 
              class="record-button" 
              @touchstart="startRecord" 
              @touchend="stopRecord"
              @touchcancel="cancelRecord"
            >
              <text>{{ recordTip }}</text>
            </view>
          </view>
        </view>
        
        <view class="input-actions">
          <view class="action-item" @tap="openMore">
            <u-icon name="plus-circle" size="32" color="#666666"></u-icon>
          </view>
          <view class="action-item send-button" v-if="messageText.trim().length > 0" @tap="sendTextMessage">
            <u-icon name="arrow-right-circle" size="32" color="#2979ff"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 更多操作面板 -->
      <view class="more-panel" v-if="showMorePanel">
        <view class="panel-item" @tap="chooseImage">
          <view class="panel-icon">
            <u-icon name="photo" size="36" color="#2979ff"></u-icon>
          </view>
          <text>相册</text>
        </view>
        <view class="panel-item" @tap="takePhoto">
          <view class="panel-icon">
            <u-icon name="camera" size="36" color="#19be6b"></u-icon>
          </view>
          <text>拍摄</text>
        </view>
        <view class="panel-item" @tap="consultInfo">
          <view class="panel-icon">
            <u-icon name="file-text" size="36" color="#ff9900"></u-icon>
          </view>
          <text>病情资料</text>
        </view>
        <view class="panel-item" @tap="endConsultation">
          <view class="panel-icon">
            <u-icon name="close-circle" size="36" color="#fa3534"></u-icon>
          </view>
          <text>结束咨询</text>
        </view>
      </view>
      
      <!-- 遮罩层 -->
      <view class="mask" v-if="showMorePanel" @tap="closeMore"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      doctorId: '',
      doctorInfo: {},
      userAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      messageList: [],
      scrollIntoView: '',
      isLoadingMore: false,
      hasMore: true,
      pageNum: 1,
      pageSize: 20,
      lastMessageTime: 0,

      // 输入相关
      messageText: '',
      isRecording: false,
      recordTip: '按住说话',
      recordStartTime: 0,
      showMorePanel: false,

      // 语音播放相关
      currentPlayingId: '',
      audioContext: null,

      // 测试数据
      testDoctors: {
        '1001': {
          id: '1001',
          name: '张医生',
          title: '主任医师',
          hospital: '北京协和医院',
          department: '骨科',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          isOnline: true
        },
        '1002': {
          id: '1002',
          name: '李医生',
          title: '副主任医师',
          hospital: '上海市第一人民医院',
          department: '康复科',
          avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
          isOnline: false
        },
        '1003': {
          id: '1003',
          name: '王医生',
          title: '主治医师',
          hospital: '广州市第一人民医院',
          department: '营养科',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          isOnline: true
        },
        '1004': {
          id: '1004',
          name: '刘医生',
          title: '主任医师',
          hospital: '四川大学华西医院',
          department: '内科',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          isOnline: false
        },
        '1005': {
          id: '1005',
          name: '陈医生',
          title: '副主任医师',
          hospital: '浙江大学医学院附属第一医院',
          department: '运动医学科',
          avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
          isOnline: true
        }
      },

      // 医生的默认回复
      doctorReplies: {
        '1001': [
          '您好，我是骨科张医生，请问您有什么骨科方面的问题需要咨询？',
          '您的骨科问题具体是什么情况？能详细描述一下症状吗？',
          '根据您的描述，可能是韧带拉伤，建议您先冰敷，抬高患处，并减少活动。',
          '如果疼痛持续超过3天，或者出现明显肿胀和瘀斑，建议您及时来医院做进一步检查。',
          '需要拍个X光片看看骨头有没有问题，如果只是软组织损伤，一般休息2-3周就能恢复。'
        ],
        '1002': [
          '您好，我是李医生，专注于康复医学领域，请问您需要什么康复指导？',
          '您的康复进展如何？请描述一下您目前的感受和困难。',
          '康复是个需要耐心的过程，建议您按照我之前提供的训练计划，每天坚持做康复训练。',
          '肌肉酸痛是正常现象，但如果出现剧烈疼痛，请立即停止训练并联系我。',
          '可以尝试热敷加按摩来缓解肌肉紧张，每天坚持15-20分钟。'
        ],
        '1003': [
          '您好，我是营养科王医生，请问您有什么饮食或营养方面的问题？',
          '您的饮食情况如何？能否详细介绍一下您平时的饮食习惯？',
          '建议增加蛋白质摄入，每天保证摄入足够的新鲜蔬果，减少精制碳水化合物。',
          '运动后30分钟内补充适量蛋白质和碳水，可以帮助肌肉恢复和生长。',
          '根据您的情况，我可以为您定制一份详细的营养计划，帮助您达到健康目标。'
        ],
        '1004': [
          '您好，我是内分泌科刘医生，请问您有什么内分泌方面的问题需要咨询？',
          '您的血糖、血脂、甲状腺等指标最近检查过吗？有检查报告可以提供吗？',
          '根据您提供的症状，建议您尽快进行空腹血糖和糖化血红蛋白的检查。',
          '如果是甲状腺问题，需要检查TSH、FT3、FT4等指标，并进行甲状腺彩超。',
          '这些症状可能与内分泌失调有关，建议您来院做个全面检查，明确诊断后再制定治疗方案。'
        ],
        '1005': [
          '您好，我是运动医学科陈医生，请问您有什么运动相关的问题需要咨询？',
          '您平时参加什么运动？运动强度和频率是怎样的？',
          '根据您的情况，建议调整训练计划，先减少高强度训练，增加柔韧性练习。',
          '运动损伤需要科学恢复，盲目坚持可能会加重伤势，建议您先休息一周。',
          '可以考虑结合物理治疗和适当的运动康复训练，加速损伤恢复。'
        ]
      }
    }
  },

  onLoad(options) {
    if (options.doctorId) {
      this.doctorId = options.doctorId;
      this.loadDoctorInfo();
      this.loadMessages();
    }

    // 获取用户头像
    uni.getStorage({
      key: 'userInfo',
      success: (res) => {
        if (res.data && res.data.avatar) {
          this.userAvatar = res.data.avatar;
        }
      }
    });

    // 初始化音频播放器
    this.audioContext = uni.createInnerAudioContext();
    this.audioContext.onEnded(() => {
      this.currentPlayingId = '';
    });
    this.audioContext.onError((res) => {
      console.error('播放语音失败：', res.errMsg);
      uni.showToast({
        title: '播放失败',
        icon: 'none'
      });
      this.currentPlayingId = '';
    });
  },

  onUnload() {
    // 释放音频资源
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  },

  methods: {
    // 加载医生信息
    loadDoctorInfo() {
      // 使用测试数据替代网络请求
      if (this.testDoctors[this.doctorId]) {
        this.doctorInfo = this.testDoctors[this.doctorId];
      } else {
        uni.showToast({
          title: '未找到医生信息',
          icon: 'none'
        });
      }
    },

    // 加载消息记录
    loadMessages() {
      this.isLoadingMore = true;

      // 使用模拟数据代替网络请求
      setTimeout(() => {
        let messages = [];

        // 首次加载，添加欢迎消息
        if (this.pageNum === 1) {
          const welcomeMessage = {
            id: `welcome-${this.doctorId}`,
            type: 'text',
            content: this.doctorReplies[this.doctorId][0],
            time: Date.now() - 3600000, // 1小时前
            isSelf: false,
            status: 'sent'
          };

          messages.push(welcomeMessage);

          // 如果是第一页，不需要更多历史消息
          this.hasMore = false;
        } else {
          // 对于加载更多的情况，可以添加一些历史消息
          const baseTime = Date.now() - (this.pageNum * 86400000); // 每页往前推一天

          // 生成5条模拟历史消息
          for (let i = 0; i < 5; i++) {
            const isSelf = i % 2 === 0;
            const time = baseTime + (i * 600000); // 每条消息间隔10分钟
            const historyMessage = {
              id: `history-${this.pageNum}-${i}`,
              type: 'text',
              content: isSelf
                ? `这是第${this.pageNum}页的历史消息${i + 1}`
                : this.doctorReplies[this.doctorId][i % this.doctorReplies[this.doctorId].length],
              time: time,
              isSelf: isSelf,
              status: 'sent'
            };

            messages.push(historyMessage);
          }

          // 模拟没有更多数据了
          if (this.pageNum >= 3) {
            this.hasMore = false;
          }
        }

        if (this.pageNum === 1) {
          this.messageList = messages;

          // 滚动到最新消息
          this.$nextTick(() => {
            if (messages.length > 0) {
              this.scrollIntoView = 'msg-' + messages[messages.length - 1].id;
            }
          });
        } else {
          this.messageList = [...messages, ...this.messageList];
        }

        if (messages.length > 0) {
          this.lastMessageTime = messages[0].time;
        }

        this.isLoadingMore = false;
      }, 1000); // 模拟网络请求延迟
    },

    // 加载更多消息
    loadMoreMessages() {
      if (!this.hasMore || this.isLoadingMore) return;

      this.isLoadingMore = true;
      this.pageNum++;
      this.loadMessages();
    },

    // 显示时间分割线
    showTimeDivider(index) {
      if (index === 0) return true;

      const currentMsg = this.messageList[index];
      const prevMsg = this.messageList[index - 1];

      // 如果两条消息相隔5分钟以上，显示时间分割线
      return currentMsg.time - prevMsg.time > 5 * 60 * 0;
    },

    // 格式化聊天时间
    formatChatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();

      // 是否是今天
      const isToday = date.toDateString() === now.toDateString();

      // 是否是昨天
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      if (isToday) {
        return `今天 ${timeStr}`;
      } else if (isYesterday) {
        return `昨天 ${timeStr}`;
      } else {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day} ${timeStr}`;
      }
    },

    // 切换录音模式
    toggleRecording() {
      this.isRecording = !this.isRecording;
      this.showMorePanel = false;
    },

    // 开始录音
    startRecord() {
      this.recordTip = '松开发送';
      this.recordStartTime = Date.now();

      uni.startRecord({
        success: (res) => {
          console.log('开始录音');
        },
        fail: (err) => {
          console.error('开始录音失败：', err);
          uni.showToast({
            title: '录音失败',
            icon: 'none'
          });
        }
      });
    },

    // 停止录音并发送
    stopRecord() {
      this.recordTip = '按住说话';

      if (Date.now() - this.recordStartTime < 1000) {
        uni.showToast({
          title: '说话时间太短',
          icon: 'none'
        });

        uni.stopRecord();
        return;
      }

      uni.stopRecord({
        success: (res) => {
          const duration = Math.ceil((Date.now() - this.recordStartTime) / 1000);
          this.sendVoiceMessage(res.tempFilePath, duration);
        },
        fail: (err) => {
          console.error('停止录音失败：', err);
          uni.showToast({
            title: '录音失败',
            icon: 'none'
          });
        }
      });
    },

    // 取消录音
    cancelRecord() {
      this.recordTip = '按住说话';
      uni.stopRecord();
    },

    // 打开更多面板
    openMore() {
      this.showMorePanel = true;
    },

    // 关闭更多面板
    closeMore() {
      this.showMorePanel = false;
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.sendImageMessage(res.tempFilePaths[0]);
          this.closeMore();
        }
      });
    },

    // 拍摄照片
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.sendImageMessage(res.tempFilePaths[0]);
          this.closeMore();
        }
      });
    },

    // 病情资料
    consultInfo() {
      uni.navigateTo({
        url: '/packageMedical/pages/medical-record/medical-record?doctorId=' + this.doctorId
      });
      this.closeMore();
    },

    // 结束咨询
    endConsultation() {
      uni.showModal({
        title: '提示',
        content: '确定要结束本次咨询吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟请求成功
            setTimeout(() => {
              uni.showToast({
                title: '咨询已结束',
                icon: 'success'
              });

              // 返回上一页
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }, 500);
          }
          this.closeMore();
        }
      });
    },

    // 发送文本消息
    sendTextMessage() {
      if (!this.messageText.trim()) return;

      const messageId = 'temp-' + Date.now();
      const newMessage = {
        id: messageId,
        type: 'text',
        content: this.messageText,
        time: Date.now(),
        isSelf: true,
        status: 'sending'
      };

      this.messageList.push(newMessage);
      this.scrollToBottom();

      const text = this.messageText;
      this.messageText = '';

      // 模拟发送消息
      setTimeout(() => {
        // 更新消息状态为已发送
        const index = this.messageList.findIndex(item => item.id === messageId);
        if (index !== -1) {
          this.messageList[index].id = 'msg-' + Date.now();
          this.messageList[index].status = 'sent';
        }

        // 模拟医生回复
        this.simulateDoctorReply();
      }, 500);
    },

    // 发送图片消息
    sendImageMessage(filePath) {
      const messageId = 'temp-' + Date.now();
      const newMessage = {
        id: messageId,
        type: 'image',
        content: filePath,
        time: Date.now(),
        isSelf: true,
        status: 'sending'
      };

      this.messageList.push(newMessage);
      this.scrollToBottom();

      // 模拟上传图片
      setTimeout(() => {
        // 更新消息状态为已发送
        const index = this.messageList.findIndex(item => item.id === messageId);
        if (index !== -1) {
          this.messageList[index].id = 'img-' + Date.now();
          this.messageList[index].status = 'sent';
        }

        // 模拟医生回复
        this.simulateDoctorReply();
      }, 1000);
    },

    // 发送语音消息
    sendVoiceMessage(filePath, duration) {
      const messageId = 'temp-' + Date.now();
      const newMessage = {
        id: messageId,
        type: 'voice',
        content: filePath,
        duration: duration,
        time: Date.now(),
        isSelf: true,
        status: 'sending'
      };

      this.messageList.push(newMessage);
      this.scrollToBottom();

      // 模拟上传语音
      setTimeout(() => {
        // 更新消息状态为已发送
        const index = this.messageList.findIndex(item => item.id === messageId);
        if (index !== -1) {
          this.messageList[index].id = 'voice-' + Date.now();
          this.messageList[index].status = 'sent';
        }

        // 模拟医生回复
        this.simulateDoctorReply();
      }, 1000);
    },

    // 播放语音消息
    playVoice(message) {
      // 如果正在播放，先停止
      if (this.currentPlayingId) {
        this.audioContext.stop();

        // 如果点击的是当前正在播放的消息，则停止播放并返回
        if (this.currentPlayingId === message.id) {
          this.currentPlayingId = '';
          return;
        }
      }

      // 播放新的语音
      this.currentPlayingId = message.id;
      this.audioContext.src = message.content;
      this.audioContext.play();
    },

    // 预览图片
    previewImage(url) {
      const imageUrls = this.messageList
        .filter(msg => msg.type === 'image')
        .map(msg => msg.content);

      uni.previewImage({
        current: url,
        urls: imageUrls
      });
    },

    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.messageList.length > 0) {
          this.scrollIntoView = 'msg-' + this.messageList[this.messageList.length - 1].id;
        }
      });
    },

    // 模拟医生回复
    simulateDoctorReply() {
      // 模拟医生正在输入的状态
      setTimeout(() => {
        // 获取医生的回复库
        const replies = this.doctorReplies[this.doctorId] || [
          '您好，有什么可以帮助您的吗？',
          '好的，我明白了。请您详细描述一下症状。',
          '根据您的描述，建议您注意休息，多喝水。',
          '这种情况需要进一步检查，建议您到医院进行面诊。',
          '您的情况不是特别严重，请不要太过担心。'
        ];

        // 随机选择一条回复
        const randomIndex = Math.floor(Math.random() * replies.length);
        const randomReply = replies[randomIndex];

        const doctorMessage = {
          id: 'doc-' + Date.now(),
          type: 'text',
          content: randomReply,
          time: Date.now(),
          isSelf: false,
          status: 'sent'
        };

        this.messageList.push(doctorMessage);
        this.scrollToBottom();
      }, 1500);
    }
  }
}

</script>

<style lang="scss">
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;

  .content-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .chat-messages {
    flex: 1;
    padding: 20rpx;

    .loading-more {
      padding: 20rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;

      text {
        font-size: 24rpx;
        color: #999999;
        margin-left: 10rpx;
      }
    }

    .time-divider {
      display: flex;
      justify-content: center;
      margin: 20rpx 0;

      text {
        font-size: 24rpx;
        color: #999999;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 4rpx 16rpx;
        border-radius: 8rpx;
      }
    }

    .message-wrapper {
      margin-bottom: 20rpx;
    }

    .message-item {
      display: flex;
      align-items: flex-start;

      &.message-self {
        flex-direction: row-reverse;

        .avatar {
          margin-left: 20rpx;
          margin-right: 0;
        }

        .message-content {
          .message-text {
            background-color: #2979ff;
            color: #ffffff;
            border-radius: 16rpx 0 16rpx 16rpx;
          }

          .message-voice {
            background-color: #2979ff;
            color: #ffffff;
            border-radius: 16rpx 0 16rpx 16rpx;

            .wave {
              background-color: #ffffff;
            }
          }
        }

        .message-status {
          margin-right: 10rpx;
        }
      }

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }

      .message-content {
        max-width: 60%;

        .message-text {
          background-color: #ffffff;
          padding: 16rpx 24rpx;
          border-radius: 0 16rpx 16rpx 16rpx;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
          word-break: break-all;

          text {
            font-size: 28rpx;
            color: #333333;
            line-height: 1.5;
          }
        }

        .message-image {
          border-radius: 12rpx;
          overflow: hidden;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

          image {
            max-width: 400rpx;
            display: block;
          }
        }

        .message-voice {
          background-color: #ffffff;
          padding: 16rpx 24rpx;
          border-radius: 0 16rpx 16rpx 16rpx;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          min-width: 120rpx;

          text {
            font-size: 26rpx;
            color: #333333;
            margin: 0 16rpx;
          }

          .voice-waves {
            display: flex;
            align-items: center;

            .wave {
              width: 6rpx;
              height: 16rpx;
              background-color: #333333;
              margin: 0 2rpx;
              border-radius: 3rpx;

              &:nth-child(1) {
                height: 20rpx;
              }

              &:nth-child(2) {
                height: 24rpx;
              }

              &:nth-child(3) {
                height: 16rpx;
              }
            }
          }

          &.playing {
            .voice-waves {
              .wave {
                animation: wave-animation 1s infinite ease-in-out;

                &:nth-child(1) {
                  animation-delay: 0s;
                }

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
          }
        }
      }

      .message-status {
        align-self: flex-end;
        margin-left: 10rpx;
      }
    }

    .bottom-space {
      height: 20rpx;
    }
  }

  .input-area {
    background-color: #ffffff;
    border-top: 1px solid #eaeaea;
    padding: 20rpx;
    display: flex;
    align-items: center;

    .input-tools {
      margin-right: 20rpx;

      .tool-item {
        padding: 10rpx;
      }
    }

    .input-main {
      flex: 1;

      .text-input {
        background-color: #f5f5f5;
        border-radius: 8rpx;
        padding: 10rpx 20rpx;
      }

      .voice-record {
        width: 100%;

        .record-button {
          background-color: #f5f5f5;
          border-radius: 8rpx;
          padding: 20rpx 0;
          display: flex;
          justify-content: center;
          align-items: center;

          text {
            font-size: 28rpx;
            color: #666666;
          }
        }
      }
    }

    .input-actions {
      margin-left: 20rpx;
      display: flex;

      .action-item {
        padding: 10rpx;
      }
    }
  }

  .more-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 30rpx 20rpx;
    display: flex;
    flex-wrap: wrap;
    z-index: 10;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
    animation: slide-up 0.3s ease-out;

    .panel-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0;

      .panel-icon {
        width: 100rpx;
        height: 100rpx;
        background-color: #f8f8f8;
        border-radius: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10rpx;
      }

      text {
        font-size: 24rpx;
        color: #666666;
      }
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9;
    animation: fade-in 0.3s ease-out;
  }
}

@keyframes wave-animation {

  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(1.5);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
