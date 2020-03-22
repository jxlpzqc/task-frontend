<template>
	<view>
		<view class="item bg-white padding">
			<!-- <view style="width: 120upx;">
				<image class="avatar" :src="item.img"></image>
			</view> -->
			<view class="center">
				<view class="margin-bottom-sm text-bold text-xxl">{{item.title}}</view>

				<view class="bg-yellow round" style="display: inline-block; padding: 10upx 30upx;">悬赏{{item.price|toMoney}}</view>
				<view class="bg-grey round" style="display: inline-block; padding: 10upx 30upx;margin-left: 50upx;">任务ID{{item.taskid}}</view>
			</view>
		</view>
		<view>
			<view class="cu-list grid col-3  no-border">
				<view class="cu-item">
					<view style="margin: 20upx 0;" class="text-bold">
						{{item.remain}}
					</view>
					<text>剩余数量</text>
				</view>
				<view class="cu-item">
					<view style="margin: 20upx 0;" class="text-bold">
						{{item.finished}}
					</view>
					<text>完成数量</text>
				</view>
				<view class="cu-item">
					<view style="margin: 20upx 0;" class="text-bold">
						{{item.time}}分钟
					</view>
					<text>做单时间</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		toMoney
	} from '@/vendor/filters.js'

	export default {
		props: ['item'],
		filters: {
			toMoney: toMoney
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;

		.center {
			flex-grow: 1;
		}
	}

	.avatar {
		height: 90upx;
		width: 90upx;
		border: solid 1.5upx #eee;
		border-radius: 90upx;
		display: block;
		overflow: hidden;
	}
</style>
