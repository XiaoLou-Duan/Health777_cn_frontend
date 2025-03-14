/**
 * 本地存储工具类
 */
const Storage = {
  /**
   * 设置存储
   * @param {String} key 键
   * @param {any} data 值
   */
  set(key, data) {
    try {
      // 转为JSON字符串存储
      uni.setStorageSync(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`存储数据失败 [${key}]:`, e);
      return false;
    }
  },
  
  /**
   * 获取存储
   * @param {String} key 键
   * @param {any} defaultValue 默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key);
      if (value) {
        return JSON.parse(value);
      }
      return defaultValue;
    } catch (e) {
      console.error(`获取数据失败 [${key}]:`, e);
      return defaultValue;
    }
  },
  
  /**
   * 移除存储
   * @param {String} key 键
   */
  remove(key) {
    try {
      uni.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error(`移除数据失败 [${key}]:`, e);
      return false;
    }
  },
  
  /**
   * 清除所有存储
   */
  clear() {
    try {
      uni.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清除所有数据失败:', e);
      return false;
    }
  }
}

export default Storage;
