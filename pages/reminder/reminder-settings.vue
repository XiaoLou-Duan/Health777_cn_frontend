<template>
  <view class="reminder-settings-container">
    <u-navbar title="提醒设置" :border="false" back-icon-color="#333333"></u-navbar>
    <view class="content-wrapper">
      <!-- 基础设置 -->
      <view class="settings-section">
        <view class="section-title">基础设置</view>
        <u-cell-group>
          <u-cell 
            title="启用提醒" 
            :value="enableNotification ? '已开启' : '已关闭'"
            @click="toggleSetting('enableNotification')" 
            :arrow="false"
          >
            <u-switch slot="right-icon" v-model="enableNotification" active-color="#5FB878"></u-switch>
          </u-cell>
          <u-cell 
            title="提醒声音" 
            :value="enableSound ? '已开启' : '已关闭'"
            @click="toggleSetting('enableSound')" 
            :arrow="false"
            :disabled="!enableNotification"
          >
            <u-switch slot="right-icon" v-model="enableSound" active-color="#5FB878" :disabled="!enableNotification"></u-switch>
          </u-cell>
          <u-cell 
            title="震动提醒" 
            :value="enableVibration ? '已开启' : '已关闭'"
            @click="toggleSetting('enableVibration')" 
            :arrow="false"
            :disabled="!enableNotification"
          >
            <u-switch slot="right-icon" v-model="enableVibration" active-color="#5FB878" :disabled="!enableNotification"></u-switch>
          </u-cell>
        </u-cell-group>
      </view>
      
      <!-- 免打扰设置 -->
      <view class="settings-section">
        <view class="section-title">免打扰设置</view>
        <u-cell-group>
          <u-cell 
            title="免打扰模式" 
            :value="enableDoNotDisturb ? '已开启' : '已关闭'"
            @click="toggleSetting('enableDoNotDisturb')" 
            :arrow="false"
            :disabled="!enableNotification"
          >
            <u-switch slot="right-icon" v-model="enableDoNotDisturb" active-color="#5FB878" :disabled="!enableNotification"></u-switch>
          </u-cell>
          <u-cell 
            title="开始时间" 
            :value="doNotDisturbTimeStart"
            @click="openTimePicker('doNotDisturbTimeStart')" 
            :disabled="!enableDoNotDisturb || !enableNotification"
          ></u-cell>
          <u-cell 
            title="结束时间" 
            :value="doNotDisturbTimeEnd"
            @click="openTimePicker('doNotDisturbTimeEnd')" 
            :disabled="!enableDoNotDisturb || !enableNotification"
          ></u-cell>
        </u-cell-group>
      </view>
      
      <!-- 紧急提醒设置 -->
      <view class="settings-section">
        <view class="section-title">紧急提醒设置</view>
        <view class="section-desc">选择即使在免打扰时间也会提醒的紧急类型</view>
        <view class="emergency-list">
          <view 
            class="emergency-item" 
            v-for="(type, index) in reminderTypes" 
            :key="index"
            :class="{ active: emergencyTypes.includes(type.code) }"
            @click="toggleEmergencyType(type.code)"
            :disabled="!enableNotification"
          >
            <image :src="type.icon" mode="aspectFit" class="type-icon"></image>
            <text>{{ type.name }}</text>
          </view>
        </view>
      </view>
      
      <!-- 提醒频率设置 -->
      <view class="settings-section">
        <view class="section-title">提醒频率设置</view>
        <u-cell-group>
          <u-cell title="重复提醒间隔">
            <u-number-box 
              slot="right-icon" 
              v-model="repeatInterval" 
              :min="1" 
              :max="30"
              :disabled="!enableNotification"
              @change="updateRepeatInterval"
            ></u-number-box>
            <text slot="value" style="margin-right: 10rpx;">{{ repeatInterval }}分钟</text>
          </u-cell>
          <u-cell title="最大重复次数">
            <u-number-box 
              slot="right-icon" 
              v-model="maxRepeatTimes" 
              :min="0" 
              :max="5"
              :disabled="!enableNotification"
              @change="updateMaxRepeatTimes"
            ></u-number-box>
            <text slot="value" style="margin-right: 10rpx;">{{ maxRepeatTimes }}次</text>
          </u-cell>
        </u-cell-group>
      </view>
      
      <!-- 提醒分类设置 -->
      <view class="settings-section">
        <view class="section-title">提醒分类设置</view>
        <view class="category-list">
          <view class="category-item" v-for="(type, index) in reminderTypes" :key="index" @click="goToTypeSettings(type)">
            <view class="category-header">
              <view class="category-left">
                <image :src="type.icon" mode="aspectFit" class="category-icon"></image>
                <text class="category-name">{{ type.name }}</text>
              </view>
              <view class="category-status">
                <text>{{ getCategoryStatus(type.code) }}</text>
                <u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
              </view>
            </view>
            <view class="category-desc">{{ type.description }}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 时间选择器弹窗 -->
    <u-picker
      :show="showTimePicker"
      :columns="timeColumns"
      @confirm="confirmTimePicker"
      @cancel="cancelTimePicker"
    ></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 基础设置
      enableNotification: true,
      enableSound: true,
      enableVibration: true,
      
      // 免打扰设置
      enableDoNotDisturb: false,
      doNotDisturbTimeStart: '22:00',
      doNotDisturbTimeEnd: '07:00',
      
      // 紧急提醒设置
      emergencyTypes: ['medicine', 'appointment'],
      
      // 提醒频率设置
      repeatInterval: 5,
      maxRepeatTimes: 3,
      
      // 时间选择器
      showTimePicker: false,
      timeColumns: [
        { values: Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')) },
        { values: [':'] },
        { values: Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')) }
      ],
      currentTimeField: '',
      
      // 提醒类型
      reminderTypes: [
        {
          id: 'type001',
          code: 'food_record',
          name: '饮食记录',
          description: '记录每日三餐饮食情况',
          icon: '/static/icons/reminders/food.png',
          importance: 'high',
          defaultTimes: ['08:00', '12:00', '18:00']
        },
        {
          id: 'type002',
          code: 'protein_intake',
          name: '乳清蛋白摄入',
          description: '每日乳清蛋白补充提醒',
          icon: '/static/icons/reminders/protein.png',
          importance: 'high',
          defaultTimes: ['08:00', '17:30']
        },
        {
          id: 'type003',
          code: 'exercise',
          name: '运动提醒',
          description: '每日锻炼提醒',
          icon: '/static/icons/reminders/exercise.png',
          importance: 'high',
          defaultTimes: ['09:30', '16:00']
        },
        {
          id: 'type004',
          code: 'medicine',
          name: '服药提醒',
          description: '按时服用药物提醒',
          icon: '/static/icons/reminders/medicine.png',
          importance: 'high',
          defaultTimes: ['08:00', '12:00', '18:00']
        },
        {
          id: 'type005',
          code: 'water',
          name: '喝水提醒',
          description: '定时补充水分提醒',
          icon: '/static/icons/reminders/water.png',
          importance: 'medium',
          defaultTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
        },
        {
          id: 'type006',
          code: 'appointment',
          name: '预约提醒',
          description: '医生预约提醒',
          icon: '/static/icons/reminders/appointment.png',
          importance: 'high',
          defaultTimes: []
        }
      ],
      
      // 提醒分类设置
      typeSettings: {
        food_record: {
          enabled: true,
          sound: 'default',
          priority: 'normal'
        },
        protein_intake: {
          enabled: true,
          sound: 'nutrition',
          priority: 'high'
        },
        exercise: {
          enabled: true,
          sound: 'exercise',
          priority: 'normal'
        },
        medicine: {
          enabled: true,
          sound: 'alert',
          priority: 'urgent'
        },
        water: {
          enabled: true,
          sound: 'drop',
          priority: 'low'
        },
        appointment: {
          enabled: true,
          sound: 'calendar',
          priority: 'high'
        }
      }
    }
  },
  onLoad() {
    this.loadSettings();
  },
  methods: {
    // 加载设置
    loadSettings() {
      uni.showLoading({
        title: '加载中'
      });
      
      // 从API或本地存储获取设置
      uni.request({
        url: '/api/reminder/settings',
        method: 'GET',
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0 && res.data.data) {
            const settings = res.data.data;
            
            // 基础设置
            this.enableNotification = settings.enableNotification;
            this.enableSound = settings.enableSound;
            this.enableVibration = settings.enableVibration;
            
            // 免打扰设置
            this.enableDoNotDisturb = settings.enableDoNotDisturb;
            this.doNotDisturbTimeStart = settings.doNotDisturbTimeStart;
            this.doNotDisturbTimeEnd = settings.doNotDisturbTimeEnd;
            
            // 紧急提醒设置
            this.emergencyTypes = settings.emergencyTypes || [];
            
            // 提醒频率设置
            this.repeatInterval = settings.repeatInterval;
            this.maxRepeatTimes = settings.maxRepeatTimes;
            
            // 提醒分类设置
            this.typeSettings = settings.typeSettings || this.typeSettings;
          }
        },
        fail: () => {
          uni.hideLoading();
          
          // 使用本地模拟数据
          uni.getStorage({
            key: 'reminderSettings',
            success: (res) => {
              if (res.data) {
                const settings = res.data;
                
                // 基础设置
                this.enableNotification = settings.enableNotification;
                this.enableSound = settings.enableSound;
                this.enableVibration = settings.enableVibration;
                
                // 免打扰设置
                this.enableDoNotDisturb = settings.enableDoNotDisturb;
                this.doNotDisturbTimeStart = settings.doNotDisturbTimeStart;
                this.doNotDisturbTimeEnd = settings.doNotDisturbTimeEnd;
                
                // 紧急提醒设置
                this.emergencyTypes = settings.emergencyTypes || [];
                
                // 提醒频率设置
                this.repeatInterval = settings.repeatInterval;
                this.maxRepeatTimes = settings.maxRepeatTimes;
                
                // 提醒分类设置
                this.typeSettings = settings.typeSettings || this.typeSettings;
              }
            }
          });
        }
      });
    },
    
    // 保存设置
    saveSettings() {
      const settings = {
        // 基础设置
        enableNotification: this.enableNotification,
        enableSound: this.enableSound,
        enableVibration: this.enableVibration,
        
        // 免打扰设置
        enableDoNotDisturb: this.enableDoNotDisturb,
        doNotDisturbTimeStart: this.doNotDisturbTimeStart,
        doNotDisturbTimeEnd: this.doNotDisturbTimeEnd,
        
        // 紧急提醒设置
        emergencyTypes: this.emergencyTypes,
        
        // 提醒频率设置
        repeatInterval: this.repeatInterval,
        maxRepeatTimes: this.maxRepeatTimes,
        
        // 提醒分类设置
        typeSettings: this.typeSettings
      };
      
      uni.showLoading({
        title: '保存中'
      });
      
      // 保存到API或本地存储
      uni.request({
        url: '/api/reminder/settings',
        method: 'POST',
        data: settings,
        success: (res) => {
          uni.hideLoading();
          
          if (res.data.code === 0) {
            uni.showToast({
              title: '设置已保存',
              icon: 'success'
            });
            
            // 本地存储一份
            uni.setStorage({
              key: 'reminderSettings',
              data: settings
            });
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
            key: 'reminderSettings',
            data: settings,
            success: () => {
              uni.showToast({
                title: '设置已保存',
                icon: 'success'
              });
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
    },
    
    // 切换设置开关
    toggleSetting(key) {
      this[key] = !this[key];
      
      // 如果关闭了主开关，其他设置也应该被禁用
      if (key === 'enableNotification' && !this.enableNotification) {
        this.enableSound = false;
        this.enableVibration = false;
        this.enableDoNotDisturb = false;
      }
      
      // 保存更改
      this.saveSettings();
    },
    
    // 切换紧急提醒类型
    toggleEmergencyType(typeCode) {
      if (!this.enableNotification) return;
      
      const index = this.emergencyTypes.indexOf(typeCode);
      if (index > -1) {
        this.emergencyTypes.splice(index, 1);
      } else {
        this.emergencyTypes.push(typeCode);
      }
      
      // 保存更改
      this.saveSettings();
    },
    
    // 更新重复提醒间隔
    updateRepeatInterval(value) {
      this.repeatInterval = value;
      this.saveSettings();
    },
    
    // 更新最大重复次数
    updateMaxRepeatTimes(value) {
      this.maxRepeatTimes = value;
      this.saveSettings();
    },
    
    // 打开时间选择器
    openTimePicker(field) {
      if (!this.enableNotification || (field.includes('doNotDisturb') && !this.enableDoNotDisturb)) {
        return;
      }
      
      this.currentTimeField = field;
      this.showTimePicker = true;
      
      // 设置时间选择器的默认值
      const timeValue = this[field].split(':');
      this.timeColumns[0].defaultIndex = parseInt(timeValue[0]);
      this.timeColumns[2].defaultIndex = parseInt(timeValue[1]);
    },
    
    // 确认时间选择
    confirmTimePicker(e) {
      const { value, index } = e;
      const selectedTime = `${value[0]}:${value[2]}`;
      
      this[this.currentTimeField] = selectedTime;
      this.showTimePicker = false;
      this.currentTimeField = '';
      
      // 保存更改
      this.saveSettings();
    },
    
    // 取消时间选择
    cancelTimePicker() {
      this.showTimePicker = false;
      this.currentTimeField = '';
    },
    
    // 获取分类状态文本
    getCategoryStatus(typeCode) {
      const setting = this.typeSettings[typeCode];
      if (!setting) return '未设置';
      
      return setting.enabled ? '已启用' : '已禁用';
    },
    
    // 跳转到类型设置页面
    goToTypeSettings(type) {
      uni.navigateTo({
        url: `./reminder-type-settings?typeCode=${type.code}&typeName=${type.name}`
      });
    }
  }
}
</script>

<style>
@import './reminder-settings.scss';
</style>
