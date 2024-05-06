/**
 * effect 的原理
 * effect 通过创建 reactivityEffect 实例，和 reactive 配合进行依赖收集与依赖触发
 * 是响应式的基本
 */


/**当前的 effect 实例 */
export let activeEffect = undefined

/**
 * 清除 effect 实例中的依赖
 * @param effect 
 */
function cleanupEffect(effect: ReactiveEffect) {
  const deps = effect.deps
  
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect) // 解除 effect,重新依赖收集
  }
  effect.deps.length = 0
}

/**
 * 响应式 effect
 */
export class ReactiveEffect {
  /**记录父 effect ，树状结构 */
  parent: ReactiveEffect | null = null 
  /**默认是激活状态, effect 可以被 stop */
  active = true // 
  /** 存放依赖函数的数组 */
  public deps: Dep[] = [] 

  constructor(public fn: Function, public scheduler?) {}

  /**执行收集的依赖函数 */
  run() {
    // 如果是非激活状态，则执行一次函数，不进行依赖收集
    if (!this.active) {
      return this.fn()
    }
    try {
      // 进行依赖收集
      this.parent = activeEffect
      activeEffect = this
      // 在执行函数之前，清空收集的依赖
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
  /**停止依赖收集 */
  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this)
    }
  }
}

type EffectOptions = {
  scheduler?: Function
}
/**
 * effect 函数
 * @param fn 执行函数，初始化默认执行一遍，进行依赖收集
 * @param options 可以传入调度函数
 * @returns 
 */
export function effect(fn: Function, options: EffectOptions = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // 实例先执行一遍
  _effect.run()

  const runner = _effect.run.bind(_effect)
  return runner // 提供runner重启依赖收集
}
type Dep = Set<ReactiveEffect>
const targetMap = new WeakMap<object, Map<string, Dep>>()

/**
 * 依赖收集
 * @param target 目标
 * @param type 类型，get
 * @param key 键
 * @returns 
 */
export function track(target, type, key: string) {
  // 如果当前执行的 effect 实例不存在，return
  if (!activeEffect) return
  // targetMap 做一次缓存
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  trackEffects(dep)
}

/**
 * 将 activeEffect 和 dep 相互关联
 * @param dep
 */
export function trackEffects(dep) {
  if (activeEffect) {
    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
      dep.add(activeEffect)
      // 反向记录，记录哪些属性被收集过
      activeEffect.deps.push(dep)
    }
  }
}

/**
 * 依赖触发
 * @param target 
 * @param type 
 * @param key 
 * @param value 
 * @param oldValue 
 * @returns 
 */
export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (deps) {
    console.log('触发更新', target, key, value, oldValue)
    triggerEffects(deps)
  }
}

/**
 * 触发 effects 的执行函数
 * @param effects
 */
export function triggerEffects(effects) {
  // 执行前拷贝一份，解除关联引用
  effects = new Set(effects)
  effects.forEach((effect: ReactiveEffect) => {
    // 执行 effect 时，避免重复执行自己导致栈溢出
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler() // 调度函数，用户自行决定如何更新
      } else {
        effect.run()
      }
    }
  })
}
