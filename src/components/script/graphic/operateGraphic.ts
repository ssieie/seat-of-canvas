import type {Canvaser} from "../core/core.types.ts";
import PubSub from "../../../utils/pubSub.ts";
import RuntimeStore, {rebuildGroupTree} from "../runtimeStore/runtimeStore.ts";
import type {Group} from "./graphic.types.ts";
import {toCanvasCoords, updateHoverState} from "../eventCenter/tool/hitTargetDetection.ts";

const store = RuntimeStore.getInstance();

class OperateGraphic {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  lastMousePos: { x: number, y: number } | null = null;

  private currentGroup: Group | null = null;
  private dragging = false

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen


    this.addEvents()
  }

  private addEvents() {
    if (!this.canvas) return

    // 拖动事件
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

      // 获取鼠标在 canvas 上的相对位置
      const rect = this.canvas!.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // 判断是否在 canvas 内
      const withinCanvas = (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );

      if (!withinCanvas) {
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

  stopDraggingHandler() {

    store.updateState('highlightElements', true)

    // if (this.currentGroup) {
    //   mousemoveTargetHandler(e)
    // }

    this.dragging = false
    this.currentGroup = null;
    this.lastMousePos = null;

    rebuildGroupTree(store)
  }

  clear() {
  }
}

export default OperateGraphic