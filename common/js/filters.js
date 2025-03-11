/**
 * filters.js - 通用过滤器
 */

import { formatDate, getRelativeTime } from './date.js';

/**
 * 格式化数字（添加千位分隔符）
 * @param {Number} num 数字
 * @returns {String} 格式化后的数字
 */
export function formatNumber(num) {
  if (!num && num !== 0) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化金额（保留两位小数）
 * @param {Number} amount 金额
 * @param {String} symbol 货币符号，默认为'¥'
 * @returns {String} 格式化后的金额
 */
export function formatCurrency(amount, symbol = '¥') {
  if (!amount && amount !== 0) return '';
  return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

/**
 * 截断文本
 * @param {String} text 文本
 * @param {Number} length 长度
 * @param {String} suffix 后缀，默认为'...'
 * @returns {String} 截断后的文本
 */
export function truncateText(text, length, suffix = '...') {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * 格式化文件大小
 * @param {Number} size 文件大小（字节）
 * @returns {String} 格式化后的文件大小
 */
export function formatFileSize(size) {
  if (!size && size !== 0) return '';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let formattedSize = size;
  let unitIndex = 0;
  
  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }
  
  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 格式化手机号（中间四位用星号代替）
 * @param {String} phone 手机号
 * @returns {String} 格式化后的手机号
 */
export function formatPhone(phone) {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化身份证号（中间隐藏）
 * @param {String} idCard 身份证号
 * @returns {String} 格式化后的身份证号
 */
export function formatIdCard(idCard) {
  if (!idCard) return '';
  return idCard.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2');
}

/**
 * 格式化蛋白质摄入量（添加单位）
 * @param {Number} protein 蛋白质摄入量（克）
 * @returns {String} 格式化后的蛋白质摄入量
 */
export function formatProtein(protein) {
  if (!protein && protein !== 0) return '';
  return `${parseFloat(protein).toFixed(1)}g`;
}

/**
 * 格式化时间（分钟转换为时:分）
 * @param {Number} minutes 分钟数
 * @returns {String} 格式化后的时间
 */
export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}分钟`;
  }
  
  return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
}

/**
 * 根据日期获取星期几
 * @param {Date|String|Number} date 日期
 * @returns {String} 星期几
 */
export function getWeekDay(date) {
  if (!date) return '';
  
  let _date = date;
  if (!(date instanceof Date)) {
    if (typeof date === 'string' && !isNaN(Date.parse(date))) {
      _date = new Date(date);
    } else if (typeof date === 'number') {
      _date = new Date(date);
    } else {
      return '';
    }
  }
  
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekDays[_date.getDay()];
}

export default {
  formatDate,
  getRelativeTime,
  formatNumber,
  formatCurrency,
  truncateText,
  formatFileSize,
  formatPhone,
  formatIdCard,
  formatProtein,
  formatDuration,
  getWeekDay
};
