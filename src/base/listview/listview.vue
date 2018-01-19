<template>
<scroll :data="data" class="listview" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
	<ul>
		<li class="list-group" v-for="group in data" ref="listGroup">
			<h2 class="list-group-title">{{group.title}}</h2>
			<ul>
				<li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
					<img class="avatar" v-lazy="item.avatar" alt="">
					<span class="name">{{item.name}}</span>
				</li>
			</ul>
		</li>
	</ul>
	<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
		<ul>
			<li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="{'current': currentIndex==index}">
				{{item}}
			</li>
		</ul>
	</div>
	<div class="list-fixed" v-show="fixedTitle" ref="fixed">
		<div class="fixed-title">{{fixedTitle}}</div>
	</div>
	<div class="loading-container" v-show="!data.length">
		<loading></loading>
	</div>
</scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 锚点高度为18px
const TITLE_HEIGHT = 30 // 固定标题高度为30
export default {
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,
			diff: -1
		}
	},
	created() {
		// 不必观测touch对象的变化，所以不放到data和props(添加getter setter 属性)
		this.touch = {}
		this.listenScroll = true
		this.listHeight = []
		this.probeType = 3
	},
	methods: {
		selectItem(item) {
			// 触发当前实例上的事件，附加参数都会传到监听器回调
			this.$emit('select', item)
		},
		onShortcutTouchStart(e) {
			// 获得touch目标的索引
			let anchorIndex = getData(e.target, 'index')
			let firstTouch = e.touches[0]
			this.touch.y1 = firstTouch.pageY
			this.touch.anchorIndex = anchorIndex
			this._scroll(anchorIndex)
		},
		onShortcutTouchMove(e) {
			let firstTouch = e.touches[0]
			this.touch.y2 = firstTouch.pageY
			// '| 0' 相当于Math.floor() 	对数进行下舍入。
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta

			this._scroll(anchorIndex)
		},
		refresh() {
			this.$refs.listview.refresh()
		},
		_scroll(index) {
			if (!index && index !== 0) {
				return
			}
			if (index < 0) {
				index = 0
			} else if (index > this.listHeight.length - 2) {
				index = this.listHeight.length - 2
			}
			this.scrollY = -this.listHeight[index] // 滚到上面的位置
			this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 100)
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		_calculHeight() {
			// 获取每个group的高度并放到一个数组里面(从0到最后一个）
			this.listHeight = []
			const list = this.$refs.listGroup
			let height = 0
			this.listHeight.push(height)
			for (let i = 0; i < list.length; i++) {
				const item = list[i]
				height += item.clientHeight
				this.listHeight.push(height)
			}
		}
	},
	components: {
		Scroll,
		Loading
	},
	computed: {
		shortcutList() {
			return this.data.map((item, index) => {
				return item.title.substr(0, 1)
			})
		},
		fixedTitle() {
			if (this.scrollY > 0) {
				return ''
			}
			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
		}
	},
	watch: {
		data() {
			setTimeout(() => {
				this._calculHeight()
			}, 200)
		},
		scrollY(newY, oldY) {
			const listHeight = this.listHeight
			if (newY > 0) {
				this.currentIndex = 0
				return
			}
			for (let i = 0; i < listHeight.length - 1; i++) {
				let height1 = listHeight[i]
				let height2 = listHeight[i + 1]
				if (-newY >= height1 && -newY < height2) {
					this.currentIndex = i
					// 获取内容间距与滚动距离的差值
					this.diff = height2 + newY
					return
				}
			}
			this.currentIndex = listHeight.length - 2
		},
		diff(newVal) {
			let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0

			if (this.fixedTop === fixedTop) {
				return
			}
			this.fixedTop = fixedTop
			this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"

	.listview
		position: relative
		width: 100%
		height: 100%
		overflow: hidden
		background: $color-background
		.list-group
			padding-bottom: 30px
			.list-group-title
				height: 30px
				line-height: 30px
				font-size: $font-size-small
				color: $color-text-l
				background: $color-highlight-background
				padding-left: 20px
			.list-group-item
				display: flex
				align-items: center
				padding: 20px 0 0 30px
				.avatar
					width: 50px
					height: 50px
					border-radius: 50%
				.name
					margin-left: 20px
					color $color-text-l
					font-size: $font-size-medium
		.list-shortcut
			position: absolute
			top: 50%
			right: 0
			z-index: 30
			transform: translateY(-50%)
			width: 20px
			padding: 20px 0
			text-align: center
			border-radius: 20px
			background: $color-background-d
			font-size: $font-size-small-s
			.item
				padding: 3px
				line-height: 1
				color: $color-text-l
				font-familay: Helvetica
				&.current
					color: $color-theme
		.list-fixed
			position: absolute
			left: 0
			top: 0
			width: 100%
			.fixed-title
				height: 30px
				line-height: 30px
				padding-left: 20px
				color: $color-text-l
				font-size: $font-size-small
				background: $color-highlight-background
		.loading-container
			position: absolute
			width: 100%
			top: 50%
			transform: translateY(-50%)
</style>
