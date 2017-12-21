/**
 * [在两个数之间随机取一个整数 包括最小和最大值]
 * @param  {[Number]} min [最小值]
 * @param  {[Number]} max [最大值]
 * @return {[Number]}     [description]
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * [洗翻函数 遍历arr 从0-i随机取一个索引 然后这个索引对应的值与arr[i]交换]
 * @param  {[Array]} arr [description]
 * @return {[Array]}     [description]
 */
export function shuffle(arr) {
  // 需要操作参数的副本 不然多个地方使用数据一致在变化
  let _arr = arr.slice()
  for (var i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
