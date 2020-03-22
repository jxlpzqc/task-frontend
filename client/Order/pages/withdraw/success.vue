<template>
	<view class="padding text-center text-xsl" style="width: 100%;">
		<view class="cuIcon-roundcheckfill text-green"></view>
		<view class="text-xl">提现成功，您的金额将在24小时内到账。</view>

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
