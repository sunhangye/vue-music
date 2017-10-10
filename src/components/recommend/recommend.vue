<template>
  <div class="recommend" ref="recommend" >
    <scroll class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-if="discList.length" v-for="(item, index) in discList" class="item">
              <div class="icon">
                <img width="60" height="60" :src="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="disc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </scroll>


  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERROR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'

  export default {
    data(){
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()

    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERROR_OK){

            this.recommends = res.data.slider

          }
        })
      },
      _getDiscList(){
        getDiscList().then((res) => {
          if (res.code === ERROR_OK) {
            this.discList = res.data.list
          }
        })
      }
    },
    components: {
      Slider,
      Scroll
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display: flex
          box-sizing border-box
          text-align center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          .text
            display: flex;
            flex-direction column
            overflow hidden
            font-size $font-size-medium
            line-height 20px
            justify-content center
            text-align left
            .name
              color $color-text
              margin-bottom 10px
            .disc
              color $color-text-d

</style>
