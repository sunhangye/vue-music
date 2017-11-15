import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import createLogger from 'vuex/dist/logger' // 插件

Vue.use(Vuex)
// 在开发环境中 开启严格模式 状态发生改变且不是由mucations引起
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state,
	mutations,
	getters,
	actions,
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
