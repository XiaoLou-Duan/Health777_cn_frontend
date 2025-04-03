/**
 * 路由拦截器
 * 用于检查用户登录状态，未登录时重定向到登录页
 */
import store from '@/store';

// 不需要登录就能访问的页面路径（白名单）
const publicPages = [
  '/pages/login/login',
  '/pages/login/register',
  '/pages/login/forgot-password',
  '/pages/about/privacy-policy',
  '/pages/about/user-agreement',
  '/pages/about/terms',
  '/pages/about/about',
  '/pages/about/feedback'
];

// 不需要登录检测的API路径
// 这些路径在utils/request.js中也应该配置相同的白名单
export const publicApiPaths = [
  '/app-api/member/auth/login',
  '/app-api/member/auth/sms-login',
  '/app-api/auth/register',
  '/app-api/member/auth/send-sms-code',
  '/app-api/member/auth/validate-sms-code',
  '/app-api/auth/password-reset',
  '/app-api/auth/wechat-login',
  '/app-api/auth/apple-login'
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
    
    // 其他所有页面都需要登录
    const isLoggedIn = store.getters['user/isLoggedIn'];
    
    // 如果未登录，尝试初始化用户信息
    if (!isLoggedIn) {
      // 尝试初始化用户信息，可能本地有token但状态未更新
      await store.dispatch('user/initUser');
      
      // 再次检查登录状态
      if (!store.getters['user/isLoggedIn']) {
        uni.redirectTo({
          url: '/pages/login/login'
        });
        return false;
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
  
  // 其他所有页面都需要登录
  return true;
}

/**
 * 检查登录状态，未登录时跳转到登录页
 * @returns {Boolean} 是否已登录
 */
export function checkLoginStatus() {
  return store.dispatch('user/checkLoginStatus');
}
