// 获取新建组的宽高
import {
  ELEMENT_WIDTH,
  GROUP_BD_COLOR,
  GROUP_BG_COLOR,
  GROUP_HOVER_BD_COLOR,
  GROUP_NAME_COLOR,
  MATRIX_GAP
} from "../constant.ts";
import type {Group} from "../graphic.types.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {setCtxFont} from "../graphicUtils.ts";

const CIRCLE_DISTANCE = ELEMENT_WIDTH + MATRIX_GAP * 2

export function getCircleRect(num: number) {

  const elementArcLength = 2 * ELEMENT_WIDTH + MATRIX_GAP;

  // 圆周长度
  const radius = Math.max((num * elementArcLength) / (2 * Math.PI), 100); // 保证最小半径不小于100

  const rW = (radius + CIRCLE_DISTANCE) * 2

  return {
    radius,
    w: rW,
    h: rW
  }
}

export function drawCircleGroup(ctx: CanvasRenderingContext2D, group: Group) {
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

export function drawGroupName(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center')
  ctx.fillText(`${name}`, x + w / 2, y + h / 2);
}
