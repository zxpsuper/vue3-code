/**
 * 这里其实是对一些dom操作方法进行了一次封装,或者说是重命名
 * 提供给 runtime-dom 创建 dom 使用
 */
export const nodeOps = {
  insert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor)
  },
  remove(child) {
    const parentNode = child.parentNode
    if (parentNode) {
      parentNode.removeChild(child)
    }
  },
  /**设置文本内容 */
  setElementText(el, text) {
    el.textContent = text
  },
  setText(node: Node, text) {
    node.nodeValue = text
  },
  querySelector(selector) {
    return document.querySelector(selector)
  },
  parentNode(node) {
    return node.parentNode
  },
  nextSibling(node) {
    return node.nextSibling
  },
  createElement(tagname) {
    return document.createElement(tagname)
  },
  createText(text) {
    return document.createTextNode(text)
  }
}