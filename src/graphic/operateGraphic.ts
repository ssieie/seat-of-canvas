import type {Canvaser} from "../core/core.types";
import PubSub from "../utils/pubSub";
import RuntimeStore, {rebuildGroupTree} from "../runtimeStore/runtimeStore";
import type {Element, ElementStatus, Group, IncreaseElementPos} from "./graphic.types";
import {updateHoverState} from "../eventCenter/tool/hitTargetDetection";
import {
  exchangeElements,
  withinCanvas,
  toCanvasCoords, delGroupElement,
} from "./graphicUtils";
import {saveToImages} from "./externalMethods";
import {addCircleGroupElement} from "./circle/circleUtils";
import {addMatrixGroupElement} from "./matrix/matrixUtils";
import {addStripGroupElement} from "./strip/stripUtils";
import {getCanvas} from "../transform/transform";
import {setTransformFrame} from "../transform/keyframe";
import {elementIntervalHighlight} from "../behaviorTasks/behaviorController";

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
        this.currentGroup!.hover = false;
        this.stopDraggingHandler(e, true)
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

  stopDraggingHandler(_e: MouseEvent, offScreen = false) {

    this.lastMousePos = null;

    if (this.dragging) {

      if (offScreen) {
        setTimeout(() => {
          store.updateState('highlightElements', true)
        }, 500)
      } else {
        store.updateState('highlightElements', true)
      }

      this.dragging = false

      this.currentGroup = null;

      rebuildGroupTree(store)
    }
  }

  // contextMenu
  delGroup(group: Group) {
    let result = true

    const graphicMatrix = store.getState('graphicMatrix')

    result = Reflect.deleteProperty(graphicMatrix.groups[group.type], group.group_id)
    if (!result) return result

    result = Reflect.deleteProperty(graphicMatrix.groupElements, group.group_id)
    if (!result) return result

    for (const [e_id, element] of Object.entries(graphicMatrix.elements)) {
      if (element.group_by === group.group_id) {
        result = Reflect.deleteProperty(graphicMatrix.elements, e_id)
        if (!result) return result
      }
    }

    store.updateState('graphicMatrix', graphicMatrix)

    return result
  }

  // 保存为图片
  exportToPng(group: Group) {
    saveToImages(group.group_name, false, group.group_id);
  }

  // 插入元素
  increaseElement(group: Group, element: Element, type: IncreaseElementPos, num: number) {
    switch (group.type) {
      case "circle":
        addCircleGroupElement(group, element, type, num)
        break
      case 'strip':
        addStripGroupElement(group, element, type, num)
        break
      case "rectangle":
        addMatrixGroupElement(group, element, type, num)
        break
    }
  }

  // 删除元素
  decreaseElement(group: Group, element: Element) {
    delGroupElement(group, element)

    if (group.size === 1) {
      this.delGroup(group)
    }
  }

  // 设置元素状态
  setElementStatus(element: Element, type: ElementStatus) {
    const el = store.getGraphicGroupElementById(element.id)
    if (el) {
      el.status = type
    }
  }

  // 定位指定元素到中心
  highlightAppointEl(groupId: string, elementId: string) {
    const group = store.getGraphicGroupsById(groupId)
    const element = store.getGraphicGroupElementById(elementId)
    if (group && element) {
      // 区域中心（世界坐标）
      const regionCenterX = group.x + group.w / 2;
      const regionCenterY = group.y + group.h / 2;

      // 画布中心（屏幕坐标）
      const canvasCenterX = getCanvas()!.width / 2;
      const canvasCenterY = getCanvas()!.height / 2;

      // 计算新的偏移量，使得区域中心映射到画布中心
      const offsetX = canvasCenterX - regionCenterX;
      const offsetY = canvasCenterY - regionCenterY;
      setTransformFrame({scale: 1, offsetX: offsetX, offsetY: offsetY})

      elementIntervalHighlight(element)
    }
  }

  clear() {
  }
}

export default OperateGraphic
