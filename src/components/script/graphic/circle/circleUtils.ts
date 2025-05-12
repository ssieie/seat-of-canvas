// 获取新建组的宽高
import {
  CIRCLE_COLOR, ELEMENT_DESC_COLOR, ELEMENT_HEIGHT, ELEMENT_MOVE_IN_BD_COLOR, ELEMENT_NO_COLOR,
  ELEMENT_WIDTH,
  GROUP_BD_COLOR,
  GROUP_BG_COLOR,
  GROUP_HOVER_BD_COLOR,
  GROUP_NAME_COLOR,
  MATRIX_GAP
} from "../constant.ts";
import type {Element, Group} from "../graphic.types.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {setCtxFont} from "../graphicUtils.ts";
import AssetsLoader from "../../assetsLoader/assetsLoader.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";

const store = RuntimeStore.getInstance();

const CIRCLE_DISTANCE = ELEMENT_WIDTH + MATRIX_GAP * 2
const ELE_DISTANCE = 40

export function getCircleRect(num: number) {

  const elementArcLength = ELEMENT_WIDTH + MATRIX_GAP;

  // 圆周长度
  const radius = Math.max((num * elementArcLength) / (2 * Math.PI), 50); // 最小半径

  const rW = (radius + CIRCLE_DISTANCE) * 2

  return {
    radius,
    w: rW,
    h: rW
  }
}

export function fillCircleElement(group: Group): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};

  for (let i = 1; i <= group.size; i++) {
    const angle = (2 * Math.PI * i) / group.size;
    const x = (group.radius! + ELE_DISTANCE) * Math.cos(angle) - ELEMENT_WIDTH / 2;
    const y = (group.radius! + ELE_DISTANCE) * Math.sin(angle) - ELEMENT_HEIGHT / 2;

    const id = `${group.group_id}-${i}`;
    elements[id] = {
      id,
      group_by: group.group_id,
      index: i,
      x: x,
      y: y,
      isDragging: false,
      dX: 0,
      dY: 0,
      width: ELEMENT_WIDTH,
      height: ELEMENT_HEIGHT,
      text: Math.random().toString(36).substr(2, 2)
    }
  }

  return elements
}

export function drawCircleGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = GROUP_BG_COLOR
  const [x, y] = canvasToScreen(group.x, group.y);
  const w = scaleSize(group.w)
  const h = scaleSize(group.h)
  const radius = scaleSize(group.radius!)

  ctx.fillRect(x, y, w, h)

  ctx.lineWidth = scaleSize(1);

  ctx.strokeStyle = GROUP_BD_COLOR;

  // 中心圆
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, radius, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.fillStyle = CIRCLE_COLOR
  ctx.fill();

  if (group.hover) {
    ctx.strokeStyle = GROUP_HOVER_BD_COLOR;
  }

  ctx.strokeRect(x, y, w, h)

  // 名字文本A
  drawGroupName(ctx, group.group_name, x, y, w, h)

}

export function drawGroupName(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center', 'middle')
  ctx.fillText(`${name}`, x + w / 2, y + h / 2);
}

export function circleElementPosInGroup(group: Group, element: Element) {
  return {
    x: group.x + element.x + group.w / 2,
    y: group.y + element.y + group.h / 2
  }
}

export function drawGroupCircleElement(ctx: CanvasRenderingContext2D, element: Element, group: Group) {

  if (!element.isDragging) {
    const width = scaleSize(element.width)
    const height = scaleSize(element.height)
    const pos = circleElementPosInGroup(group, element)
    const [x, y] = canvasToScreen(pos.x, pos.y);

    ctx.drawImage(AssetsLoader.unSeat.bitmap, x, y, width, height)


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
        ctx.lineWidth = scaleSize(1);
        ctx.strokeStyle = ELEMENT_MOVE_IN_BD_COLOR;
        ctx.strokeRect(x, y, width, height)
      }
    }

    drawGroupElementIndex(ctx, element, x, y);
  }
}

const INDEX_TEXT_MARGIN = MATRIX_GAP + 5

function drawGroupElementIndex(ctx: CanvasRenderingContext2D, element: Element, x: number, y: number) {

  const dx = x + scaleSize(element.width / 2)

  setCtxFont(ctx, ELEMENT_NO_COLOR, 'center')

  ctx.fillText(String(element.index), dx, y + scaleSize(INDEX_TEXT_MARGIN));

  if (element.text) {
    setCtxFont(ctx, ELEMENT_DESC_COLOR, 'center', 'middle', 10)
    ctx.fillText(element.text, dx, y + scaleSize(element.height / 2 + 2));
  }

}

