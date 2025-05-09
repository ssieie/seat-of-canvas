import type {Canvaser} from "../core/core.types.ts";
import PubSub from "../../../utils/pubSub.ts";
import type {ContainerTransformState} from "./container.type.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {setTransformFrame} from "../transform/keyframe.ts";

const store = RuntimeStore.getInstance();

const MAX_SCALE = 3
const MIN_SCALE = .2

class Container {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  private dragging = false
  transformState: ContainerTransformState

  constructor(w: number, h: number, cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.resize(w, h)

    this.transformState = store.getState('containerTransformState')

    store.subscribe('containerTransformState', this.onTransformStateChange.bind(this));

    this.addEvents()
  }

  onTransformStateChange(newVal: ContainerTransformState) {
    this.transformState = newVal
  }

  resize(width: number, height: number) {
    if (!this.canvas || !this.ctx) return
    this.canvas.width = width
    this.canvas.height = height
  }

  private addEvents() {
    if (!this.canvas) return

    // 拖动事件
    PubSub.subscribe('mousedown', (e) => {
      if (e.button === 0) {
        this.dragging = true

        store.updateState('containerTransformState', {
          ...this.transformState,
          lastX: e.clientX,
          lastY: e.clientY,
        });
      }

      if (e.button === 1) {
        this.resetTransform()
      }
    })

    PubSub.subscribe('mousemove', (e) => {
      if (!this.dragging) return
      const dx = e.clientX - this.transformState.lastX
      const dy = e.clientY - this.transformState.lastY

      let newOffsetX = this.transformState.offsetX + dx;
      let newOffsetY = this.transformState.offsetY + dy;

      store.updateState('containerTransformState', {
        ...this.transformState,
        lastX: e.clientX,
        lastY: e.clientY,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    })

    PubSub.subscribe('mouseup', () => {
      this.dragging = false
    })

    // 缩放事件（滚轮）
    PubSub.subscribe('wheel', (e) => {
      e.preventDefault()

      let scale = this.transformState.scale
      let offsetX = this.transformState.offsetX
      let offsetY = this.transformState.offsetY

      const zoomFactor = 1.09
      const oldScale = scale
      const mouseX = e.offsetX
      const mouseY = e.offsetY

      if (e.deltaY < 0) {
        if (scale > MAX_SCALE) return
        scale *= zoomFactor
      } else {
        if (scale < MIN_SCALE) return
        scale /= zoomFactor
      }

      // 保持缩放中心在鼠标位置
      const scaleChange = scale / oldScale

      store.updateState('containerTransformState', {
        ...this.transformState,
        scale: scale,
        offsetX: mouseX - (mouseX - offsetX) * scaleChange,
        offsetY: mouseY - (mouseY - offsetY) * scaleChange,
      });
    })
  }

  resetTransform() {
    setTransformFrame({scale: 1, offsetX: 0, offsetY: 0})
  }

  clear() {
    //
    store.unsubscribe('containerTransformState', this.onTransformStateChange.bind(this));
  }
}

export default Container
