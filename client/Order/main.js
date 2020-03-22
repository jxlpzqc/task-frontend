import Vue from 'vue'
import App from './App'
import Utils from 'utils.js'

import './uni.scss'

import cuCustom from './colorui/components/cu-custom.vue'

import store from './store/index'
//把vuex定义成全局组件
Vue.prototype.$store = store


Vue.component('cu-custom',cuCustom)


Vue.config.productionTip = false;

App.mpType = 'app'

// Vue.prototype.$$login = false;
// Vue.prototype.$$session = "115115";
Vue.prototype.$$ = Utils;

const app = new Vue({
    store,
	...App
})
app.$mount();
