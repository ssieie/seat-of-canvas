import {
  CIRCLE_COLOR,
  E_GAP, ELEMENT_DESC_COLOR,
  ELEMENT_HEIGHT, ELEMENT_NO_COLOR,
  ELEMENT_WIDTH,
  GROUP_BD_COLOR,
  GROUP_BG_COLOR, GROUP_GAP, GROUP_HOVER_BD_COLOR, GROUP_NAME_COLOR, INDEX_TEXT_MARGIN,
  MATRIX_GAP
} from "../constant.ts";
import type {Element, Group} from "../graphic.types.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {moveInHighlight, setCtxFont} from "../graphicUtils.ts";
import AssetsLoader from "../../assetsLoader/assetsLoader.ts";

function getMatrixPoints(a: number, b: number): Map<string, boolean> {
  const points = new Map<string, boolean>();

  // 左边竖列
  for (let y = 1; y <= a; y++) {
    points.set(`${0},${y}`, true);
  }

  // 右边竖列
  for (let y = 1; y <= a; y++) {
    points.set(`${b + 1},${y}`, true);
  }

  // 上边横行
  for (let x = 1; x <= b; x++) {
    points.set(`${x},${0}`, true);
  }

  // 下边横行
  for (let x = 1; x <= b; x++) {
    points.set(`${x},${a + 1}`, true);
  }

  return points;
}

export function getStripRect(shortNum: number, longNum: number) {
  const row = longNum + 2;
  const col = shortNum + 2;
  return [col * ELEMENT_WIDTH + (col - 1) * MATRIX_GAP + GROUP_GAP, row * ELEMENT_HEIGHT + (row - 1) * MATRIX_GAP + GROUP_GAP];
}

export function fillStripElement(groupId: string, shortNum: number, longNum: number): {
  [s: string]: Element,
} {
  const row = shortNum + 2;
  const col = longNum + 2;
  const elements: {
    [s: string]: Element,
  } = {};
  const realPoint = getMatrixPoints(shortNum, longNum)
  let index = 1
  for (let y = 0; y <= col; y++) {
    for (let x = 0; x <= row; x++) {
      if (realPoint.has(`${y},${x}`)) {
        const id = `${groupId}-${y}-${x}`;
        const gX = x * ELEMENT_WIDTH + MATRIX_GAP * x + E_GAP
        const gY = y * ELEMENT_HEIGHT + MATRIX_GAP * y + E_GAP
        elements[id] = {
          id,
          group_by: groupId,
          index,
          x: gX,
          y: gY,
          isDragging: false,
          dX: 0,
          dY: 0,
          width: ELEMENT_WIDTH,
          height: ELEMENT_HEIGHT,
          pos: [y, x],
          text: Math.random().toString(36).substr(2, 2)
        }
        index++
      }
    }
  }
  return elements
}

export function drawStripGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = GROUP_BG_COLOR
  const [x, y] = canvasToScreen(group.x, group.y);
  const w = scaleSize(group.w)
  const h = scaleSize(group.h)

  ctx.fillRect(x, y, w, h)

  // ctx.lineWidth = scaleSize(1);

  ctx.strokeStyle = GROUP_BD_COLOR;

  // 空区域
  drawStripGroupEmptyRegion(ctx, x, y, w, h)

  if (group.hover) {
    ctx.strokeStyle = GROUP_HOVER_BD_COLOR;
  }

  ctx.strokeRect(x, y, w, h)

  drawGroupName(ctx, group.group_name, x, y, w, h)
}

function drawStripGroupEmptyRegion(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const elRect = scaleSize(ELEMENT_WIDTH + GROUP_GAP)
  const eRect = {
    x: x + elRect,
    y: y + elRect,
    w: w - elRect * 2,
    h: h - elRect * 2,
  }
  ctx.beginPath();
  ctx.strokeRect(eRect.x, eRect.y, eRect.w, eRect.h);
  ctx.fillStyle = CIRCLE_COLOR
  ctx.fillRect(eRect.x, eRect.y, eRect.w, eRect.h)
}

function drawGroupName(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center', 'middle')
  ctx.fillText(`${name}`, x + w / 2, y + h / 2);
}

export function stripElementPosInGroup(group: Group, element: Element) {
  return {
    x: group.x + element.x,
    y: group.y + element.y
  }
}

export function drawGroupStripElement(ctx: CanvasRenderingContext2D, element: Element, group: Group) {

  if (!element.isDragging) {
    const pos = stripElementPosInGroup(group, element)
    const [x, y] = canvasToScreen(pos.x, pos.y);

    const width = scaleSize(element.width)
    const height = scaleSize(element.height)
    ctx.drawImage(AssetsLoader.unSeat.bitmap, x, y, width, height)

    // 当前拖拽的元素在目标元素范围内提示
    moveInHighlight(ctx, x, y, width, height)

    drawGroupElementIndex(ctx, element, x, y);
  }
}


function drawGroupElementIndex(ctx: CanvasRenderingContext2D, element: Element, x: number, y: number) {

  const dx = x + scaleSize(element.width / 2)

  setCtxFont(ctx, ELEMENT_NO_COLOR, 'center')

  ctx.fillText(String(element.index), dx, y + scaleSize(INDEX_TEXT_MARGIN));

  if (element.text) {
    setCtxFont(ctx, ELEMENT_DESC_COLOR, 'center', 'middle', 10)
    ctx.fillText(element.text, dx, y + scaleSize(element.height / 2 + 2));
  }

}
