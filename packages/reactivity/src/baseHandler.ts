import { isObject } from '@vue/shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactivity } from './reactivity'
export const mutableHandlers = {
  get(target, key, receiver) {
    //避免对代理对象重复代理
    if (key === ReactiveFlags.IS_REACTIVE) return true
    // 依赖收集
    track(target, 'get', key)
    const result = Reflect.get(target, key, receiver)

    if (isObject(result)) {
      return reactivity(result) // 深度代理，取值的时候才代理，优化性能
    }
    return result
  },
  set(target, key, value, receiver) {
    let oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      // 当前后值不一致的时候，触发更新
      trigger(target, 'set', key, value, oldValue)
    }
    return result
  }
}
