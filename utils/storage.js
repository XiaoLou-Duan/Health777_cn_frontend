const Storage = {
  set(key, data) {
    try {
      uni.setStorageSync(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`存储数据失败 [${key}]:`, e);
      return false;
    }
  },
  
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
  remove(key) {
    try {
      uni.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error(`移除数据失败 [${key}]:`, e);
      return false;
    }
  },
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
