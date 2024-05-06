import { isArray, isString, ShapeFlags } from "@vue/shared";
/**
 * 判断是否是 vnode , 根据创建时赋予的属性 __v_isVnode 来判断
 * @param value 
 * @returns 
 */
export function isVnode(value) {
  return !!(value && value.__v_isVnode)
}

export function isSameVnode(n1, n2) {
  return (n1.type === n2.type) && (n1.key === n2.key) 
}
// 用 symbol 作为唯一标识
export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

/**
 * 创建虚拟节点
 * @param type tagname
 * @param props 属性
 * @param children 
 * @returns 
 */
export function createVnode(type: string | Symbol, props, children = null) {
  // 组合方案 shapeflag
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  const vnode = {
    /**用于判断节点类型 */
    shapeFlag,
    __v_isVnode: true,
    type, children, props,
    key: props?.key,
    el: null, // 真实dom
  }
  if (children) {
    let type = 0
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      children = String(children)
      type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag |= type
  }
  return vnode
}