import type {Element, Group} from "../graphic.types.ts";
import {ELEMENT_HEIGHT, ELEMENT_WIDTH} from "../constant.ts";
import {originToScreen, scaleSize} from "../../transform/transform.ts";

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
  let index = 0
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
        pos: [y, x]
      }
      index++
    }
  }
  return elements
}

export function drawGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = 'rgb(242, 242, 242)'
  const screen = originToScreen(group.x, group.y);
  ctx.fillRect(screen.x, screen.y, scaleSize(group.width), scaleSize(group.height))
}

export function drawGroupName(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.font = `${scaleSize(13)}px Arial`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  const textScreen = originToScreen(group.x + group.width / 2, group.y + group.height - MATRIX_GAP);
  ctx.fillText(`区域名称：${group.group_name}`, textScreen.x, textScreen.y);
}

export function drawGroupElement(ctx: CanvasRenderingContext2D, element: Element) {
  ctx.strokeStyle = 'red'
  const screen = originToScreen(element.x, element.y);
  ctx.strokeRect(screen.x, screen.y, scaleSize(element.width), scaleSize(element.height))
}

export function drawGroupElementIndex(ctx: CanvasRenderingContext2D, element: Element) {
  ctx.font = `${scaleSize(13)}px Arial`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  const textScreen = originToScreen(element.x + element.width / 2, element.y + MATRIX_GAP);
  ctx.fillText(String(element.index), textScreen.x, textScreen.y);
}
