/**
 * date.js - 日期处理工具
 */

/**
 * 格式化日期
 * @param {Date|String|Number} date 日期对象、日期字符串或时间戳
 * @param {String} format 格式化模板，默认 'YYYY-MM-DD'
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  let _date = date;
  
  // 转换为日期对象
  if (!(date instanceof Date)) {
    if (typeof date === 'string' && !isNaN(Date.parse(date))) {
      _date = new Date(date);
    } else if (typeof date === 'number') {
      _date = new Date(date);
    } else {
      return '';
    }
  }
  
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();
  const hours = _date.getHours();
  const minutes = _date.getMinutes();
  const seconds = _date.getSeconds();
  
  // 补零函数
  const padZero = (num) => num < 10 ? `0${num}` : num;
  
  return format
    .replace(/YYYY/g, year)
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MM/g, padZero(month))
    .replace(/M/g, month)
    .replace(/DD/g, padZero(day))
    .replace(/D/g, day)
    .replace(/HH/g, padZero(hours))
    .replace(/H/g, hours)
    .replace(/hh/g, padZero(hours % 12 || 12))
    .replace(/h/g, hours % 12 || 12)
    .replace(/mm/g, padZero(minutes))
    .replace(/m/g, minutes)
    .replace(/ss/g, padZero(seconds))
    .replace(/s/g, seconds)
    .replace(/A/g, hours < 12 ? 'AM' : 'PM')
    .replace(/a/g, hours < 12 ? 'am' : 'pm');
}

/**
 * 获取相对时间描述（如：刚刚、10分钟前、1小时前等）
 * @param {Date|String|Number} date 日期对象、日期字符串或时间戳
 * @returns {String} 相对时间描述
 */
export function getRelativeTime(date) {
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
  
  const now = new Date();
  const diff = now.getTime() - _date.getTime();
  
  // 毫秒转换为秒
  const diffInSeconds = Math.floor(diff / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  // 分钟级别
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  // 小时级别
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  // 天级别
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
  
  // 月级别
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }
  
  // 年级别
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}年前`;
}

/**
 * 获取两个日期之间的天数
 * @param {Date|String|Number} startDate 开始日期
 * @param {Date|String|Number} endDate 结束日期
 * @returns {Number} 天数
 */
export function getDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  let _startDate = startDate;
  let _endDate = endDate;
  
  // 转换为日期对象
  if (!(startDate instanceof Date)) {
    if (typeof startDate === 'string' && !isNaN(Date.parse(startDate))) {
      _startDate = new Date(startDate);
    } else if (typeof startDate === 'number') {
      _startDate = new Date(startDate);
    } else {
      return 0;
    }
  }
  
  if (!(endDate instanceof Date)) {
    if (typeof endDate === 'string' && !isNaN(Date.parse(endDate))) {
      _endDate = new Date(endDate);
    } else if (typeof endDate === 'number') {
      _endDate = new Date(endDate);
    } else {
      return 0;
    }
  }
  
  // 重置时间为0点，只比较日期
  _startDate.setHours(0, 0, 0, 0);
  _endDate.setHours(0, 0, 0, 0);
  
  const diffInMilliseconds = Math.abs(_endDate - _startDate);
  return Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

/**
 * 获取当天的开始时间
 * @returns {Date} 当天的开始时间
 */
export function getStartOfDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * 获取当天的结束时间
 * @returns {Date} 当天的结束时间
 */
export function getEndOfDay() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now;
}

/**
 * 获取本周的开始时间（周一为第一天）
 * @returns {Date} 本周的开始时间
 */
export function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // 调整为周一为第一天
  now.setDate(now.getDate() - diff);
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * 获取本周的结束时间（周日为最后一天）
 * @returns {Date} 本周的结束时间
 */
export function getEndOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  now.setDate(now.getDate() + diff);
  now.setHours(23, 59, 59, 999);
  return now;
}

/**
 * 获取本月的开始时间
 * @returns {Date} 本月的开始时间
 */
export function getStartOfMonth() {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * 获取本月的结束时间
 * @returns {Date} 本月的结束时间
 */
export function getEndOfMonth() {
  const now = new Date();
  const nextMonth = now.getMonth() + 1;
  const year = now.getFullYear() + Math.floor(nextMonth / 12);
  const month = nextMonth % 12;
  
  now.setFullYear(year, month, 0); // 设置为下个月的第0天，即本月的最后一天
  now.setHours(23, 59, 59, 999);
  return now;
}

export default {
  formatDate,
  getRelativeTime,
  getDaysBetween,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth
};
