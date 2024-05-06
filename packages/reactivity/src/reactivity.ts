import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";

/**
 * reactivity 原理
 * 其本质就是将对象包装成一个 proxy 的对象
 * 同时做了许多优化，包括 proxy 缓存，避免对 proxy 再度包装
 * 在 proxy.get 中收集依赖
 * 在 proxy.set 中触发依赖更新
 * 何为依赖？就是关联属性的执行函数，当属性变化时，会执行这些依赖函数
 */

/**一些常量枚举 */
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}
/**判断是否为响应式对象 */
export function isReactive(target) {
  return !!(target && target[ReactiveFlags.IS_REACTIVE])
}
/**更好的进行垃圾处理，优化性能 */
const reactiveMap = new WeakMap()
/**
 * 返回响应式对象
 * @param obj 
 * @returns 
 */
export function reactivity(target) {
  if (isObject(target) === false) return
  // 避免对代理对象 proxy 重新包装
  if (isReactive(target)) return target
  // 缓存优化，避免对同一个对象重复代理
  const exisitingProxy = reactiveMap.get(target)
  if (exisitingProxy) return exisitingProxy

  const proxy = new Proxy(target, mutableHandlers)

  return proxy
}