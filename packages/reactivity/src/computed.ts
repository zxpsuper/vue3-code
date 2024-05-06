import { isFunction } from "@vue/shared";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

/**
 * 返回一个计算属性实例，底层也是根据 effect 实现
 * 可以被对象收集依赖，同时也能收集外部 effect 的依赖
 * @param getterOrOptions 
 * @returns 
 */
export function computed(getterOrOptions) {
  let getter, setter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {
      console.warn('no setter')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  console.log(1)
  return new ComputedRefImpl(getter, setter)
}

export class ComputedRefImpl {
  public effect: ReactiveEffect
  public _dirty = true // 默认是脏的
  public __v_isReadonly = true
  public __v_isRef = true
  private _value
  public dep
  constructor(public getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        // 调用调度器，说明此值已经脏了
        this._dirty = true
        if (this.dep) {
          triggerEffects(this.dep)
        }
      }
    })
  }
  // 类中的属性访问器，底层就是 object.defineProperty()
  get value() {
    // computed 收集外部 effect 依赖
    trackEffects(this.dep || (this.dep = new Set()))
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
  set value(newvalue) {
    this.setter(newvalue)
  }
}