import PubSub from '../../../utils/pubSub.ts'

const mousedownHandler = (e: MouseEvent) => {
  PubSub.publish('mousedown', e)
}
const mousemoveHandler = (e: MouseEvent) => {
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
