<template>
  <div class="singer" ref="singer">
  	<listview ref="list" :data="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getSingerList } from 'api/singer'
  import {ERROR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import { mapMutations } from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      setTimeout(() => {
        this.getSingerList()
      }, 200)
    },
    methods: {
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 参数为 载荷 payload
        this.setSinger(singer)
      },
      getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERROR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }

          const key = item.Findex

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // 需要将歌手和字母表并有序化
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]

          if (val.title === HOT_NAME) {
            hot.push(val)
          } else if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(a) - b.title.charCodeAt(b)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        // 将 `this.setSinger()` 映射为 `this.$store.commit('SET_SINGER')`
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
