import {
  CIRCLE_COLOR,
  E_GAP,
  ELEMENT_HEIGHT,
  ELEMENT_WIDTH,
  GROUP_BD_COLOR,
  GROUP_BG_COLOR, GROUP_GAP, GROUP_HOVER_BD_COLOR, GROUP_NAME_COLOR,
  MATRIX_GAP
} from "../constant";
import type {Element, Group, IncreaseElementPos, POS, StripPos} from "../graphic.types";
import {canvasToScreen, scaleSize} from "../../transform/transform";
import {drawGroupBaseElement, setCtxFont} from "../graphicUtils";
import RuntimeStore, {rebuildGroupTree} from "../../runtimeStore/runtimeStore";
import {generateUuid} from "../../utils/common";

const store = RuntimeStore.getInstance();

export function getStripRect(shortNum: number, longNum: number) {
  const row = longNum + 2;
  const col = shortNum + 2;

  const w = col * ELEMENT_WIDTH + (col - 1) * MATRIX_GAP + GROUP_GAP
  const h = row * ELEMENT_HEIGHT + (row - 1) * MATRIX_GAP + GROUP_GAP

  return [w, h];
}

function createEmptyElement(id: string, groupId: string, index: number, gX: number, gY: number, pos: StripPos, i: number, name?: string): Element {
  return {
    id,
    group_by: groupId,
    index,
    index1: 0,
    x: gX,
    y: gY,
    isDragging: false,
    dX: 0,
    dY: 0,
    width: ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
    strip: {
      pos: pos,
      idx: i,
    },
    // text: name || Math.random().toString(36).substr(2, 2),
    text: name || '',
    status: 'idle',
    baseFontSize: 13,
    nameFontSize: 10,
  }
}

export function fillStripElement(groupId: string, shortNum: number, longNum: number): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};

  // shortNum -> 上下, longNum -> 左右

  // 上
  let index = 1
  const tBasicY = E_GAP
  for (let i = 0; i < shortNum; i++) {
    const id = `${groupId}-top-${i}`;
    const gX = ELEMENT_WIDTH + MATRIX_GAP + i * ELEMENT_WIDTH + MATRIX_GAP * i + E_GAP
    const gY = tBasicY
    elements[id] = createEmptyElement(id, groupId, index, gX, gY, 'top', i)
    index++
  }
  // 右
  const rBasicX = elements[`${groupId}-top-${shortNum - 1}`].x + ELEMENT_WIDTH + MATRIX_GAP
  for (let i = 0; i < longNum; i++) {
    const id = `${groupId}-right-${i}`;
    const gX = rBasicX
    const gY = ELEMENT_HEIGHT + MATRIX_GAP + i * ELEMENT_HEIGHT + MATRIX_GAP * i + E_GAP
    elements[id] = createEmptyElement(id, groupId, index, gX, gY, 'right', i)
    index++
  }
  // 下
  const bBasicY = elements[`${groupId}-right-${longNum - 1}`].y + ELEMENT_WIDTH + MATRIX_GAP
  for (let i = shortNum; i > 0; i--) {
    const id = `${groupId}-bottom-${i}`;
    const gX = i * ELEMENT_WIDTH + MATRIX_GAP * i + E_GAP
    const gY = bBasicY
    elements[id] = createEmptyElement(id, groupId, index, gX, gY, 'bottom', i)
    index++
  }
  // 左
  const lBasicX = E_GAP
  for (let i = longNum; i > 0; i--) {
    const id = `${groupId}-left-${i}`;
    const gX = lBasicX
    const gY = i * ELEMENT_HEIGHT + MATRIX_GAP * i + E_GAP
    elements[id] = createEmptyElement(id, groupId, index, gX, gY, 'left', i)
    index++
  }

  return elements
}

export function drawStripGroup(ctx: CanvasRenderingContext2D, group: Group, transformation = true) {
  ctx.fillStyle = GROUP_BG_COLOR
  const [x, y] = canvasToScreen(group.x, group.y);
  const w = scaleSize(group.w)
  const h = scaleSize(group.h)

  ctx.fillRect(x, y, w, h)

  // ctx.lineWidth = scaleSize(1);

  ctx.strokeStyle = GROUP_BD_COLOR;

  // 空区域
  drawStripGroupEmptyRegion(ctx, x, y, w, h, transformation)

  if (group.hover) {
    ctx.strokeStyle = GROUP_HOVER_BD_COLOR;
  }

  ctx.strokeRect(x, y, w, h)

  drawGroupName(ctx, group, x, y, w, h)
}

function drawStripGroupEmptyRegion(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, transformation = true) {
  const elRect = transformation ? scaleSize(ELEMENT_WIDTH + GROUP_GAP) : ELEMENT_WIDTH + GROUP_GAP
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

function drawGroupName(ctx: CanvasRenderingContext2D, group: Group, x: number, y: number, w: number, h: number) {
  const centerOfAStripPos: POS = {
    x: x + w / 2,
    y: y + h / 2,
  }
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center', 'middle', group.baseFontSize)
  if (group.group_set_id){
    ctx.fillText(`${group.group_set_name}`, centerOfAStripPos.x, centerOfAStripPos.y - scaleSize(group.baseFontSize) / 2);
    ctx.fillText(`${group.group_name}`, centerOfAStripPos.x, centerOfAStripPos.y + scaleSize(group.baseFontSize));
  } else {
    ctx.fillText(`${group.group_name}`, centerOfAStripPos.x, centerOfAStripPos.y);
  }
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

    drawGroupBaseElement(ctx, element, x, y, width, height, group.index_rule)
  }
}

function reindexStrips(elements: Element[]) {
  // 按 pos 分组
  const grouped: Record<StripPos, Element[]> = {
    top: [],
    right: [],
    bottom: [],
    left: [],
  };

  for (const el of elements) {
    grouped[el.strip!.pos].push(el);
  }

  // 对每组重新编号
  for (const pos of Object.keys(grouped) as StripPos[]) {
    const group: Element[] = grouped[pos];
    group.sort((a, b) => a.strip!.idx - b.strip!.idx); // 保留原始顺序
    group.forEach((el, newIdx) => {
      el.strip!.idx = newIdx;
    });
  }
}

export function addStripGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number) {
  const referenceEl = store.getGraphicGroupElementById(element.id)
  if (!referenceEl) return
  const referenceElIdx = referenceEl.strip!.idx
  const graphicMatrix = store.getState('graphicMatrix')

  const allElements = store.getGraphicGroupElementsById(groupTree.group_id)

  // 更新基准元素同一方向的所有元素
  for (const el of allElements) {
    if (el.strip!.pos === referenceEl.strip!.pos) {
      switch (type) {
        // 0，1，2
        // 0，3，4
        case "before": // 向前插入将基准元素以及后续元素 idx + num
          if (el.strip!.idx >= referenceElIdx)
            el.strip!.idx = el.strip!.idx + num
          break
        case "after": // 向后插入将基准元素的后续元素idx + num
          if (el.strip!.idx > referenceElIdx)
            el.strip!.idx = el.strip!.idx + num
          break
      }
    }
  }

  const newElements: Element[] = []
  const elementMap: {
    [s: string]: Element,
  } = {}

  for (let i = 1; i <= num; i++) {
    const id = generateUuid();
    let idx: number = 0
    let pos: StripPos = referenceEl.strip!.pos
    switch (type) {
      case "before":
        idx = referenceEl.strip!.idx - i
        break
      case "after":
        idx = referenceEl.strip!.idx + i
        break
    }
    newElements.push(createEmptyElement(id, groupTree.group_id, 0, 0, 0, pos, idx, `测试${i}`))
  }

  graphicMatrix.elements = {
    ...graphicMatrix.elements,
    ...newElements.reduce((acc, item: Element) => {
      acc[item.id] = item;
      return acc;
    }, elementMap),
  }

  graphicMatrix.groupElements[groupTree.group_id] = [...graphicMatrix.groupElements[groupTree.group_id], ...newElements.map(v => v.id)]

  updateStripGroupLayout(groupTree.group_id)
}

export function updateStripGroupLayout(groupId: string) {
  const group = store.getGraphicGroupsById(groupId)
  if (!group) return
  const elements = store.getGraphicGroupElementsById(groupId)
  const elementLen = elements.length;

  // 获取最长 上下 左右
  const sideLen: Record<StripPos, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  reindexStrips(elements)

  for (const el of elements) {
    switch (el.strip!.pos) {
      case "top":
        sideLen.top++
        break
      case "right":
        sideLen.right++
        break
      case "bottom":
        sideLen.bottom++
        break
      case "left":
        sideLen.left++
        break
    }
  }

  const tMax = Math.max(sideLen.top, sideLen.bottom, 1)
  const lMax = Math.max(sideLen.left, sideLen.right, 1)
  const [w, h] = getStripRect(tMax, lMax)

  group.w = w
  group.h = h
  group.size = elementLen

  let index = 1
  for (const el of elements.filter(v => v.strip!.pos === 'top').sort((a, b) => a.strip!.idx - b.strip!.idx)) {
    const base = tMax - sideLen.top
    const gX = base * ((ELEMENT_WIDTH + MATRIX_GAP) / 2) + ELEMENT_WIDTH + MATRIX_GAP + el.strip!.idx * ELEMENT_WIDTH + MATRIX_GAP * el.strip!.idx + E_GAP
    const gY = E_GAP
    el.x = gX
    el.y = gY
    el.index = index
    index++
  }
  for (const el of elements.filter(v => v.strip!.pos === 'right').sort((a, b) => a.strip!.idx - b.strip!.idx)) {
    const base = lMax - sideLen.right
    const rBasicX = ELEMENT_WIDTH + MATRIX_GAP + tMax * ELEMENT_WIDTH + MATRIX_GAP * tMax + E_GAP
    const gX = rBasicX
    const gY = base * ((ELEMENT_HEIGHT + MATRIX_GAP) / 2) + ELEMENT_HEIGHT + MATRIX_GAP + el.strip!.idx * ELEMENT_HEIGHT + MATRIX_GAP * el.strip!.idx + E_GAP
    el.x = gX
    el.y = gY
    el.index = index
    index++
  }
  for (const el of elements.filter(v => v.strip!.pos === 'bottom').sort((a, b) => a.strip!.idx - b.strip!.idx)) {
    const bBasicY = ELEMENT_HEIGHT + MATRIX_GAP + lMax * ELEMENT_HEIGHT + MATRIX_GAP * lMax + E_GAP
    const base = tMax - sideLen.bottom
    const gX = base * ((ELEMENT_WIDTH + MATRIX_GAP) / 2) + ELEMENT_WIDTH + MATRIX_GAP + el.strip!.idx * ELEMENT_WIDTH + MATRIX_GAP * el.strip!.idx + E_GAP
    const gY = bBasicY
    el.x = gX
    el.y = gY
    el.index = index
    index++
  }
  for (const el of elements.filter(v => v.strip!.pos === 'left').sort((a, b) => a.strip!.idx - b.strip!.idx)) {
    const base = lMax - sideLen.left
    const gX = E_GAP
    const gY = base * ((ELEMENT_HEIGHT + MATRIX_GAP) / 2) + ELEMENT_HEIGHT + MATRIX_GAP + el.strip!.idx * ELEMENT_HEIGHT + MATRIX_GAP * el.strip!.idx + E_GAP
    el.x = gX
    el.y = gY
    el.index = index
    index++
  }

  rebuildGroupTree(store)
}
