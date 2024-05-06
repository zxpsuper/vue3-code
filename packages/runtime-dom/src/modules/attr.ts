/**
 * 修改普通属性
 * @param el 
 * @param key 
 * @param nextValue 
 */
export function patchAttr(el: HTMLElement, key: string, nextValue: string) {
  if(nextValue) {
    el.setAttribute(key, nextValue)
  } else {
    el.removeAttribute(key)
  }
}