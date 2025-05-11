import PubSub from '../../../utils/pubSub.ts'
import {didNotHitAnyElement, mousemoveTargetThrottleHandler} from "./tool/hitTargetDetection.ts";

const mousedownHandler = (e: MouseEvent) => {

  const dnh = didNotHitAnyElement(e)

  if (!dnh) {
    PubSub.publish('mousedown_dnh', e)
  } else {
    PubSub.publish('mousedown_group', e, dnh.group_id)
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

export function registerAllEvents() {
  window.addEventListener('mousedown', mousedownHandler)
  window.addEventListener('mousemove', mousemoveHandler)
  window.addEventListener('mouseup', mouseupHandler)
  window.addEventListener('wheel', wheelHandler, {passive: false})
}

export function cancelAllEvents() {
  window.removeEventListener('mousedown', mousedownHandler)
  window.removeEventListener('mousemove', mousemoveHandler)
  window.removeEventListener('mouseup', mouseupHandler)
  window.removeEventListener('wheel', wheelHandler)

  PubSub.clearAll()
}
