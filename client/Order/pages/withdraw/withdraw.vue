<template>
	<view class="padding">
		<view class="text-bold text-xl">可提现金额：{{availableMoney|toMoney}}</view>

		<view class="margin-top text-xl">请输入提现金额</view>
		<view class="margin-top">
			<input v-model="money" :class="valid?'':'text-red'" class="bg-white text-sl padding-sm" type="digit" auto-focus
			 confirm-type="done" />
		</view>
		<button @click="withdraw" class="margin-top cu-btn block bg-blue lg">提现</button>
	</view>
</template>

<script>
	import {
		toMoney
	} from '@/vendor/filters.js'
	import {
		getcash,
		getAvailableMoney
	} from "@/api/index.js"

	export default {
		filters: {
			toMoney
		},
		watch: {
			money(newValue, oldValue) {
				console.log("test format");
				if (/^\d*.?\d{0,2}$/.test(newValue)) {
					this.valid = true;
				} else {
					this.valid = false;
				}
			}
		},
		data() {
			return {
				availableMoney: 0,
				money: "",
				valid: true,
			}
		},

		mounted() {
			this.getItem();
		},

		methods: {
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
			withdraw() {

				if (this.valid && !!this.money) {
					uni.showModal({
						content: '您确认进行提现吗？',
						showCancel: true,
						success: async (res) => {
							if (res.confirm) {
								this.$$.showLoading();
								const res = await getcash(this.money);
								this.$$.hideLoading();
								if (res.fee) {
									uni.redirectTo({
										url: './success',
									});
								} else {
									uni.showModal({
										title: '对不起',
										content: '提现失败，请联系客服人员处理',
										showCancel: false
									})
								}
							}
						},
					});
				} else {
					this.$$.showErr("输入金额错误！");
				}

			}
		}
	}
</script>

<style>

</style>
