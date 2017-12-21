export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) { // 是否有第三个参数 有就设置，没有则获取
    el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

let elementStyle = document.createElement('div').style

let ventor = (() => {
  let transformNames = {
    'webkit': 'webkitTransform',
    'Moz': 'MozTransform',
    'O': 'OTransform',
    'ms': 'msTransform',
    'standard': 'transform'
  }
  for (var key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (ventor === false) {
    return false
  }
  if (ventor === 'standard') {
    return style
  }
  return ventor + style.charAt(0).toUpperCase() + style.substr(1)
}
