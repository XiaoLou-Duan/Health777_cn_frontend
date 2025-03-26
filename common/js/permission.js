/**
 * 路由拦截器
 * 用于检查用户登录状态，未登录时重定向到登录页
 */
import store from '@/store';

// 需要登录才能访问的页面路径
const loginPages = [
  '/pages/user/profile',
  '/pages/user/settings',
  '/pages/health/record',
  '/pages/nutrition/plan',
  '/pages/exercise/plan',
  '/pages/social/friends',
  '/pages/medical/records'
];

// 不需要登录就能访问的页面路径
const publicPages = [
  '/pages/login/login',
  '/pages/login/register',
  '/pages/login/forgot-password',
  '/pages/index/index',
  '/pages/about/about',
  '/pages/about/privacy',
  '/pages/about/terms'
];

/**
 * 初始化路由拦截
 */
export function setupRouterGuard() {
  // 页面跳转前拦截
  const routerBeforeEach = async (to) => {
    console.log('路由拦截 - 目标页面:', to);
    
    // 如果是公开页面，直接放行
    if (publicPages.some(page => to.url.startsWith(page))) {
      return true;
    }
    
    // 如果是需要登录的页面，检查登录状态
    if (loginPages.some(page => to.url.startsWith(page))) {
      const isLoggedIn = store.getters['user/isLoggedIn'];
      
      // 如果未登录，跳转到登录页
      if (!isLoggedIn) {
        // 尝试初始化用户信息，可能本地有token但状态未更新
        await store.dispatch('user/initUser');
        
        // 再次检查登录状态
        if (!store.getters['user/isLoggedIn']) {
          uni.navigateTo({
            url: '/pages/login/login'
          });
          return false;
        }
      }
    }
    
    return true;
  };
  
  // 监听路由跳转
  uni.addInterceptor('navigateTo', {
    invoke(params) {
      if (!routerBeforeEach(params)) {
        return false;
      }
      return params;
    }
  });
  
  uni.addInterceptor('redirectTo', {
    invoke(params) {
      if (!routerBeforeEach(params)) {
        return false;
      }
      return params;
    }
  });
  
  uni.addInterceptor('reLaunch', {
    invoke(params) {
      if (!routerBeforeEach(params)) {
        return false;
      }
      return params;
    }
  });
  
  uni.addInterceptor('switchTab', {
    invoke(params) {
      if (!routerBeforeEach(params)) {
        return false;
      }
      return params;
    }
  });
}

/**
 * 检查当前页面是否需要登录
 * @param {String} url 页面路径
 * @returns {Boolean} 是否需要登录
 */
export function checkPagePermission(url) {
  // 如果是公开页面，不需要登录
  if (publicPages.some(page => url.startsWith(page))) {
    return false;
  }
  
  // 如果是需要登录的页面，需要登录
  if (loginPages.some(page => url.startsWith(page))) {
    return true;
  }
  
  // 默认需要登录
  return true;
}

/**
 * 检查登录状态，未登录时跳转到登录页
 * @returns {Boolean} 是否已登录
 */
export function checkLoginStatus() {
  return store.dispatch('user/checkLoginStatus');
}
