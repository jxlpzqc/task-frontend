<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">手机号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入中国大陆的手机号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">验证码：</text>
				<m-input v-model="code" placeholder="请输入验证码"></m-input>

				<button :disabled="waiting" class="cu-btn margin-xs" @click="getCode"> {{waiting?time+'秒':'获取验证码'}}</button>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogin">登录</button>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
				<!-- #ifdef MP-WEIXIN -->
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import {
		sendSms,
		login
	} from "@/api/index.js"


	export default {
		components: {
			mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '',
				code: '',
				time: 0,
				waiting: false,
				positionTop: 0,
				isDevtools: false,
			}
		},
		computed: mapState(['forcedLogin']),
		intervalID: 0,
		methods: {
			...mapMutations(['login']),

			async getCode() {
				this.$$.showLoading();

				const res = await sendSms(this.account)

				this.$$.hideLoading();

				if (res.status) {
					this.waiting = true;
					this.time = 60;
					this.intervalID = setInterval(() => {
						this.time--;
						if (this.time == 0) {
							this.waiting = false;
							clearInterval(this.intervalID);
						}

					}, 1000)
				}

			},

			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			async bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 */
				if (this.account.length < 7) {
					uni.showToast({
						icon: 'none',
						title: '手机号最短为 7 个字符'
					});
					return;
				}
				if (!this.code) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				/**
				 * 上级用户判断并传输
				 */
				const uplevel = uni.getStorageSync("uplevel");

				//TODO:uplevel
				const data = await login(this.account, this.code, uplevel);

				if (data.status == true) {
					this.toMain(this.account, data.sessionkey, data.admin);
				} else {
					uni.showToast({
						icon: 'none',
						title: '用户账号或密码不正确',
					});
				}
			},
			oauth(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo.nickName);
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '登陆失败'
								});
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			},
			getUserInfo({
				detail
			}) {
				if (detail.userInfo) {
					this.toMain(detail.userInfo.nickName);
				} else {
					uni.showToast({
						icon: 'none',
						title: '登陆失败'
					});
				}
			},
			toMain(phoneNum, sessionKey, admin) {
				this.login({
					phoneNum,
					sessionKey,
					admin
				});
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}

			}
		},
		onReady() {
			this.initPosition();
			this.initProvider();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style scoped>
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
