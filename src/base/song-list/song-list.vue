<template lang="html">
	<div class="song-list">
		<ul>
			<li class="item" @click="selectItem(song, index)" v-for="(song, index) in songs">
				<div class="rank" v-show="rank">
					<span :class="getRankCls(index)" v-text="getRankTxt(index)"></span>
				</div>
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		songs: {
			type: Array,
			default: []
		},
		rank: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		// 基础组件 派发数据
		selectItem(item, index) {
			this.$emit('select', item, index)
		},
		getDesc(song) {
			return `${song.singer}·${song.album}`
		},
		getRankCls(index) {
			if (index <= 2) {
				return `icon icon${index}`
			} else {
				return `text`
			}
		},
		getRankTxt(index) {
			if (index > 2) {
				return index + 1
			}
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.song-list
	.item
		display: flex
		align-items: center
		height: 64px;
		box-sizng: border-box
		font-size: $font-size-medium
		.rank
			flex: 0 0 25
			width: 25px
			margin-right: 30px
			text-align: center
			.icon
				display: inline-block
				width: 25px;
				height: 24px;
				background-size: 25px 24px
				&.icon0
					bg-image('first')
				&.icon1
					bg-image('second')
				&.icon2
					bg-image('third')
				.text
					color: $color-theme
					font-size: $font-size-large
		.content
			flex: 1
			line-height: 20px
			overflow: hidden
			.name
				no-wrap()
				color: $color-text
			.desc
				margin-top: 4px;
				no-wrap()
				color: $color-text-d
</style>
