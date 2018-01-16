<template lang="html">
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongList } from 'api/recommend'
import {ERROR_OK} from 'api/config'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList()
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }

      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERROR_OK) {
          this.songs = this._normalizeSinger(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSinger(list) {
      let ret = []
      list.forEach((item) => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item))
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
