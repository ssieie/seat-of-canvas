// 节流
export function throttle(func: Function, wait: number, options?: { leading?: boolean, trailing?: boolean }) {
  let timeout: any, context: any, args: any
  let previous: number = 0
  if (!options) options = {}

  let later = function () {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    func.apply(context, args)
    if (!timeout) context = args = null
  }

  let throttled: any = function () {
    let now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    let remaining = wait - (now - previous)
    // @ts-ignore
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = null
  }

  return throttled
}

export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function deepCopy(obj: any, cache = new WeakMap()) {
  // 如果是基本数据类型或者是null/undefined，直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 检查缓存，防止循环引用
  if (cache.has(obj)) {
    return cache.get(obj)
  }

  // 根据类型创建新的对象或数组
  const result: any = Array.isArray(obj) ? [] : {}

  // 将当前对象放入缓存
  cache.set(obj, result)

  // 递归处理每个属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepCopy(obj[key], cache)
    }
  }

  return result
}