import Vue from 'vue'
import store from './store/index'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
