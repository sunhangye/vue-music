import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX_LEN = 15

/**
 * [将查询的值存储到数组，数组中如有重复则删除，并放到第一位]
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
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
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
