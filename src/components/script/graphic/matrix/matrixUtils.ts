import type {Element, Group} from "../graphic.types.ts";
import {
  BOTTOM_TEXT_HEIGHT,
  E_GAP, ELEMENT_DESC_COLOR,
  ELEMENT_HEIGHT, ELEMENT_NO_COLOR,
  ELEMENT_WIDTH, GROUP_BD_COLOR, GROUP_BG_COLOR, GROUP_GAP, GROUP_HOVER_BD_COLOR, GROUP_NAME_COLOR, INDEX_TEXT_MARGIN,
  MATRIX_GAP
} from "../constant.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {moveInHighlight, setCtxFont} from "../graphicUtils.ts";
import AssetsLoader from "../../assetsLoader/assetsLoader.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";

const store = RuntimeStore.getInstance();

// 获取初始化矩阵的宽高，后续用来获取放在画布中的位置，得到此组基准位置
export function getMatrixRect(row: number, col: number): [w: number, h: number] {
  return [col * ELEMENT_WIDTH + (col - 1) * MATRIX_GAP + GROUP_GAP, row * ELEMENT_HEIGHT + (row - 1) * MATRIX_GAP + BOTTOM_TEXT_HEIGHT + MATRIX_GAP * 2];
}

export function fillMatrixElement(groupId: string, row: number, col: number): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};
  let index = 1
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
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
  // console.log(buildMatrixFromElements(Object.values(elements)))
  return elements
}

// function buildMatrixFromElements(elements: Element[]): Element[][] {
//   const matrix: Element[][] = []
//   for (const el of elements) {
//     const [y, x] = el.pos!;
//     if (!matrix[y]) matrix[y] = []
//     matrix[y][x] = el
//   }
//   return matrix
// }

export function drawMatrixGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = GROUP_BG_COLOR
  const [x, y] = canvasToScreen(group.x, group.y);
  const w = scaleSize(group.w)
  const h = scaleSize(group.h)

  ctx.fillRect(x, y, w, h)

  ctx.lineWidth = scaleSize(1);

  ctx.strokeStyle = GROUP_BD_COLOR;

  if (group.hover) {
    ctx.strokeStyle = GROUP_HOVER_BD_COLOR;
  }

  ctx.strokeRect(x, y, w, h)

  drawGroupName(ctx, group.group_name, x, y, w, h)
}

function drawGroupName(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center')
  ctx.fillText(`区域名称：${name}`, x + w / 2, y + h - scaleSize(MATRIX_GAP));
}

export function drawDragElement(ctx: CanvasRenderingContext2D) {
  const currentDragEl = store.getState('currentDragEl')

  if (currentDragEl) {

    const [x, y] = canvasToScreen(currentDragEl.dX, currentDragEl.dY);

    ctx.drawImage(AssetsLoader.unSeat.bitmap, x, y, scaleSize(currentDragEl.width), scaleSize(currentDragEl.height))

    drawGroupElementIndex(ctx, currentDragEl, x, y);
  }
}

export function matrixElementPosInGroup(group: Group, element: Element) {
  return {
    x: group.x + element.x,
    y: group.y + element.y
  }
}

export function drawGroupMatrixElement(ctx: CanvasRenderingContext2D, element: Element, group: Group) {

  if (!element.isDragging) {
    const pos = matrixElementPosInGroup(group, element)
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
