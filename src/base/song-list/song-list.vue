<template lang="html">
	<div class="song-list">
		<ul>
			<li class="item" @click="selectItem(song, index)" v-for="(song, index) in songs">
				<div class="rank">

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
		}
	},
	methods: {
		// 基础组件 派发数据
		selectItem(item, index) {
			this.$emit('select', item, index)
		},
		getDesc(song) {
			return `${song.singer}·${song.album}`
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
