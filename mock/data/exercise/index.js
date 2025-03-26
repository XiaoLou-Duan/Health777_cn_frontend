/**
 * mock/data/exercise/index.js - 运动模块模拟数据入口
 * 
 * 整合运动模块的所有子模块数据
 */

// 导入各子模块数据
import exerciseLibrary from './library';
import exerciseRecords from './records';
import exerciseStats from './stats';
import exercisePlans from './plans';
import stepRecords from './steps';
import exerciseReminders from './reminders';

// 导出所有运动模块数据
export default {
  exerciseLibrary,
  exerciseRecords,
  exerciseStats,
  exercisePlans,
  stepRecords,
  exerciseReminders
};
