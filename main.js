import App from './App'
import uView from 'uview-ui'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import DefaultAvatar from './components/DefaultAvatar.vue'

Vue.component('default-avatar', DefaultAvatar)
// main.js，注意要在use方法之后执行

Vue.use(uView)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif