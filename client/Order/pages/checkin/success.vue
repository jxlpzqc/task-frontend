<template>
	<view class="padding text-center text-xsl" style="width: 100%;">
		<view class="cuIcon-roundcheckfill text-green"></view>
		<view class="text-xl">支付成功，管理员审核后您的发单将公开。</view>

		<button class="cu-btn lg bg-blue margin-top block" @click="back">返回</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		
	}
</script>

<style lang="scss">

</style>
