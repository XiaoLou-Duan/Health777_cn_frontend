/**
 * mock/data/reminder/index.js - 提醒系统数据入口
 * 
 * 用于统一导出所有提醒系统相关数据
 */

// 导入提醒系统数据子模块
import reminders from './reminders';
import settings from './settings';
import history from './history';

// 导出所有提醒系统数据
export default {
  reminders,
  settings,
  history
};
