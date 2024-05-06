type VueElement = {
  _vei: Record<string, any>
}
/**
 * 触发事件绑定及更新
 * @param el dom 元素
 * @param eventName 事件名称
 * @param nextValue 事件执行函数
 */
export function patchEvent(el: HTMLElement & VueElement, eventName: string, nextValue: Function) {
  let invokers = el._vei || (el._vei = {})
  // 判断dom是否存在监听函数
  const exits = invokers[eventName]
  if (exits && nextValue) {
    // 如果存在且更新函数不为空,则修改监听事件的执行函数
    invokers[eventName].value = nextValue
  } else {
    // 如果不存在,则获取事件名称
    let event = eventName.slice(2).toLowerCase()
    if (nextValue) {
      // 创建监听事件
      const invorker = (invokers[eventName] = createInvorker(nextValue))
      el.addEventListener(event, invorker)
    } else if (exits) {
      // 已经存在并且新值为空,则移除监听事件
      el.removeEventListener(event, exits)
      invokers[eventName] = undefined
    }
  }
}
/**
 * 创建可修改的 dom 监听函数,通过修改其 value 修改其执行函数
 * @param fn 
 * @returns 
 */
function createInvorker(fn: Function) {
  const invorker = (e: Event) => invorker.value(e)
  invorker.value = fn
  return invorker
}
