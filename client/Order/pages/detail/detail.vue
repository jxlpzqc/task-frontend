<template>
	<view>
		<meta-viewer class="margin shadow" :item='meta'></meta-viewer>
		<view class="bg-white margin padding">
			<rich-text :nodes="content|formatRichText">
			</rich-text>
		</view>
		<view class="check bg-white flex flex-wrap solids-top">

			<view @click="getItems" style="width: 200upx;" class="text-black text-center text-xxl padding">
				<text class="text-lg text-orange">
					<text class="cuIcon-refresh"></text>刷新
				</text>
			</view>

			<view @click="submit" class="flex-sub bg-yellow padding text-center text-xl">
				<template v-if="meta.status==0">现在支付</template>
				<template v-if="meta.status==1">等待审核</template>
				<template v-if="meta.status==2">重新提交审核</template>				
				<template v-if="meta.status==3">做任务</template>				
				<template v-if="meta.status==4">确认完成</template>
			</view>

		</view>
	</view>
</template>

<script>
	import MetaViewer from './components/MetaViewer.vue'
	import {getTaskByID} from '@/api/index.js'
	
	export default {
		components: {
			MetaViewer
		},
		
		onLoad(options) {
			this.id = options.id;
			this.getItems();
			
		},
		data() {
			return {
				meta: {

				},
				content: "",
				id: 0
			};
		},
		
		methods: {
			
			async getItems() {
				this.$$.showLoading();
				
				try {
					const items = await getTaskByID(this.id)
					this.meta = items.data;
					this.content = items.data.content;
				} catch (e) {
					console.error(e);
					this.$$.showErr();
				}
				this.$$.hideLoading();
			},
		},
		
		filters: {
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img标签里的style、width、height属性
			 * 2.img标签添加style属性：max-width:100%;height:auto
			 * 3.修改所有style里的width属性为max-width:100%
			 * 4.去掉<br/>标签
			 * @param html
			 * @returns {void|string|*}
			 */
			formatRichText(html) { //控制小程序中图片大小
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
				return newContent;
			}
		}

	}
</script>

<style lang="scss" scoped>
	.check {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 100;
	}
</style>
