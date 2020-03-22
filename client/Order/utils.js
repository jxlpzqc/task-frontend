import Vue from 'vue'
import store from './store/index'

export default {
	baseUrl: "http://localhost:5000",
	
	getUrl(url = "") {
		if (url[0] != '/') return this.baseUrl + '/' + url;
		else return this.baseUrl + url;
	},

	request(url, data, method) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: this.getUrl(url),
				method: method,
				data: {
					...data,
					mysession: store.state.sessionKey,
				},
				success: (res) => {
					if (res.statusCode >= 400) reject(res);
					if (res.data.status === false) reject(res);
					if (!!res.data.message)
						uni.showToast({
							icon: 'none',
							title: res.data.message
						})
					resolve(res.data);
				},
				fail: (err) => {
					console.log(err);
					reject(err);
				}
			});
		})
	},

	post(url, data) {
		return this.request(url, data, 'POST');
	},
	get(url, data) {
		return this.request(url, data, 'GET');
	},


	showLoading() {
		uni.showLoading({
			title: '拉取数据中',
			mask: true
		});
	},

	hideLoading() {
		uni.hideLoading();
	},

	showErr(msg = '拉取信息失败') {
		uni.showToast({
			title: msg,
			icon: 'none'
		});
	},



}
