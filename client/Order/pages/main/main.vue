<template>
	<view class="page-container">
		<view class="list">
			<view class="item bg-white margin-bottom padding" v-for="item of items" :key='item.id' @click="openDetail(item.id)">
				<!-- <view class="left">
					<image class="avatar" :src="item.img"></image>
				</view> -->
				<view class="center">
					<view class="text-bold text-xl">
						{{item.title}}
					</view>
					<view>
						{{item.content}}
					</view>
				</view>
				<view class="right text-xl text-orange">
					{{item.money|toMoney}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		toMoney
	} from '@/vendor/filters.js'
	import {
		getTasks
	} from '@/api/index.js'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				items: [],
				page: 0,
				pageSize: 20
			}
		},
		onLoad(){
			uni.startPullDownRefresh()
		},
		
		onPullDownRefresh() {
			this.getItems().then(()=>{
				uni.stopPullDownRefresh();
			}).catch(()=>{
				uni.stopPullDownRefresh();
			});
		},		
		methods: {
			async getItems() {
				this.$$.showLoading();
				try {
					const items = await getTasks(this.page, this.pageSize);
					this.items = items.data;
					this.page++;
				} catch (e) {
					console.error(e);
					this.$$.showErr();
				}
				this.$$.hideLoading();
			},
			openDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				});
			}
		},
		filters: {
			toMoney: toMoney
		},
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;

		.left {
			width: 100upx;
		}

		.center {
			padding-left: 30upx;
			flex-grow: 1;
		}

		&:active {
			background: #FAFAFA;
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
