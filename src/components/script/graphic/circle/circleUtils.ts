// 获取新建组的宽高
import {
  CIRCLE_COLOR, ELEMENT_HEIGHT,
  ELEMENT_WIDTH,
  GROUP_BD_COLOR,
  GROUP_BG_COLOR,
  GROUP_HOVER_BD_COLOR,
  GROUP_NAME_COLOR,
  MATRIX_GAP
} from "../constant.ts";
import type {Element, Group, IncreaseElementPos, POS} from "../graphic.types.ts";
import {canvasToScreen, scaleSize} from "../../transform/transform.ts";
import {createEmptyElement, drawGroupBaseElement, setCtxFont} from "../graphicUtils.ts";
import RuntimeStore, {rebuildGroupTree} from "../../runtimeStore/runtimeStore.ts";
import {generateUuid} from "../../utils/common.ts";

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

function getCircleElementXy(group: Group, i: number) {
  const angle = (2 * Math.PI * i) / group.size - Math.PI / 2;
  const x = (group.radius! + ELE_DISTANCE) * Math.cos(angle) - ELEMENT_WIDTH / 2;
  const y = (group.radius! + ELE_DISTANCE) * Math.sin(angle) - ELEMENT_HEIGHT / 2;
  return [x, y]
}

export function fillCircleElement(group: Group): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};

  for (let i = 0; i < group.size; i++) {
    // const angle = (2 * Math.PI * i) / group.size;
    const [x, y] = getCircleElementXy(group, i)
    const id = `${group.group_id}-${i}`;
    elements[id] = createEmptyElement(id, group, i + 1, x, y)
  }

  return elements
}

export function addCircleGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number) {
  const graphicMatrix = store.getState('graphicMatrix')

  const oldElementIds = store.getGraphicGroupElementsById(groupTree.group_id)
  // 可能有移动元素，重新获取最新按index排序
  const newElementIds = oldElementIds.sort((a, b) => a.index - b.index).map(v => v.id)
  const elements: Element[] = []

  for (let i = 0; i < num; i++) {
    const id = generateUuid();
    elements.push(createEmptyElement(id, groupTree, 0, 0, 0, undefined, `测试新增${i}`))
  }

  const targetIdx = newElementIds.indexOf(element.id)

  newElementIds.splice(type === 'before' ? targetIdx : targetIdx + 1, 0, ...elements.map(v => v.id))

  const elementMap: {
    [s: string]: Element,
  } = {}

  graphicMatrix.elements = {
    ...graphicMatrix.elements,
    ...elements.reduce((acc, item: Element) => {
      acc[item.id] = item;
      return acc;
    }, elementMap),
  }

  graphicMatrix.groupElements[groupTree.group_id] = newElementIds

  updateCircleGroupLayout(groupTree.group_id)
}

export function updateCircleGroupLayout(groupId: string) {
  const group = store.getGraphicGroupsById(groupId)
  if (!group) return
  const elements = store.getGraphicGroupElementsById(groupId)
  const elementLen = elements.length;
  const {radius, w, h} = getCircleRect(elementLen)
  group.w = w
  group.h = h
  group.radius = radius
  group.size = elementLen

  for (let i = 0; i < group.size; i++) {
    const [x, y] = getCircleElementXy(group, i)
    elements[i].x = x
    elements[i].y = y
    elements[i].index = i + 1
  }

  rebuildGroupTree(store)
}

export function drawCircleGroup(ctx: CanvasRenderingContext2D, group: Group) {
  ctx.fillStyle = GROUP_BG_COLOR
  const [x, y] = canvasToScreen(group.x, group.y);
  const w = scaleSize(group.w)
  const h = scaleSize(group.h)
  const radius = scaleSize(group.radius!)

  const centerOfACirclePos: POS = {
    x: x + w / 2,
    y: y + h / 2,
  }

  ctx.fillRect(x, y, w, h)

  // ctx.lineWidth = scaleSize(1);

  ctx.strokeStyle = GROUP_BD_COLOR;

  // 中心圆
  ctx.beginPath();
  ctx.arc(centerOfACirclePos.x, centerOfACirclePos.y, radius, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.fillStyle = CIRCLE_COLOR
  ctx.fill();

  if (group.hover) {
    ctx.strokeStyle = GROUP_HOVER_BD_COLOR;
  }

  ctx.strokeRect(x, y, w, h)

  // 名字文本A
  drawGroupName(ctx, group, centerOfACirclePos)

}

export function drawGroupName(ctx: CanvasRenderingContext2D, group: Group, centerOfACirclePos: POS) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center', 'middle', group.baseFontSize)
  ctx.fillText(`${group.group_name}`, centerOfACirclePos.x, centerOfACirclePos.y);
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

    drawGroupBaseElement(ctx, element, x, y, width, height)
  }
}

