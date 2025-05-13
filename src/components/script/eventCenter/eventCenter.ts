import PubSub from '../utils/pubSub.ts'
import {didNotHitAnyElement, hitElement, mousemoveTargetThrottleHandler} from "./tool/hitTargetDetection.ts";

const mousedownHandler = (e: MouseEvent) => {

  const dnh = didNotHitAnyElement(e)

  if (!dnh) {
    PubSub.publish('mousedown_dnh', e)
  } else {
    // 判断是否命中的元素
    const element = hitElement(e, dnh)
    if (element) {
      PubSub.publish('mousedown_element', e, element, dnh)
    } else {
      // 命中组
      PubSub.publish('mousedown_group', e, dnh.group_id)
    }
  }

  PubSub.publish('mousedown', e)
}
const mousemoveHandler = (e: MouseEvent) => {

  mousemoveTargetThrottleHandler(e)

  PubSub.publish('mousemove', e)
}
const mouseupHandler = (e: MouseEvent) => {
  PubSub.publish('mouseup', e)
}
const wheelHandler = (e: WheelEvent) => {
  PubSub.publish('wheel', e)
}

export function registerAllEvents(cvs: HTMLCanvasElement) {
  cvs.addEventListener('mousedown', mousedownHandler)
  cvs.addEventListener('mousemove', mousemoveHandler)
  cvs.addEventListener('mouseup', mouseupHandler)
  cvs.addEventListener('wheel', wheelHandler, {passive: false})
}

export function cancelAllEvents(cvs: HTMLCanvasElement) {
  cvs.removeEventListener('mousedown', mousedownHandler)
  cvs.removeEventListener('mousemove', mousemoveHandler)
  cvs.removeEventListener('mouseup', mouseupHandler)
  cvs.removeEventListener('wheel', wheelHandler)

  PubSub.clearAll()
}
