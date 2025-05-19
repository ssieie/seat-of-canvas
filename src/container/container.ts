import type {Canvaser} from "../core/core.types";
import PubSub from "../utils/pubSub";
import type {ContainerTransformState} from "./container.type";
import RuntimeStore from "../runtimeStore/runtimeStore";
import {setTransformFrame} from "../transform/keyframe";
import {withinCanvas} from "../graphic/graphicUtils";
import {getTransformState} from "../transform/transform";

const store = RuntimeStore.getInstance();

export const MAX_SCALE = 3
export const MIN_SCALE = .2
const BASE_SCALE = 1

// scale到百分比
export function scaleToPercentage(): number {
  let scale = getTransformState().scale
  if (scale <= MIN_SCALE) return 1
  if (scale >= BASE_SCALE) {
    scale = Math.min(scale, MAX_SCALE)
    return Math.round((scale / BASE_SCALE) * 100)
  }

  // 线性插值从 1% 到 100%
  const percentage = ((scale - MIN_SCALE) / (BASE_SCALE - MIN_SCALE)) * 99 + 1
  return Math.round(percentage)
}

// 百分比到scale
export function percentageToScale(percentage: number): number {
  // 处理边界与不同区间
  if (percentage <= 1) {
    return MIN_SCALE; // 1%对应最小缩放
  }

  if (percentage >= 100) {
    // 计算基准缩放以上的比例，并限制最大值
    const scale = (percentage / 100) * BASE_SCALE;
    return Math.min(scale, MAX_SCALE);
  }

  // 线性插值反向计算中间值
  const scale = ((percentage - 1) / 99) * (BASE_SCALE - MIN_SCALE) + MIN_SCALE;
  return scale;
}

export function scaleContainerHandler(e: WheelEvent) {
  let {offsetX, offsetY, scale} = getTransformState();

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
    ...store.getState('containerTransformState'),
    scale: scale,
    offsetX: mouseX - (mouseX - offsetX) * scaleChange,
    offsetY: mouseY - (mouseY - offsetY) * scaleChange,
  });
}

class Container {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  private dragging = false
  transformState: ContainerTransformState

  onTransformStateChangeHandler: (newVal: ContainerTransformState) => void

  constructor(w: number, h: number, cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    // 确保画布设置正确的宽高
    this.resize(w, h)

    this.transformState = store.getState('containerTransformState')

    this.onTransformStateChangeHandler = this.onTransformStateChange.bind(this)

    store.subscribe('containerTransformState', this.onTransformStateChangeHandler);

    this.addEvents()
  }

  onTransformStateChange(newVal: ContainerTransformState) {
    this.transformState = newVal
  }

  resize(width: number, height: number) {
    if (!this.canvas || !this.ctx) return
    console.log("Size Change", width, height)
    this.canvas.width = width
    this.canvas.height = height

    store.updateState('cvs', this.canvas)
  }

  private addEvents() {
    if (!this.canvas) return

    // 拖动事件
    PubSub.subscribe('mousedown', (e) => {
      if (e.button === 1) {
        this.resetTransform()
      }
    })

    PubSub.subscribe('mousedown_dnh', (e) => {
      if (e.button === 0) {
        this.dragging = true
        store.updateState('containerTransformState', {
          ...this.transformState,
          lastX: e.clientX,
          lastY: e.clientY,
        });
      }
    })

    PubSub.subscribe('mousemove', (e) => {
      if (!this.dragging) return

      if (!withinCanvas(e)) {
        this.dragging = false
        return; // 停止处理拖动
      }

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

      scaleContainerHandler(e)
    })
  }

  resetTransform() {
    setTransformFrame({scale: 1, offsetX: 0, offsetY: 0})
  }

  clear() {
    //
    store.unsubscribe('containerTransformState', this.onTransformStateChangeHandler);
  }
}

export default Container
