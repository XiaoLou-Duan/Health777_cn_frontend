/**
 * mock/data/reminder/settings.js - 提醒系统设置数据
 * 
 * 提供用户的提醒系统设置数据
 */

// 用户提醒设置
const reminderSettings = [
  {
    userId: '1001',
    settings: {
      // 基本设置
      enableNotification: true,    // 是否启用通知
      enableSound: true,           // 是否启用声音
      enableVibration: true,       // 是否启用振动
      
      // 免打扰设置
      enableDoNotDisturb: true,    // 是否启用免打扰模式
      doNotDisturbTimeStart: '22:00', // 免打扰开始时间
      doNotDisturbTimeEnd: '07:00',   // 免打扰结束时间
      
      // 紧急提醒设置（即使在免打扰时间也会提醒）
      emergencyTypes: ['medicine', 'appointment'], // 紧急提醒类型
      
      // 提醒频率设置
      repeatInterval: 5,           // 未完成提醒重复间隔（分钟）
      maxRepeatTimes: 3,           // 最大重复次数
      
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
  {
    userId: '1002',
    settings: {
      enableNotification: true,
      enableSound: false,
      enableVibration: true,
      enableDoNotDisturb: true,
      doNotDisturbTimeStart: '23:00',
      doNotDisturbTimeEnd: '06:00',
      emergencyTypes: ['medicine'],
      repeatInterval: 10,
      maxRepeatTimes: 2,
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
  }
];

export default {
  reminderSettings
};
