import { getLyric } from 'api/song'
import { ERROR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        const data = res.data
        if (data.retcode === ERROR_OK) {
          this.lyric = Base64.decode(data.lyric)
          resolve(this.lyric)
        } else {
          reject('暂无歌词')
        }
      })
    })
  }
}

/**
 * 获取QQ音乐基本信息
  http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=1830679348&g_tk=938407465&loginUin=0&hostUin=0&format=jsonp&inCharset=GB2312&outCharset=GB2312%C2%ACice=0&platform=yqq&jsonpCallback=&needNewCode=0
 */
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url:  `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`,

  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
