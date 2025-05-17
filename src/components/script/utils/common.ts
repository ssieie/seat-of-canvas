import type {Element} from "../graphic/graphic.types.ts";

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

export function swapInArrayFlexible<T>(arr: T[], a: T, b: T): T[] {
  return arr.map(item => (item === a ? b : item));
}

export function swapElement(e1: Element, e2: Element) {
  const temp: Element = {
    id: e1.id,
    group_by: e1.group_by,
    index: e1.index,
    x: e1.x,
    y: e1.y,
    isDragging: e1.isDragging,
    dX: e1.dX,
    dY: e1.dY,
    width: e1.width,
    height: e1.height,
    pos: e1.pos ? [...e1.pos] : undefined,
    strip: e1.strip ? {...e1.strip} : undefined,
    text: e1.text,
    baseFontSize: e1.baseFontSize,
    nameFontSize: e1.nameFontSize,
    status: e1.status,
  }

  copyElement(e1, e2)
  copyElement(e2, temp)
}

export function copyElement(e1: Element, e2: Element) {
  // e1.id = e2.id
  e1.group_by = e2.group_by
  e1.index = e2.index
  e1.x = e2.x
  e1.y = e2.y
  e1.isDragging = e2.isDragging
  e1.dX = e2.dX
  e1.dY = e2.dY
  e1.width = e2.width
  e1.height = e2.height
  e1.pos = e2.pos ? [...e2.pos] : undefined
  e1.strip = e2.strip ? {...e2.strip} : undefined
  // e1.text = e2.text
}
