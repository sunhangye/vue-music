<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
  <!--                     .
                                       .;$$
                          ....:;$$$$$$$   $
                      ..;;;$$$            $:..
                   .:$$$$$$               $$$$$:.
                 .;$$$$$$$3             $$$$$$$$$;.
               .;$$$$$$$$$$      $$$$$$$;$$$$$$$$$$;.
              ;$$$$$$$$$$$$$    $$;$$$$$$$$$$$$$$$$$$;
             ;$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$
            $$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$
           :$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$;
          .$$$$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$.
          :$$$$$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$:
          ;$$$$$$$$$$$$$$$$$$$$$$$$$$  $$$$$$$$$$$$$$$$$$;
          ;$$$$$$$$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$;
          :$$$$$$$$$$$$$$$$$$             $$$$$$$$$$$$$$$:
          .$$$$$$$$$$$$$$$                 $$$$$$$$$$$$$$.
           ;$$$$$$$$$$$$$                   $$$$$$$$$$$$;
            $$$$$$$$$$$$                     $$$$$$$$$$$
             $$$$$$$$$$                      $$$$$$$$$$
              ;$$$$$$$$                     $$$$$$$$$;
               .$$$$$$$$                   $$$$$$$$$.
                 .$$$$$$$$               $$$$$$$$$:
                   .;$$$$$$$$          $$$$$$$$;.
                      .:$$$$$$$$$$$$$$$$$$$$:.
                          ...:;;;;;;;;:...
  -->
</template>

<script style="text/ecmascript-6">
  import musicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERROR_OK } from 'api/config'
  import { createSong } from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getDetail()
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      _getDetail() {
        /*
        singer 是vuex 通过是用户点击动态获取的。刷新歌手详情页获取不到singer数据
         */
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERROR_OK) {
            this.songs = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      musicList
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
