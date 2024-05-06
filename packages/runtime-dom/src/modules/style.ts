/**
 * 创建 & 修改 style 属性
 * @param el dom 元素
 * @param prevValue 前一个值
 * @param nextValue 后一个值
 */
export function patchStyle(el: HTMLElement, prevValue: Object, nextValue: Object) {
  // 先遍历新值,赋值所有属性
  for (let key in nextValue) {
    el.style[key] = nextValue[key]
  }
  if (prevValue) {
    // 再去除新值中不存在的旧属性
    for(let key in prevValue) {
      if (!nextValue[key]) {
        el.style[key] = null
      }
    }
  }
}