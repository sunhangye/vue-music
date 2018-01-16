import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {seaveSearch, deleteSearch, clearSearch} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({
  commit,
  state
}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({
  commit
}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
  // Error: [vuex] Do not mutate vuex store state outside mutation handlers.
  // 使用slice 返回一个副本 在mutate之外 不直接操作state中的对象
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有插入的歌曲 并返回索引
  let fpIndex = findIndex(playList, song)
  // 把歌曲插入到当前播放的索引位置 所以+1
  currentIndex++
  // 选中歌曲 插入当前播放位置
  playList.splice(currentIndex, 0, song)

  // 判断 列表中是否有插入的歌曲 有则删除已有歌曲
  if (fpIndex > -1) {
    // 比较当前索引在后 已有歌曲索引在前
    if (currentIndex > fpIndex) {
      // 直接删除已有歌曲 前面少一个 当前索引减一
      playList.splice(fpIndex, 1)
      currentIndex--
      // 比较当前索引在前 已有歌曲索引在后
    } else {
      // 前面多一个 已有歌曲索引加一
      playList.splice(fpIndex + 1, 1)
    }
  }
  // 插入到 sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentIndex, 1, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, seaveSearch(query))
}

export const deleteSearchHistory = function({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistoty = function({commit, state}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({
  commit,
  state
}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  /*
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
   */
  const playingState = playList.length > 0
    ? true
    : false
  commit(types.SET_PLAYING_STATE, playingState)
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
