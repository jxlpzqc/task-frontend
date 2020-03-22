import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: true,
		userName: "正在获取",
		admin: false,
		sessionKey: uni.getStorageSync("session"),
	},
	mutations: {
		login(state, {
			phoneNum,
			sessionKey,
			admin
		}) {
			state.userName = phoneNum || '新用户';
			state.sessionKey = sessionKey;
			state.hasLogin = true;
			state.admin = admin;
			uni.setStorageSync("session", sessionKey);
		},
		setPhoneNum(state,phoneNum){
			state.userName = phoneNum;
		},
		logout(state) {
			state.userName = "";
			state.sessionKey = null;
			state.hasLogin = false;
			uni.clearStorageSync("session");
		}
	}
})

export default store
