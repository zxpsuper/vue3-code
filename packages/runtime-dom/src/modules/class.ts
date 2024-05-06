/**
 * 创建 & 修改 classname
 * @param el 
 * @param nextValue 
 */
export function patchClass(el: Element, nextValue: string) {
  if (!nextValue) {
    el.removeAttribute('class')
  } else {
    el.className = nextValue
  }
}