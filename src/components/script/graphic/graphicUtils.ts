import {getTransformState, scaleSize} from "../transform/transform.ts";
import RuntimeStore, {allGraphicGroups} from "../runtimeStore/runtimeStore.ts";
import type {Group, GroupType} from "./graphic.types.ts";

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
export function getBasicPos(w: number, h: number, cvs: HTMLCanvasElement): [number, number] {
  const {scale, offsetX, offsetY} = getTransformState();
  // 屏幕转换后的宽
  const screenW = cvs.width / scale;
  // 已存在的所有组
  const allGraphicGroups = getGraphicGroups();

  // 屏幕 (0, 0) 映射到画布逻辑坐标的起始点
  const startX = -offsetX / scale;
  const startY = -offsetY / scale;
  const xBoundary = startX + screenW - w;
  const step = 10; // 步进像素

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
