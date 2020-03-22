<template>
	<view class="padding" style="width: 100%;">

		<view class="text-bold">订单号：{{id}}</view>

		<view class="text-bold">总金额：￥{{price|toMoney}}</view>

		<view class="text-xxl text-bold margin-top">请选择支付方式</view>
		<view class="cu-list menu sm-border margin-top">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-weixin text-green"></text>
					<text class="text-grey">微信支付</text>
				</view>
				<view class="action">
					<radio class="blue radio" checked></radio>
				</view>
			</view>
		</view>
		<button class="cu-btn bg-blue margin-top block lg" @click="checkin">支付{{price|toMoney}}元</button>
	</view>
</template>

<script>
	import {
		toMoney
	} from '@/utils.js'
	import {
		getTaskByID,
		pay
	} from "@/api/index.js"
	export default {
		data() {
			return {
				id: '',
				price: 0,

			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getItem();
		},

		methods: {
			async getItem() {
				this.$$.showLoading();
				try {
					const {
						data
					} = await getTaskByID(this.id);
					this.price = data.price;
				} catch (e) {
					console.error(e);
					this.$$.showErr();
				}
				this.$$.hideLoading()
			},
			showH5Dialog(wxurl) {
				uni.showModal({
					title: '提示',
					content: '如果您的浏览器无法正常调起微信客户端，请打开微信小程序完成支付，支付完成后请返回当前页面进行刷新',
					showCancel: false,
					confirmText: '我知道了，继续支付',
					success(res) {
						if(res.confirm){
							document.location.href = wxurl
						}
					}
				});
			},
			checkin(){
				this.wxcheckin();
			},
			async wxcheckin() {
				const {
					wxdata: data,
					wxurl
				} = await pay(this.id);
				// #ifdef H5				
				this.showH5Dialog(wxurl);
				// #endif
				uni.requestPayment({
					provider: 'wxpay',
					...data,
					success: res => {
						uni.redirectTo({
							url: './success',
						});
					},
					fail: (e) => {
						console.error(e)
					},
					complete: () => {}
				});
			}
		},
		filters: {
			toMoney
		}

	}
</script>

<style>

</style>
