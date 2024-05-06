import { isArray, isObject } from '@vue/shared'
import { trackEffects, triggerEffects } from './effect'
import { reactivity } from './reactivity'

export function ref(value) {
  return new RefImpl(value)
}
export function toReactive(value) {
  if (isObject(value)) {
    return reactivity(value)
  }
  return value
}
export class RefImpl {
  private _value
  private dep = new Set()
  public __v_isRef = true
  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }
  get value() {
    trackEffects(this.dep)
    return this._value
  }
  set value(value) {
    if (value !== this.rawValue) {
      this._value = toReactive(value)
      this.rawValue = value
      triggerEffects(this.dep)
    }
  }
}

class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key]
  }
  set value(newValue) {
    this.object[this.key] = newValue
  }
}
export function toRef(object, key) {
  return new ObjectRefImpl(object, key)
}
export function toRefs(object) {
  const result = isArray(object) ? new Array(object.length) : {}
  for (let key in object) {
    result[key] = toRef(object, key)
  }
  return result
}


export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier)
      return r.__v_isRef ? r.value : r
    },
    set(target, key, value, recevier) {
      let oldValue = target[key]
      if (oldValue.__v_isRef) {
        oldValue.value = value
        return true
      }
      return Reflect.set(target, key, value, recevier)
    }
  })
}