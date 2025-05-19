import {canvasToScreen, getCanvas, getTransformState, scaleSize} from "../transform/transform";
import RuntimeStore, {allGraphicGroups} from "../runtimeStore/runtimeStore";
import type {Element, ElementStatus, Group, GroupType} from "./graphic.types";
import {didNotHitAnyElement, hitElement} from "../eventCenter/tool/hitTargetDetection";
import {swapElement, swapInArrayFlexible} from "../utils/common";
import {
  ELEMENT_DESC_COLOR, ELEMENT_HEIGHT,
  ELEMENT_MOVE_IN_BD_COLOR,
  ELEMENT_NO_COLOR,
  ELEMENT_WIDTH,
  OCCUPY_DESC
} from "./constant";
import AssetsLoader from "../assetsLoader/assetsLoader";
import {updateCircleGroupLayout} from "./circle/circleUtils";
import {updateMatrixGroupLayout} from "./matrix/matrixUtils";
import {updateStripGroupLayout} from "./strip/stripUtils";

const store = RuntimeStore.getInstance();

const GRAPHIC_MARGIN = 10;

export function getGraphicGroups(graphic?: GroupType[]) {
  return store.getGraphicGroups(graphic ? graphic : allGraphicGroups);
}

type TextAlignType = 'start' | 'end' | 'left' | 'right' | 'center'
type TextBaselineType = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'

export function setCtxFont(ctx: CanvasRenderingContext2D, color: string, textAlign: TextAlignType, textBaseline: TextBaselineType = 'alphabetic', fontSize = 13) {
  ctx.font = `${scaleSize(fontSize)}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
}

// 矩形是否重叠
function isOverlap(newRect: Pick<Group, 'x' | 'y' | 'w' | 'h'>, existingRects: Map<string, Group>): boolean {
  const {x, y, w, h} = newRect;

  for (const r of existingRects.values()) {
    if (
      !(x + w <= r.x || x >= r.x + r.w ||
        y + h <= r.y || y >= r.y + r.h)
    ) {
      return true;
    }
  }

  return false;
}

// 根据画布矩形分布情况返回新矩形可用的基准Pos --以下为简单实现性能欠佳
export function getBasicPos(w: number, h: number): [number, number] {
  const {scale, offsetX, offsetY} = getTransformState();
  // 屏幕转换后的宽
  const screenW = getCanvas()!.width / scale;
  // 已存在的所有组
  const allGraphicGroups = getGraphicGroups();

  // 屏幕 (0, 0) 映射到画布逻辑坐标的起始点
  const startX = -offsetX / scale;
  const startY = -offsetY / scale;
  let xBoundary = startX + screenW - w;
  const step = 10; // 步进像素

  if (startX > xBoundary) {
    // console.log(startX)
    // console.log(xBoundary)
    xBoundary = w
    // alert("当前形状超出画布大小,缩小画布后添加")
    // throw new Error();
  }

  for (let y = startY; ; y += step) {
    for (let x = startX; x < xBoundary; x += step) {
      if (isOverlap({x, y, w, h}, allGraphicGroups)) {
        x += w; // 跳过宽度，避免在同一区域继续尝试
        continue;
      }
      return [x + GRAPHIC_MARGIN, y + GRAPHIC_MARGIN];
    }
  }
}

let canvasRect: DOMRect | null = null;
let cvsInstance: HTMLCanvasElement | null = null;

function cvsChange(cvs: HTMLCanvasElement | null) {
  cvsInstance = cvs
  canvasRect = cvs!.getBoundingClientRect()
}

export function withinCanvas(e: MouseEvent) {
  // 获取鼠标在 canvas 上的相对位置
  // const canvas = getCanvas()

  if (canvasRect) {
    // const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // 判断是否在 canvas 内
    const withinCanvas = (
      mouseX - 8 >= canvasRect.left &&
      mouseX + 8 <= canvasRect.right &&
      mouseY - 8 >= canvasRect.top &&
      mouseY + 8 <= canvasRect.bottom
    );

    return withinCanvas
  }

  return false
}

// 把鼠标坐标转换到画布坐标
export const toCanvasCoords = (e: MouseEvent) => {
  const {offsetX, offsetY, scale} = getTransformState();
  if (canvasRect && cvsInstance) {
    // DOM -> 像素坐标
    const px = (e.clientX - canvasRect.left) * (cvsInstance.width / canvasRect.width);
    const py = (e.clientY - canvasRect.top) * (cvsInstance.height / canvasRect.height);

    // 像素坐标 -> 逻辑坐标（反变换）
    const mx = (px - offsetX) / scale;
    const my = (py - offsetY) / scale;

    return {mx, my};
  }

  return null
}

// 释放元素是否交换元素如果有
export function exchangeElements(e: MouseEvent, dragEl: Element) {
  const dnh = didNotHitAnyElement(e)

  if (dnh) {
    const hitEl = hitElement(e, dnh)

    if (hitEl) {
      if (hitEl.id === dragEl.id) return

      const graphicMatrix = store.getState('graphicMatrix')
      const fromGroupId = dragEl.group_by;
      const toGroupId = hitEl.group_by;

      swapElement(dragEl, hitEl)

      if (fromGroupId !== toGroupId) {
        // 不同组交换
        graphicMatrix.groupElements[fromGroupId] = swapInArrayFlexible(graphicMatrix.groupElements[fromGroupId], dragEl.id, hitEl.id)
        graphicMatrix.groupElements[toGroupId] = swapInArrayFlexible(graphicMatrix.groupElements[toGroupId], hitEl.id, dragEl.id)
      }

    }
  }

}

export function moveInHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // 当前拖拽的元素在目标元素范围内提示
  const currentDragEl = store.getState('currentDragEl')
  if (currentDragEl) {
    const dxy = canvasToScreen(currentDragEl.dX, currentDragEl.dY);
    if (
      dxy[0] + width / 2 >= x &&
      dxy[0] + width / 2 <= x + width &&
      dxy[1] + height / 2 >= y &&
      dxy[1] + height / 2 <= y + height
    ) {
      // ctx.lineWidth = scaleSize(1);
      ctx.strokeStyle = ELEMENT_MOVE_IN_BD_COLOR;
      ctx.strokeRect(x, y, width, height)
    }
  }
}

function getBitmap(type: ElementStatus) {
  switch (type) {
    case "idle":
      return AssetsLoader.unSeat.bitmap
    default:
      return AssetsLoader.onSeat.bitmap
  }
}

export function drawDragElement(ctx: CanvasRenderingContext2D) {
  const currentDragEl = store.getState('currentDragEl')

  if (currentDragEl) {
    const bitmap = getBitmap(currentDragEl.status)

    const [x, y] = canvasToScreen(currentDragEl.dX, currentDragEl.dY);

    ctx.drawImage(bitmap, x, y, scaleSize(currentDragEl.width), scaleSize(currentDragEl.height))

    drawGroupElementIndex(ctx, currentDragEl, x, y);
  }
}

export function drawGroupBaseElement(ctx: CanvasRenderingContext2D, element: Element, x: number, y: number, width: number, height: number) {

  const bitmap = getBitmap(element.status)

  ctx.drawImage(bitmap, x, y, width, height)

  // 当前拖拽的元素在目标元素范围内提示
  moveInHighlight(ctx, x, y, width, height)

  drawGroupElementIndex(ctx, element, x, y);
}

export function drawGroupElementIndex(ctx: CanvasRenderingContext2D, element: Element, x: number, y: number) {

  const dx = x + scaleSize(element.width / 2)

  setCtxFont(ctx, ELEMENT_NO_COLOR, 'center', 'alphabetic', element.baseFontSize)

  ctx.fillText(String(element.index), dx, y + scaleSize(element.width * .3));

  if (element.status === 'occupy') {
    setCtxFont(ctx, ELEMENT_DESC_COLOR, 'center', 'middle', element.nameFontSize)
    ctx.fillText(OCCUPY_DESC, dx, y + scaleSize(element.height / 2 + 2));
  } else if (element.text) {
    setCtxFont(ctx, ELEMENT_DESC_COLOR, 'center', 'middle', element.nameFontSize)
    ctx.fillText(element.text, dx, y + scaleSize(element.height / 2 + 2));
  }

}

export function createEmptyElement(id: string, group: Group, index: number, x: number, y: number, pos?: [number, number], name?: string): Element {
  return {
    id,
    group_by: group.group_id,
    index,
    x: x,
    y: y,
    isDragging: false,
    dX: 0,
    dY: 0,
    width: ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
    pos,
    text: name || Math.random().toString(36).substr(2, 2),
    status: 'idle',
    baseFontSize: 13,
    nameFontSize: 10,
  }
}

// 删除座位
export function delGroupElement(groupTree: Group, element: Element) {
  const graphicMatrix = store.getState('graphicMatrix')

  Reflect.deleteProperty(graphicMatrix.elements, element.id)

  graphicMatrix.groupElements[groupTree.group_id] = graphicMatrix.groupElements[groupTree.group_id].filter(v => v !== element.id)

  switch (groupTree.type) {
    case "circle":
      updateCircleGroupLayout(groupTree.group_id)
      break
    case "rectangle":
      updateMatrixGroupLayout(groupTree.group_id)
      break
    case "strip":
      updateStripGroupLayout(groupTree.group_id)
      break;

  }
}

export function graphicUtilsInit() {
  store.subscribe('cvs', cvsChange)
}

export function graphicUtilsClear() {
  store.unsubscribe('cvs', cvsChange)
  cvsInstance = null
  canvasRect = null
}
