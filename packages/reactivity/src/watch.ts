/**
 * watch 的本质就是 effect
 * 传入一个对象或者函数fn, 以及一个自定义的 scheduler
 * 内部保存新值和旧值
 */

import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactivity";

/**
 * 递归的访问一个 proxy 对象，其实就是一个依赖收集的过程
 * @param value 
 * @param set set 的作用防止递归循环
 * @returns 
 */
export function travelsal(value, set = new Set()) {
  // 递归要有终结条件，不是对象就不再递归了
  if (isObject(value)) return value
  if(set.has(value)) {
    return value
  }
  set.add(value)
  for(let key in value) {
    travelsal(value[key], set)
  }
  return value

}
export function watch(source, cb) {
  let getter
  if (isReactive(source)) {
    // 对 source 递归访问属性，才能进行依赖收集
    getter = () => {
      travelsal(source)
    }
  } else if (isFunction(source)) {
    getter = source 
  } else {
    return
  }
  const job = () => {
    const newValue = effect.run()
    cb(newValue, oldValue)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter, job)

  let oldValue = effect.run()
  return 
}