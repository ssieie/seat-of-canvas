import type {Canvaser} from "../core/core.types.ts";
import PubSub from "../../../utils/pubSub.ts";
import type {ContainerTransformState} from "./container.type.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import behaviorTasksInstance from "../behaviorTasks/behaviorTasks.ts";

const store = RuntimeStore.getInstance();


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
        if (scale > 3) return
        scale *= zoomFactor
      } else {
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
    const duration = 300; // ms
    const startTime = performance.now();

    const startState = {
      offsetX: this.transformState.offsetX,
      offsetY: this.transformState.offsetY,
      scale: this.transformState.scale,
    };

    const endState = {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    behaviorTasksInstance.addBehavior<ContainerTransformState>(
      "resetTransform",
      () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const easeOut = t * (2 - t);

        // 动画完成时移除任务
        if (t >= 1) {
          behaviorTasksInstance.delBehavior("resetTransform");
        }

        return {
          offsetX: lerp(startState.offsetX, endState.offsetX, easeOut),
          offsetY: lerp(startState.offsetY, endState.offsetY, easeOut),
          scale: lerp(startState.scale, endState.scale, easeOut),
          lastX: 0,
          lastY: 0,
        };
      },
      (val) => {
        store.updateState('containerTransformState', val)
      },
      1000 / 60, // 每秒 60 次
      true
    );
  }

  clear() {
    //
    store.unsubscribe('containerTransformState', this.onTransformStateChange.bind(this));
  }
}

export default Container
