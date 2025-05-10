import type {Element, Group} from "../graphic.types.ts";
import {ELEMENT_HEIGHT, ELEMENT_WIDTH} from "../constant.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {setCtxFont} from "../graphicUtils.ts";
import AssetsLoader from "../../assetsLoader/assetsLoader.ts";

const BOTTOM_TEXT_HEIGHT = 30;

export const MATRIX_GAP = 10

// 获取初始化矩阵的宽高，后续用来获取放在画布中的位置，得到此组基准位置
export function getMatrixRect(row: number, col: number): [w: number, h: number] {
  return [col * ELEMENT_WIDTH + (col - 1) * MATRIX_GAP + MATRIX_GAP * 3, row * ELEMENT_HEIGHT + (row - 1) * MATRIX_GAP + BOTTOM_TEXT_HEIGHT + MATRIX_GAP * 2];
}

export function fillMatrixElement(groupId: string, row: number, col: number, basicPos: [number, number]): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};
  const [baseX, baseY] = basicPos;
  let index = 1
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      const id = `${groupId}-${y}-${x}`;
      elements[id] = {
        id,
        group_by: groupId,
        index,
        x: baseX + x * ELEMENT_WIDTH + MATRIX_GAP * x + MATRIX_GAP * 1.5,
        y: baseY + y * ELEMENT_HEIGHT + MATRIX_GAP * y + MATRIX_GAP * 1.5,
        width: ELEMENT_WIDTH,
        height: ELEMENT_HEIGHT,
        pos: [y, x],
        text: ''
      }
      index++
    }
  }
  return elements
}

export function drawGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = 'rgb(242, 242, 242)'
  const [x, y] = canvasToScreen(group.x, group.y);
  ctx.fillRect(x, y, scaleSize(group.w), scaleSize(group.h))

  if (group.hover){
    ctx.strokeRect(x, y, scaleSize(group.w), scaleSize(group.h))
  }
}

export function drawGroupName(ctx: CanvasRenderingContext2D, group: Group) {
  setCtxFont(ctx, '#000', 'center')
  const [x, y] = canvasToScreen(group.x + group.w / 2, group.y + group.h - MATRIX_GAP);
  ctx.fillText(`区域名称：${group.group_name}`, x, y);
}

export function drawGroupElement(ctx: CanvasRenderingContext2D, element: Element) {
  const [x, y] = canvasToScreen(element.x, element.y);
  ctx.drawImage(AssetsLoader.unSeat.bitmap, x, y, scaleSize(element.width), scaleSize(element.height))
  // ctx.strokeRect(x, y, scaleSize(element.width), scaleSize(element.height))
}

const INDEX_TEXT_MARGIN = MATRIX_GAP + 5

export function drawGroupElementIndex(ctx: CanvasRenderingContext2D, element: Element) {
  setCtxFont(ctx, '#000', 'center')
  const [x, y] = canvasToScreen(element.x + element.width / 2, element.y + INDEX_TEXT_MARGIN);
  ctx.fillText(String(element.index), x, y);

  if (element.text) {
    setCtxFont(ctx, '#000', 'center', 'middle', 10)
    const [x, y] = canvasToScreen(element.x + element.width / 2, element.y + element.height / 2 + 2);
    ctx.fillText(element.text, x, y);
  }

}
