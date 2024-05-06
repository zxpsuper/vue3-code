import { isArray, isObject } from "@vue/shared"
import { createVnode, isVnode } from "./vnode"
/**
 * 一个更加灵活的创建 vnode 的方法, 其本质还是 createVnode
 * 可以传2个及以上的参数
 * @param type tagname
 * @param propsChildren props 或 children
 * @param children 可以是文本,也可以是 vnode
 * @returns 
 */
export function h(type, propsChildren, children) {
  let length  = arguments.length
  if (length ===2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        return createVnode(type, null, [propsChildren])
      }
      return createVnode(type, propsChildren)
    } else {
      return createVnode(type, null, propsChildren)
    }
  } else {
    if (length === 3 && isVnode(children)) {
      children = [children]
    } else if (length > 3) {
      children = Array.from(arguments).slice(2)
    }
    return createVnode(type, propsChildren, children)
  }
}