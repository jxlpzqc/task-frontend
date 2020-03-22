<template>
	<view>
		<view style="height: 90upx;">
			<scroll-view scroll-x scroll-with-animation style="position: fixed;" class="bg-white nav">

				<view class="cu-item" :class="index==selectedType?'text-blue cur':''" v-for="(item,index) in types" :key="index"
				 @tap="selectedType = index" :data-id="index">
					{{item.text}}
				</view>
			</scroll-view>
		</view>
		</scroll-view>
		<view class="list content">
			<view class="item bg-white margin-bottom padding" v-for="item of items" :key='item.id' @click="openDetail(item.id)">
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
		getMyTaskByStatus
	} from '@/api/index.js'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		watch: {
			selectedType(newValue, oldValue) {
				uni.pageScrollTo({
					scrollTop: 0
				})
				uni.startPullDownRefresh()

			}
		},
		data() {
			return {
				items: [],
				types: [{
						text: '全部',
						id: -1
					},
					{
						text: '未支付',
						id: 0
					},
					{
						text: '待审核',
						id: 1
					},
					{
						text: '已驳回',
						id: 2
					},
					{
						text: '发布中',
						id: 3
					},
					{
						text: '执行中',
						id: 4
					},
					{
						text: '已收货',
						id: 5
					},
					{
						text: '已退款',
						id: 6
					},
				],
				selectedType: 0,

				page: 0,
				pageSize: 20
			}
		},
		onShow() {
			this.getItems()
		},

		onPullDownRefresh() {
			this.getItems().then(() => {
				uni.stopPullDownRefresh();
			}).catch(() => {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			async getItems() {
				this.$$.showLoading();
				try {
					const items = await getMyTaskByStatus(this.types[this.selectedType].id, this.page, this.pageSize);
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
