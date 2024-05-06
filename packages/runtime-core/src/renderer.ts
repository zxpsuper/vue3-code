import { isString, ShapeFlags } from '@vue/shared'
import { createVnode, isSameVnode, Text } from './vnode'

// 渲染器
export function createRenderer(renderOptions) {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText
  } = renderOptions

  function normalize(child) {
    if (isString(child)) {
      return createVnode(Text, null, child)
    }
    return child
  }
  /**
   * 挂载子节点
   * @param children
   * @param container
   */
  function mountedChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      const element = normalize(children[i])
      patch(null, element, container)
    }
  }


  /**
   * 挂载元素
   * @param vnode
   * @param container
   */
  function mountedElement(vnode, container) {
    let { type, props, shapeFlag, children } = vnode
    // 挂载真实节点,节点复用和更新
    let el = (vnode.el = hostCreateElement(type))
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        const element = props[key]
        hostPatchProp(el, key, null, element)
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountedChildren(children, el)
    }
    // debugger
    hostInsert(el, container)
  }

  function processText(n1, n2, container) {
    if (n1 === null) {
      n2.el = hostCreateText(n2.children)
      hostInsert(n2.el, container)
    } else {
      // 文本节点变化了，复用老的节点
      const el = n2.el = n1.el
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children)
      }
    }
  }
  function processElement(n1,n2,container) {
    if (n1 === null) {
      mountedElement(n2, container)
    }
  }
  const patch = (n1, n2, container) => {
    // 如果两个 vnode 相同，返回
    if (n1 === n2) return
    // 如果n1,n2不相同,卸载旧节点
    if (n1 && !isSameVnode(n1,n2)) {
      unmount(n1)
      n1 = null
    }
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container)
        }
        break
    }
  }

  function unmount(vnode) {
    hostRemove(vnode.el)
  }
  const render = (vnode, container) => {
    if (!vnode) {
      // 卸载逻辑
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      // 初始化 & 更新
      patch(vnode.el || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render
  }
}
