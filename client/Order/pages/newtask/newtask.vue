<template>
	<view class="container">
		<view class="bg-white padding-sm">
			<input v-model="form.title" placeholder="请输入标题" />
		</view>
		<view class="text-right margin-top margin-bottom">
			<button class="cu-btn bg-blue" @click="upload"><text class="cuIcon-album margin-right"></text> 插入图片</button>
		</view>
		<editor id="editor" class="ql-container" :placeholder="placeholder" @ready="onEditorReady"></editor>
		<view class="cu-form-group margin-top">
			<label class="title">发单数量</label>
			<input v-model="form.remain" placeholder="输入发单数量" type="number" />
		</view>

		<view class="cu-form-group">
			<label class="title">任务单价</label>
			<input v-model="form.price" placeholder="输入单价" type="digit" />
		</view>

		<view class="cu-form-group">
			<label class="title">任务时间</label>
			<input v-model="form.time" placeholder="输入任务大约需要多少分钟" type="digit" />
		</view>

		<view class="cu-form-group">
			<label class="title">联系方式</label>
			<input v-model="form.contact" placeholder="输入您的联系方式(可选)" />
		</view>

		<button class="cu-btn block bg-blue" @click="submit">发单</button>
	</view>
</template>

<script>
	import COS from '@/lib/cos.js'
	import {
		getCosCred,
		newTask
	} from '@/api/index.js'
	export default {
		data() {
			return {
				placeholder: '请在这里输入您的任务详情',
				title: "",
				form: {
					title: '',
					contact:'',
					remain: '',
					price: '',
					contact: '',
					time: ''
				}
			}
		},
		methods: {
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			submit(){
				const that = this;
				this.editorCtx.getContents({
					success(item) {
						const html = item.html;
						that.doSubmit(html);
					}
				})
			},			
			async doSubmit(html) {
				this.$$.showLoading();
				try {					
					const data = await newTask(this.form.title, html, this.form.price, this.form.remain);
					const {
						status,
						taskid
					} = data;
					if (data.status) {
						uni.redirectTo({
							url: '/pages/checkin/checkin?id=' + data.taskid
						});
					}

				} catch (e) {
					console.error(e);
					this.$$.showErr();
				}
				this.$$.hideLoading()
			}


		},


		upload() {
			const cos = new COS({
				// ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
				getAuthorization: async function(options, callback) {
					// 异步获取临时密钥
					const {
						bucket,
						region
					} = options;
					const {
						data: {
							credentials
						},
						data,
						status
					} = await getCosCred(bucket, region)

					if (!status) return console.error('credentials invalid');
					callback({
						TmpSecretId: credentials.tmpSecretId,
						TmpSecretKey: credentials.tmpSecretKey,
						XCosSecurityToken: credentials.sessionToken,
						// 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
						StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
						ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
					});

				}
			});

			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original'], // 可以指定是原图还是压缩图，默认用原图
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					const filePath = res.tempFiles[0].path;
					const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
					cos.postObject({
						Bucket: 'suphelp-picture-1300197327',
						Region: 'ap-chengdu',
						Key: 'upload/' + filename,
						FilePath: filePath,
						onProgress: function(info) {
							console.log(JSON.stringify(info));
						},
					}, function(err, data) {
						console.log(err || data);
					});
				}
			});

		}

	}
</script>

<style scoped>
	.container {
		padding: 10px;
		width: 100%;
	}

	#editor {
		width: 100%;
		height: 300px;
		background-color: white;
		padding: 20upx;
	}

	button {
		margin-top: 10px;
	}
</style>
