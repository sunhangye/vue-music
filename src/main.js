
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
fastclick.attach(document.body)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
