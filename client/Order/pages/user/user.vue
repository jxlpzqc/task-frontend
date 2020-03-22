<template>
	<view class="page-container">

		<button v-if="!hasLogin" class="cu-btn block bg-blue margin-xs lg" @tap="bindLogin">登录</button>
		<view v-else class="bg-white margin-xs padding radius user-bar">
			<!-- 微信小程序显示头像 -->
			<!-- #ifdef MP-WEIXIN -->
			<view>
				<open-data class="user-info-avator-img" type="userAvatarUrl">
				</open-data>
			</view>
			<!-- #endif -->

			<view>
				<view class="text-xxl text-bold">{{userName}}</view>
				<view>{{admin?'管理员':'会员'}}</view>
			</view>
			<view>
				<button class="cu-btn xs"><text class="cuIcon-qr_code"></text>我的二维码</button>
			</view>
		</view>
		<view class="bg-white margin-xs padding radius ">
			可提现金额
			<view class="text-sl text-bold">
				{{availableMoney|toMoney}}
			</view>
			<view class="text-right">
				<button class="cu-btn bg-orange" @click="redirect('withdraw')">提现</button>
			</view>
		</view>
		<view class="bg-white margin-xs radius ">
			<!-- <view class="cu-tag badge" v-if="item.badge!=0">
				<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
			</view> -->
			<view class="cu-list grid col-4 no-border">
				<view class="cu-item" @click="redirect('withdraw')">
					<view class="cuIcon-refund text-orange"></view>
					<text>提现</text>
				</view>
				<view class="cu-item" @click="redirect('newtask')">
					<view class="cuIcon-list text-orange"></view>
					<text>发单</text>
				</view>
			</view>
		</view>
		<view class="bg-white margin-xs radius ">
			<view class="cu-list grid col-4 no-border">
				<view class="cu-item" @click="redirect('postadmin')">
					<view class="cuIcon-upload text-brown">
					</view>
					<text>发布管理</text>
				</view>
				<view class="cu-item" @click="redirect('getadmin')">
					<view class="cuIcon-comment text-brown"></view>
					<text>我的接单</text>
				</view>
				<view class="cu-item" @click="redirect('children')">
					<view class="cuIcon-people text-brown"></view>
					<text>下级用户</text>
				</view>
			</view>
		</view>

		<view class="btn-row">
			<button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getAvailableMoney,
		getUserInfo
	} from '@/api/index.js'

	export default {
				
		data() {
			return {
				availableMoney: 0,
			}
		},
		filters: {
			toMoney: function(value) {
				if (typeof(value) == 'number') {
					return `￥${value.toFixed(2)}`;
				} else {
					return "￥0.00"
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'forcedLogin','admin','userName'])
		},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/login',
				});
			},
			redirect(name) {
				if (name == 'withdraw') {
					uni.navigateTo({
						url: '/pages/withdraw/withdraw'
					})
				} else if (name == 'postadmin') {
					uni.navigateTo({
						url: '/pages/postadmin/postadmin'
					})
				} else if (name == 'newtask') {
					uni.navigateTo({
						url: '/pages/newtask/newtask'
					});
				} else if (name == 'children') {
					uni.navigateTo({
						url: '/pages/children/children'
					});
				}
			},

			async getItem() {
				this.$$.showLoading();
				try {
					const data = await getAvailableMoney();
					this.availableMoney = data.balance;
				} catch (e) {
					console.error(e);
					this.$$.showErr();
				}
				this.$$.hideLoading()
				
			},

			bindLogout() {
				this.logout();
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/login',
					});
				}
			}
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			} else {
				this.getItem();
			}
		}
	}
</script>

<style scoped>
	.user-bar {
		display: flex;
		justify-content: space-between;
	}

	.user-info-avator-img {
		height: 100upx;
		width: 100upx;
		border: solid 1.5upx #eee;
		border-radius: 90upx;
		display: block;
		overflow: hidden;
	}
</style>
