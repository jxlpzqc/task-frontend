<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<template v-if="backable">
						<text class="cuIcon-back"></text>
						<slot name="backText"></slot>
					</template>
					<template v-else>
						<view style="font-size: 36rpx;font-weight: bold;">小时商城</view>
					</template>
				</view>
				
				<view class="content" :style="[{top:StatusBar + 'px'},{left:'-100px'}]">
					<slot name="content"></slot>
				</view>
				<view class="action" @tap="changeAddress" :style="[{top:StatusBar + 'px'}]">
					<button class="cu-btn round" style="background-color:rgba(255,255,255,0.7);
						
						color:black;
						font-weight:550;
						">
						<slot name="change"></slot>
					</button>

				</view>

				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				backable: true,
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			changeAddress() {
				this.$emit('address');
			}
		},
		mounted() {
			console.log("judge if this is the first page",getCurrentPages());
			if(getCurrentPages().length==1){
				this.backable = false;
			}
		}
	}
</script>

<style scoped>
	.address-button {
		background-color: rgba(80, 60, 230, 0.5);
	}
	
</style>
