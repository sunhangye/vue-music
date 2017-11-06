<template>
  <div class="singer" rel="singer">
  	<listview rel="list" :data="singers"></listview>

  </div>
</template>

<script>
  import { getSingerList } from 'api/singer'
  import {ERROR_OK} from 'api/config'
  import Singer from 'common/js/singer';
  import Listview from 'base/listview/listview';

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  export default {
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
      getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERROR_OK){
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list){
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
          }else if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(a) - b.title.charCodeAt(b)
        })
        console.log(hot.concat(ret))
        return hot.concat(ret)

      }
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .singer
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
</style>
