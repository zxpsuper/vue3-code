/**
 * 判断是否为对象
 * @param obj 
 * @returns 
 */
export function isObject (obj) {
  return typeof obj === 'object' && obj !==null
}

export function isFunction(obj) {
  return typeof obj === 'function'
}
export function isString(value) {
  return typeof value === 'string'
}

export function isNumber(value) {
  return typeof value === 'number'
}
export const isArray = Array.isArray
export const assign = Object.assign

export { ShapeFlags } from "./shapeFlags"