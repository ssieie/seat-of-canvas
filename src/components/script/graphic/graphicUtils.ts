import {getCanvas, getTransformState, scaleSize} from "../transform/transform.ts";
import RuntimeStore, {allGraphicGroups} from "../runtimeStore/runtimeStore.ts";
import type {Element, Group, GroupType} from "./graphic.types.ts";
import {didNotHitAnyElement, hitElement} from "../eventCenter/tool/hitTargetDetection.ts";
import {swapElement, swapInArrayFlexible} from "../utils/common.ts";

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
  const xBoundary = startX + screenW - w;
  const step = 10; // 步进像素

  if (startX > xBoundary){
    throw new Error("当前形状超出画布大小,缩小画布后添加");
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

export function graphicUtilsInit() {
  store.subscribe('cvs', cvsChange)
}

export function graphicUtilsClear() {
  store.unsubscribe('cvs', cvsChange)
  cvsInstance = null
  canvasRect = null
}
