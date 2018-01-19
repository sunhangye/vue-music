<template lang="html">
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import {ERROR_OK} from 'api/config'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this.getMusicList()
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }

      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERROR_OK) {
          this.songs = this._normalizeSinger(res.songlist)
        }
      })
    },
    _normalizeSinger(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
      transition: all 0.3s
  .slide-enter, .slide-leave-active
      transform: translate3d(100%, 0, 0)
</style>
