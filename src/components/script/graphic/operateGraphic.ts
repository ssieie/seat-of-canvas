import type {Canvaser} from "../core/core.types.ts";
import PubSub from "../utils/pubSub.ts";
import RuntimeStore, {rebuildGroupTree} from "../runtimeStore/runtimeStore.ts";
import type {Element, Group} from "./graphic.types.ts";
import {toCanvasCoords, updateHoverState} from "../eventCenter/tool/hitTargetDetection.ts";
import {exchangeElements, withinCanvas} from "./graphicUtils.ts";

const store = RuntimeStore.getInstance();

class OperateGraphic {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  lastMousePos: { x: number, y: number } | null = null;
  private currentGroup: Group | null = null;
  private dragging = false
  private currentElement: Element | null = null;
  private elDragging = false

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen


    this.addGroupEvents()

    this.addElementEvents()
  }

  private addGroupEvents() {
    if (!this.canvas) return

    PubSub.subscribe('mousedown_group', (e, groupId) => {
      if (e.button === 0) {
        const group = store.getGraphicGroupsById(groupId);
        if (group) {

          store.updateState('highlightElements', false)

          updateHoverState(new Set([group.group_id]))

          const pos = toCanvasCoords(e);

          if (pos) {
            this.lastMousePos = {x: pos.mx, y: pos.my};
            this.currentGroup = group;

            // 为了不频繁构建groupTree做以下操作，以确保看起来正确
            this.currentGroup.z_index = this.currentGroup.z_index + 1;
            this.currentGroup.hover = true;

            this.dragging = true
          }
        }
      }
    })

    PubSub.subscribe('mousemove', (e) => {
      if (!this.dragging || !this.currentGroup) return


      if (!withinCanvas(e)) {
        this.stopDraggingHandler()
        return; // 停止处理拖动
      }

      const pos = toCanvasCoords(e)!; // 转为画布坐标
      const last = this.lastMousePos;

      if (last && pos) {
        const dx = pos.mx - last.x;
        const dy = pos.my - last.y;

        // 更新 group 的位置
        this.currentGroup.x += dx;
        this.currentGroup.y += dy;


        this.lastMousePos = {x: pos.mx, y: pos.my};
      }
    })

    PubSub.subscribe('mouseup', this.stopDraggingHandler.bind(this));
  }

  private addElementEvents() {
    if (!this.canvas) return

    PubSub.subscribe('mousedown_element', (e, el) => {
      if (e.button === 0) {
        const pos = toCanvasCoords(e);

        if (pos) {
          this.lastMousePos = {x: pos.mx, y: pos.my};
          this.currentElement = el;
          el.dX = pos.mx - el.width / 2;
          el.dY = pos.my - el.height / 2;
          el.isDragging = true

          this.elDragging = true

          store.updateState('currentDragEl', el)
        }
      }
    })

    PubSub.subscribe('mousemove', (e) => {
      if (!this.elDragging || !this.currentElement) return


      if (!withinCanvas(e)) {
        this.elementStopDragging(e)
        return; // 停止处理拖动
      }

      const pos = toCanvasCoords(e)!; // 转为画布坐标
      const last = this.lastMousePos;

      if (last && pos) {
        const dx = pos.mx - last.x;
        const dy = pos.my - last.y;

        // 更新位置
        this.currentElement.dX += dx;
        this.currentElement.dY += dy;


        this.lastMousePos = {x: pos.mx, y: pos.my};
      }
    })

    PubSub.subscribe('mouseup', this.elementStopDragging.bind(this));
  }

  elementStopDragging(e: MouseEvent) {
    if (this.elDragging && this.currentElement) {

      this.currentElement.isDragging = false

      // 交换元素？如果有
      exchangeElements(e, this.currentElement)

      this.elDragging = false;

      this.currentElement = null;

      store.updateState('currentDragEl', null)
    }
  }

  stopDraggingHandler() {

    this.lastMousePos = null;

    if (this.dragging) {

      store.updateState('highlightElements', true)

      this.dragging = false

      this.currentGroup = null;

      rebuildGroupTree(store)
    }
  }

  clear() {
  }
}

export default OperateGraphic