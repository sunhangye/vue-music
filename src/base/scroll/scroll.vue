
<template>
<div ref="wrapper">
	<slot></slot>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
	props: {
		probeType: {
			type: Number,
			default: 1
		},
		click: {
			type: Boolean,
			default: true
		},
		data: {
			type: Array,
			default: null
		},
		refreshDelay: {
			type: Number,
			default: 20
		},
		listenScroll: { // 监听滚动，实现联动效果
			type: Boolean,
			default: false
		},
		pullup: { // 上拉加载 监听scrollEnd
			type: Boolean,
			default: false
		},
		pullDown: { // 下拉刷新
			type: Boolean,
			default: true
		},
		beforeScroll: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
		setTimeout(() => {
			this._initScroll()
		}, this.refreshDelay)
	},
	methods: {
		_initScroll() {
			if (!this.$refs.wrapper) {
				return
			}
			this.scroll = new BScroll(this.$refs.wrapper, {
				probeType: this.probeType,
				click: this.click
			})
			// 实时监听scroll 获取位置 pos {x, y}
			if (this.listenScroll) {
				let me = this // 保留vue实例对象的this
				this.scroll.on('scroll', (pos) => {
					// this.$emit('scroll', 'pos')  这里的this为BScroll
					me.$emit('scroll', pos)
				})
			}
			// 上拉加载数据
			if (this.pullup) {
				this.scroll.on('scrollEnd', () => {
					// 滚动距离超过 最大滚动距离 派发 scrollToEnd事件
					if (this.scroll.y <= this.scroll.maxScrollY + 50) {
						this.$emit('scrollToEnd')
					}
				})
			}

			if (this.pullDown) {
				this.scroll.on('scrollEnd', () => {
					if (this.scroll.y > 50) {
						this.$emit('scrollToUp')
					}
				})
			}

			if (this.beforeScroll) {
				this.scroll.on('beforeScrollStart', () => {
					this.$emit('beforeScroll')
				})
			}
		},
		enable() {
			this.scroll && this.scroll.enable()
		},
		disable() {
			this.scroll && this.scroll.disable()
		},
		refresh() {
			this.scroll && this.scroll.refresh()
		},
		scrollTo() {
			// scrollTo将参数传到scroll实例对象中
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
		},
		scrollToElement() {
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		}
	},
	watch: {
		data() {
			setTimeout(() => {
				this.refresh()
			}, this.refreshDelay)
		}
	}
}
</script>
