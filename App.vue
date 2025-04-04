<script>
	import store from './store';
	import { checkPagePermission } from './utils/permission';
	export default {
		onLaunch: function() {
			this.checkLoginOnStart();
		},
		onShow: function() {
		},
		onHide: function() {
		},
		methods: {
			async checkLoginOnStart() {
				// 获取当前页面路径
				const pages = getCurrentPages();
				const currentPage = pages.length > 0 ? pages[pages.length - 1] : null;
				const currentPath = currentPage ? `/${currentPage.route}` : '/pages/index/index';
				
				// 如果当前页面需要登录权限
				if (checkPagePermission(currentPath)) {
					// 尝试初始化用户信息，可能本地有token但状态未更新
					await store.dispatch('user/initUser');
					
					// 检查登录状态
					if (!store.getters['user/isLoggedIn']) {
						// 未登录，跳转到登录页面
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				}
			}
		}
	}
</script>

<style lang="scss">
</style>