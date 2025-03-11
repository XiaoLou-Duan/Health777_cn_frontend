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
          <u-loading mode="circle" size="24"></u-loading>
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
              <u-loading mode="circle" size="18" v-if="message.status === 'sending'"></u-loading>
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
      userAvatar: '/static/images/default-avatar.png',
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
      audioContext: null
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
      uni.request({
        url: '/api/medical/doctors/' + this.doctorId,
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            this.doctorInfo = res.data.data;
          }
        }
      });
    },
    
    // 加载消息记录
    loadMessages() {
      uni.request({
        url: '/api/medical/messages',
        method: 'GET',
        data: {
          doctorId: this.doctorId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: (res) => {
          if (res.data.code === 0) {
            const messages = res.data.data.list;
            
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
            
            this.hasMore = messages.length >= this.pageSize;
            
            if (messages.length > 0) {
              this.lastMessageTime = messages[0].time;
            }
          }
        },
        complete: () => {
          this.isLoadingMore = false;
        }
      });
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
      return currentMsg.time - prevMsg.time > 5 * 60 * 1000;
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
        url: '../medical-record/medical-record?doctorId=' + this.doctorId
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
            uni.request({
              url: '/api/medical/end-consultation',
              method: 'POST',
              data: {
                doctorId: this.doctorId
              },
              success: (res) => {
                if (res.data.code === 0) {
                  uni.showToast({
                    title: '咨询已结束',
                    icon: 'success'
                  });
                  
                  // 返回上一页
                  setTimeout(() => {
                    uni.navigateBack();
                  }, 1500);
                }
              }
            });
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
      
      // 发送消息
      uni.request({
        url: '/api/medical/send-message',
        method: 'POST',
        data: {
          doctorId: this.doctorId,
          type: 'text',
          content: text
        },
        success: (res) => {
          if (res.data.code === 0) {
            // 更新消息状态为已发送
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].id = res.data.data.messageId;
              this.messageList[index].status = 'sent';
            }
            
            // 模拟医生回复
            this.simulateDoctorReply();
          } else {
            // 更新消息状态为发送失败
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].status = 'failed';
            }
          }
        },
        fail: () => {
          // 更新消息状态为发送失败
          const index = this.messageList.findIndex(item => item.id === messageId);
          if (index !== -1) {
            this.messageList[index].status = 'failed';
          }
        }
      });
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
      
      // 上传图片
      uni.uploadFile({
        url: '/api/medical/upload-image',
        filePath: filePath,
        name: 'file',
        formData: {
          doctorId: this.doctorId
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            // 更新消息状态为已发送
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].id = data.data.messageId;
              this.messageList[index].content = data.data.imageUrl;
              this.messageList[index].status = 'sent';
            }
            
            // 模拟医生回复
            this.simulateDoctorReply();
          } else {
            // 更新消息状态为发送失败
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].status = 'failed';
            }
          }
        },
        fail: () => {
          // 更新消息状态为发送失败
          const index = this.messageList.findIndex(item => item.id === messageId);
          if (index !== -1) {
            this.messageList[index].status = 'failed';
          }
        }
      });
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
      
      // 上传语音
      uni.uploadFile({
        url: '/api/medical/upload-voice',
        filePath: filePath,
        name: 'file',
        formData: {
          doctorId: this.doctorId,
          duration: duration
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            // 更新消息状态为已发送
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].id = data.data.messageId;
              this.messageList[index].content = data.data.voiceUrl;
              this.messageList[index].status = 'sent';
            }
            
            // 模拟医生回复
            this.simulateDoctorReply();
          } else {
            // 更新消息状态为发送失败
            const index = this.messageList.findIndex(item => item.id === messageId);
            if (index !== -1) {
              this.messageList[index].status = 'failed';
            }
          }
        },
        fail: () => {
          // 更新消息状态为发送失败
          const index = this.messageList.findIndex(item => item.id === messageId);
          if (index !== -1) {
            this.messageList[index].status = 'failed';
          }
        }
      });
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
        // 模拟医生回复
        const replies = [
          '您好，有什么可以帮助您的吗？',
          '好的，我明白了。请您详细描述一下症状。',
          '根据您的描述，建议您注意休息，多喝水。',
          '这种情况需要进一步检查，建议您到医院进行面诊。',
          '您的情况不是特别严重，请不要太过担心。'
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
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

<style>
@import './consultation-chat.scss';
</style>
