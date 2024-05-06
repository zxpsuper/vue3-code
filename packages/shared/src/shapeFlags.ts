// 使用 & 运算判断是否属于该分类
// 如: 组件 = 函数组件 + 状态组件 = 010 + 100 = 110
// 只要一个数它的二三位不为1,如 1000, 则与运算结果为0, 可以用来判断是否属于

// 组件的类型
export const enum ShapeFlags {
  /**最后要渲染的 element 类型 */
  ELEMENT = 1,
  /**函数组件 */
  FUNCTIONAL_COMPONTENT = 1 << 1,
  // 组件类型
  STATEFUL_COMPONENT = 1 << 2,
  // vnode 的 children 为 string 类型
  TEXT_CHILDREN = 1 << 3,
  // vnode 的 children 为数组类型
  ARRAY_CHILDREN = 1 << 4,
  // vnode 的 children 为 slots 类型
  SLOTS_CHILDREN = 1 << 5,
  /**组件 */
  COMPONENT = ShapeFlags.FUNCTIONAL_COMPONTENT | ShapeFlags.STATEFUL_COMPONENT
}

