import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '_PLAY_'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '_FAVORITE_'
const FAVORITE_MAX_LEN = 200

/**
 * [将查询的值存储到数组，根据campare函数得到索引判断数组中如有重复则删除，并放到第一位]
 * @param  {[type]} arr     [存储的数组]
 * @param  {[type]} val     [存储的值]
 * @param  {[type]} compare [比较函数]
 * @param  {[type]} maxLen  [最大存储长度]
 * @return {[type]}         [无]
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val) // 添加到首位
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function seaveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 无则返回空数组
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

export function saveFavoriteList(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  return songs
}
