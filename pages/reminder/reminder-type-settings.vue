<template>
  <view class="type-settings-container">
    <u-navbar :title="typeName + '设置'" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 基本设置 -->
      <view class="settings-section">
        <view class="section-title">基本设置</view>
        <u-cell-group>
          <u-cell 
            title="启用此类型提醒" 
            :value="typeEnabled ? '已开启' : '已关闭'"
            @click="toggleTypeEnabled" 
            :arrow="false"
          >
            <u-switch slot="right-icon" v-model="typeEnabled" active-color="#5FB878"></u-switch>
          </u-cell>
          <u-cell 
            title="提醒声音" 
            :value="getSoundName(soundType)"
            @click="showSoundPicker = true" 
            :disabled="!typeEnabled"
          ></u-cell>
          <u-cell 
            title="优先级" 
            :value="getPriorityName(priority)"
            @click="showPriorityPicker = true" 
            :disabled="!typeEnabled"
          ></u-cell>
        </u-cell-group>
      </view>
      
      <!-- 提醒时间设置 -->
      <view class="settings-section">
        <view class="section-title">提醒时间</view>
        <view class="section-desc">设置此类型的提醒时间，可添加多个时间点</view>
        
        <view class="time-list">
          <view class="time-item" v-for="(time, index) in reminderTimes" :key="index">
            <text class="time-text">{{ time }}</text>
            <view class="time-actions">
              <view class="edit-btn" @click="editTime(index)">
                <u-icon name="edit-pen" size="32" color="#5FB878"></u-icon>
              </view>
              <view class="delete-btn" @click="deleteTime(index)">
                <u-icon name="trash" size="32" color="#FA3534"></u-icon>
              </view>
            </view>
          </view>
          
          <view class="add-time-btn" @click="addNewTime">
            <u-icon name="plus-circle" size="40" color="#5FB878"></u-icon>
            <text>添加提醒时间</text>
          </view>
        </view>
      </view>
      
      <!-- 提醒周期设置 -->
      <view class="settings-section">
        <view class="section-title">提醒周期</view>
        <view class="section-desc">选择需要提醒的星期日期</view>
        
        <view class="weekday-selector">
          <view 
            class="weekday-item" 
            v-for="(day, index) in weekdays" 
            :key="index"
            :class="{ active: selectedDays.includes(index + 1) }"
            @click="toggleWeekday(index + 1)"
          >
            {{ day }}
          </view>
        </view>
        
        <view class="quick-select">
          <view class="quick-btn" @click="selectAllDays">全选</view>
          <view class="quick-btn" @click="selectWeekdays">工作日</view>
          <view class="quick-btn" @click="selectWeekends">周末</view>
          <view class="quick-btn" @click="clearDays">清空</view>
        </view>
      </view>
      
      <!-- 自定义提醒文本 -->
      <view class="settings-section">
        <view class="section-title">提醒文本</view>
        <view class="section-desc">自定义提醒时的显示文本</view>
        
        <view class="custom-text">
          <u-form-item
            label="提醒标题"
            :disabled="!typeEnabled"
          >
            <u-input 
              v-model="reminderTitle"
              placeholder="请输入提醒标题"
              :disabled="!typeEnabled"
            />
          </u-form-item>
          <u-form-item
            label="提醒内容"
            :disabled="!typeEnabled"
          >
            <u-textarea
              v-model="reminderContent"
              placeholder="请输入提醒内容"
              height="120"
              :disabled="!typeEnabled"
            />
          </u-form-item>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-btn-wrapper">
        <view class="save-btn" @click="saveSettings">保存设置</view>
      </view>
    </view>
    
    <!-- 声音选择器 -->
    <u-picker
      :show="showSoundPicker"
      :columns="[soundOptions]"
      @confirm="confirmSound"
      @cancel="showSoundPicker = false"
      title="选择提醒声音"
    ></u-picker>
    
    <!-- 优先级选择器 -->
    <u-picker
      :show="showPriorityPicker"
      :columns="[priorityOptions]"
      @confirm="confirmPriority"
      @cancel="showPriorityPicker = false"
      title="选择优先级"
    ></u-picker>
    
    <!-- 时间选择器 -->
    <u-picker
      :show="showTimePicker"
      :columns="timeColumns"
      @confirm="confirmTime"
      @cancel="showTimePicker = false"
      title="选择提醒时间"
    ></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      typeCode: '',
      typeName: '',
      
      // 基本设置
      typeEnabled: true,
      soundType: 'default',
      priority: 'normal',
      
      // 提醒时间
      reminderTimes: [],
      editingTimeIndex: -1,
      
      // 提醒周期
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      selectedDays: [1, 2, 3, 4, 5, 6, 7], // 1-7 代表周一到周日
      
      // 自定义文本
      reminderTitle: '',
      reminderContent: '',
      
      // 选择器相关
      showSoundPicker: false,
      showPriorityPicker: false,
      showTimePicker: false,
      
      soundOptions: [
        { label: '默认提示音', value: 'default' },
        { label: '营养提示音', value: 'nutrition' },
        { label: '运动提示音', value: 'exercise' },
        { label: '警报提示音', value: 'alert' },
        { label: '水滴提示音', value: 'drop' },
        { label: '日历提示音', value: 'calendar' }
      ],
      
      priorityOptions: [
        { label: '低优先级', value: 'low' },
        { label: '普通优先级', value: 'normal' },
        { label: '高优先级', value: 'high' },
        { label: '紧急优先级', value: 'urgent' }
      ],
      
      timeColumns: [
        { values: Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')) },
        { values: [':'] },
        { values: Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')) }
      ]
    }
  },
  onLoad(options) {
    if (options.typeCode) {
      this.typeCode = options.typeCode;
    }
    
    if (options.typeName) {
      this.typeName = options.typeName;
    }
    
    this.loadTypeSettings();
  },
  methods: {
    // 加载类型设置
    loadTypeSettings() {
      uni.showLoading({
        title: '加载中'
      });
      
      uni.request({
        url: `/api/reminder/type-settings/${this.typeCode}`,
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            const settings = res.data.data;
            
            // 基本设置
            this.typeEnabled = settings.enabled;
            this.soundType = settings.sound || 'default';
            this.priority = settings.priority || 'normal';
            
            // 提醒时间
            if (settings.times && settings.times.length > 0) {
              this.reminderTimes = settings.times;
            } else {
              // 使用默认时间
              this.loadDefaultTimes();
            }
            
            // 提醒周期
            if (settings.daysOfWeek && settings.daysOfWeek.length > 0) {
              this.selectedDays = settings.daysOfWeek;
            }
            
            // 自定义文本
            this.reminderTitle = settings.title || this.getDefaultTitle();
            this.reminderContent = settings.content || this.getDefaultContent();
          } else {
            // 加载默认设置
            this.loadDefaultSettings();
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 加载本地存储的设置
          uni.getStorage({
            key: `reminderTypeSettings_${this.typeCode}`,
            success: (res) => {
              if (res.data) {
                const settings = res.data;
                
                // 基本设置
                this.typeEnabled = settings.enabled;
                this.soundType = settings.sound || 'default';
                this.priority = settings.priority || 'normal';
                
                // 提醒时间
                if (settings.times && settings.times.length > 0) {
                  this.reminderTimes = settings.times;
                } else {
                  // 使用默认时间
                  this.loadDefaultTimes();
                }
                
                // 提醒周期
                if (settings.daysOfWeek && settings.daysOfWeek.length > 0) {
                  this.selectedDays = settings.daysOfWeek;
                }
                
                // 自定义文本
                this.reminderTitle = settings.title || this.getDefaultTitle();
                this.reminderContent = settings.content || this.getDefaultContent();
              } else {
                // 加载默认设置
                this.loadDefaultSettings();
              }
            },
            fail: () => {
              // 加载默认设置
              this.loadDefaultSettings();
            }
          });
        }
      });
    },
    
    // 加载默认设置
    loadDefaultSettings() {
      // 基本设置
      this.typeEnabled = true;
      this.soundType = 'default';
      this.priority = 'normal';
      
      // 默认时间
      this.loadDefaultTimes();
      
      // 默认周期 (全周)
      this.selectedDays = [1, 2, 3, 4, 5, 6, 7];
      
      // 默认文本
      this.reminderTitle = this.getDefaultTitle();
      this.reminderContent = this.getDefaultContent();
    },
    
    // 加载默认时间
    loadDefaultTimes() {
      // 根据类型设置默认时间
      switch (this.typeCode) {
        case 'food_record':
          this.reminderTimes = ['08:00', '12:00', '18:00'];
          break;
        case 'protein_intake':
          this.reminderTimes = ['08:00', '17:30'];
          break;
        case 'exercise':
          this.reminderTimes = ['09:30', '16:00'];
          break;
        case 'medicine':
          this.reminderTimes = ['08:00', '12:00', '18:00'];
          break;
        case 'water':
          this.reminderTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
          break;
        case 'appointment':
          this.reminderTimes = [];
          break;
        default:
          this.reminderTimes = ['09:00'];
      }
    },
    
    // 获取默认标题
    getDefaultTitle() {
      switch (this.typeCode) {
        case 'food_record':
          return '饮食记录提醒';
        case 'protein_intake':
          return '蛋白质补充提醒';
        case 'exercise':
          return '运动锻炼提醒';
        case 'medicine':
          return '服药提醒';
        case 'water':
          return '饮水提醒';
        case 'appointment':
          return '预约提醒';
        default:
          return this.typeName + '提醒';
      }
    },
    
    // 获取默认内容
    getDefaultContent() {
      switch (this.typeCode) {
        case 'food_record':
          return '请记得记录您的饮食情况，保持健康饮食习惯！';
        case 'protein_intake':
          return '现在是补充蛋白质的时间，请不要忘记！';
        case 'exercise':
          return '坚持锻炼，保持健康体魄！现在是您的锻炼时间。';
        case 'medicine':
          return '请按时服用您的药物，保持健康！';
        case 'water':
          return '补充水分的时间到了，请记得喝水！';
        case 'appointment':
          return '您有一个预约即将开始，请做好准备！';
        default:
          return '这是一条友善的提醒，请注意查看！';
      }
    },
    
    // 切换类型启用状态
    toggleTypeEnabled() {
      this.typeEnabled = !this.typeEnabled;
    },
    
    // 获取声音名称
    getSoundName(value) {
      const sound = this.soundOptions.find(item => item.value === value);
      return sound ? sound.label : '默认提示音';
    },
    
    // 获取优先级名称
    getPriorityName(value) {
      const priority = this.priorityOptions.find(item => item.value === value);
      return priority ? priority.label : '普通优先级';
    },
    
    // 确认声音选择
    confirmSound(e) {
      this.soundType = e.value[0].value;
      this.showSoundPicker = false;
    },
    
    // 确认优先级选择
    confirmPriority(e) {
      this.priority = e.value[0].value;
      this.showPriorityPicker = false;
    },
    
    // 添加新时间
    addNewTime() {
      this.editingTimeIndex = -1;
      this.showTimePicker = true;
    },
    
    // 编辑时间
    editTime(index) {
      this.editingTimeIndex = index;
      
      // 设置时间选择器的默认值
      const timeValue = this.reminderTimes[index].split(':');
      this.timeColumns[0].defaultIndex = parseInt(timeValue[0]);
      this.timeColumns[2].defaultIndex = parseInt(timeValue[1]);
      
      this.showTimePicker = true;
    },
    
    // 删除时间
    deleteTime(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除此提醒时间吗？',
        success: (res) => {
          if (res.confirm) {
            this.reminderTimes.splice(index, 1);
          }
        }
      });
    },
    
    // 确认时间选择
    confirmTime(e) {
      const { value } = e;
      const selectedTime = `${value[0]}:${value[2]}`;
      
      if (this.editingTimeIndex === -1) {
        // 添加新时间
        if (this.reminderTimes.includes(selectedTime)) {
          uni.showToast({
            title: '此时间已存在',
            icon: 'none'
          });
        } else {
          this.reminderTimes.push(selectedTime);
          // 对时间进行排序
          this.reminderTimes.sort();
        }
      } else {
        // 编辑现有时间
        const currentIndex = this.editingTimeIndex;
        this.reminderTimes.splice(currentIndex, 1);
        
        if (this.reminderTimes.includes(selectedTime)) {
          uni.showToast({
            title: '此时间已存在',
            icon: 'none'
          });
        } else {
          this.reminderTimes.push(selectedTime);
          // 对时间进行排序
          this.reminderTimes.sort();
        }
      }
      
      this.showTimePicker = false;
      this.editingTimeIndex = -1;
    },
    
    // 切换星期选择
    toggleWeekday(day) {
      const index = this.selectedDays.indexOf(day);
      if (index > -1) {
        this.selectedDays.splice(index, 1);
      } else {
        this.selectedDays.push(day);
        // 对星期进行排序
        this.selectedDays.sort((a, b) => a - b);
      }
    },
    
    // 全选星期
    selectAllDays() {
      this.selectedDays = [1, 2, 3, 4, 5, 6, 7];
    },
    
    // 选择工作日
    selectWeekdays() {
      this.selectedDays = [1, 2, 3, 4, 5];
    },
    
    // 选择周末
    selectWeekends() {
      this.selectedDays = [6, 7];
    },
    
    // 清空星期选择
    clearDays() {
      this.selectedDays = [];
    },
    
    // 保存设置
    saveSettings() {
      if (this.reminderTimes.length === 0 && this.typeEnabled) {
        uni.showToast({
          title: '请至少添加一个提醒时间',
          icon: 'none'
        });
        return;
      }
      
      if (this.selectedDays.length === 0 && this.typeEnabled) {
        uni.showToast({
          title: '请至少选择一天',
          icon: 'none'
        });
        return;
      }
      
      if (!this.reminderTitle.trim() && this.typeEnabled) {
        uni.showToast({
          title: '请输入提醒标题',
          icon: 'none'
        });
        return;
      }
      
      if (!this.reminderContent.trim() && this.typeEnabled) {
        uni.showToast({
          title: '请输入提醒内容',
          icon: 'none'
        });
        return;
      }
      
      // 构建保存数据
      const settings = {
        typeCode: this.typeCode,
        enabled: this.typeEnabled,
        sound: this.soundType,
        priority: this.priority,
        times: this.reminderTimes,
        daysOfWeek: this.selectedDays,
        title: this.reminderTitle,
        content: this.reminderContent
      };
      
      uni.showLoading({
        title: '保存中'
      });
      
      // 保存到API或本地存储
      uni.request({
        url: `/api/reminder/type-settings/${this.typeCode}`,
        method: 'POST',
        data: settings,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            // 同时保存到本地存储
            uni.setStorage({
              key: `reminderTypeSettings_${this.typeCode}`,
              data: settings
            });
            
            uni.showToast({
              title: '设置已保存',
              icon: 'success'
            });
            
            // 延迟返回
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || '保存失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 保存到本地存储
          uni.setStorage({
            key: `reminderTypeSettings_${this.typeCode}`,
            data: settings,
            success: () => {
              uni.showToast({
                title: '设置已保存',
                icon: 'success'
              });
              
              // 延迟返回
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            },
            fail: () => {
              uni.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      });
    }
  }
}
</script>

<style>
@import './reminder-type-settings.scss';
</style>
