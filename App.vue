<script>
	export default {
		onLaunch: () => {
			console.log('App Launch')
		},
		onShow: () => {
			console.log('App Show')
		},
		onHide: () => {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 只保留必要的全局样式 */
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
			Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		color: #2c3e50;
		font-size: 28rpx;
		line-height: 1.5;
		background: #F8FAFC;
	}

	/* 暗黑模式适配 */
	@media (prefers-color-scheme: dark) {
		page {
			background: #1A1A1A;
			color: #E5E7EB;
		}
	}

	/* 通用布局类 */
	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.items-center {
		align-items: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	/* 通用间距类 */
	.mt-4 {
		margin-top: 16rpx;
	}

	.mb-4 {
		margin-bottom: 16rpx;
	}

	.mx-4 {
		margin-left: 16rpx;
		margin-right: 16rpx;
	}

	.p-4 {
		padding: 16rpx;
	}

	/* 通用圆角类 */
	.rounded {
		border-radius: 8rpx;
	}

	.rounded-lg {
		border-radius: 16rpx;
	}

	.rounded-full {
		border-radius: 9999rpx;
	}

	/* 通用阴影类 */
	.shadow {
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.shadow-lg {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	}

	/* 通用过渡类 */
	.transition {
		transition: all 0.3s ease;
	}
</style>
