import type {Element, Group, IncreaseElementPos} from "../graphic.types";
import {
  BOTTOM_TEXT_HEIGHT,
  E_GAP,
  ELEMENT_HEIGHT,
  ELEMENT_WIDTH, GROUP_BD_COLOR, GROUP_BG_COLOR, GROUP_GAP, GROUP_HOVER_BD_COLOR, GROUP_NAME_COLOR,
  MATRIX_GAP
} from "../constant";
import {canvasToScreen, scaleSize} from "../../transform/transform";
import {createEmptyElement, drawGroupBaseElement, setCtxFont} from "../graphicUtils";
import RuntimeStore, {rebuildGroupTree} from "../../runtimeStore/runtimeStore";
import {generateUuid} from "../../utils/common";

const store = RuntimeStore.getInstance();

// 获取初始化矩阵的宽高，后续用来获取放在画布中的位置，得到此组基准位置
export function getMatrixRect(row: number, col: number): [w: number, h: number] {
  const w = col * ELEMENT_WIDTH + (col - 1) * MATRIX_GAP + GROUP_GAP
  const h = row * ELEMENT_HEIGHT + (row - 1) * MATRIX_GAP + BOTTOM_TEXT_HEIGHT + MATRIX_GAP * 2
  return [w, h];
}

function getMatrixElementPos(x: number, y: number, offset?: { logicalColCount: number, fullRow: number }) {
  // offset 为非初始化布局，需获取元素计算x偏移。查看当前行是否满列，否则应用x偏移

  let gX = 0;
  if (offset && offset.fullRow !== 0) {
    // 该行不是满列，居中显示
    const {logicalColCount, fullRow} = offset;

    // 计算满列宽度
    const totalRowWidth = logicalColCount * ELEMENT_WIDTH + (logicalColCount - 1) * MATRIX_GAP;

    // 当前行元素实际宽度
    const currentRowWidth = fullRow * ELEMENT_WIDTH + (fullRow - 1) * MATRIX_GAP;

    // 左边空出来的部分
    const offsetX = (totalRowWidth - currentRowWidth) / 2;

    gX = offsetX + x * ELEMENT_WIDTH + x * MATRIX_GAP + E_GAP;
  } else {
    gX = x * ELEMENT_WIDTH + MATRIX_GAP * x + E_GAP
  }
  const gY = y * ELEMENT_HEIGHT + MATRIX_GAP * y + E_GAP
  return {
    gX,
    gY
  }
}

export function fillMatrixElement(groupId: string, row: number, col: number, oId?: string): {
  [s: string]: Element,
} {
  const elements: {
    [s: string]: Element,
  } = {};
  let index = 1
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      const id = oId || `${groupId}-${y}-${x}`;
      const {gX, gY} = getMatrixElementPos(x, y)
      elements[id] = {
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
        pos: [y, x],
        // text: Math.random().toString(36).substr(2, 2),
        text: '',
        status: 'idle',
        baseFontSize: 13,
        nameFontSize: 10,
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

export function drawMatrixGroup(ctx: CanvasRenderingContext2D, group: Group, transformation = true) {
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

  drawGroupName(ctx, group, x, y, w, h, transformation)
}

function drawGroupName(ctx: CanvasRenderingContext2D, group: Group, x: number, y: number, w: number, h: number, transformation = true) {
  setCtxFont(ctx, GROUP_NAME_COLOR, 'center', 'alphabetic', group.baseFontSize)
  ctx.fillText(`区域名称：${group.group_name}`, x + w / 2, y + h - (transformation ? scaleSize(MATRIX_GAP) : MATRIX_GAP));
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
    const [x, y] = canvasToScreen(pos.x, pos.y)

    const width = scaleSize(element.width)
    const height = scaleSize(element.height)

    drawGroupBaseElement(ctx, element, x, y, width, height, group.index_rule)
  }
}

export function addMatrixGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number) {
  const referenceEl = store.getGraphicGroupElementById(element.id)
  if (!referenceEl) return

  const graphicMatrix = store.getState('graphicMatrix')

  const allElements = store.getGraphicGroupElementsById(groupTree.group_id)

  // 更新基准元素同一行的所有元素
  for (const el of allElements) {
    if (el.pos![0] === referenceEl.pos![0]) {
      switch (type) {
        case "before": // 向前插入将基准元素以及后续元素[x,y] y + num
          if (el.pos![1] >= referenceEl.pos![1])
            el.pos![1] = el.pos![1] + num
          break
        case "after": // 向后插入将基准元素的后续元素[x,y] y + num
          if (el.pos![1] > referenceEl.pos![1])
            el.pos![1] = el.pos![1] + num
          break
      }
    }
  }

  const newElements: Element[] = []
  const elementMap: {
    [s: string]: Element,
  } = {}

  // 00 01 02
  // 00 01 02

  for (let i = 1; i <= num; i++) {
    const id = generateUuid();
    let pos: [number, number] = [0, 0]
    switch (type) {
      case "before":
        pos = [referenceEl.pos![0], referenceEl.pos![1] - i]
        break
      case "after":
        pos = [referenceEl.pos![0], referenceEl.pos![1] + i]
        break
    }
    newElements.push(createEmptyElement(id, groupTree, 0, 0, 0, pos, ``))
  }

  graphicMatrix.elements = {
    ...graphicMatrix.elements,
    ...newElements.reduce((acc, item: Element) => {
      acc[item.id] = item;
      return acc;
    }, elementMap),
  }

  graphicMatrix.groupElements[groupTree.group_id] = [...graphicMatrix.groupElements[groupTree.group_id], ...newElements.map(v => v.id)]

  updateMatrixGroupLayout(groupTree.group_id)
}

// 中间到两边的编号填充
export function fillElementIndexOfRule2(elements: Record<string, Element>) {
  const rowsMap = new Map<number, Element[]>();

  // 按行聚合元素
  Object.values(elements).forEach(el => {
    const row = el.pos?.[0];
    if (row == null) return;
    (rowsMap.get(row) ?? rowsMap.set(row, []).get(row)!).push(el);
  });

  let globalIndex = 1;

  for (const rowElements of rowsMap.values()) {
    // 按列升序排列
    rowElements.sort((a, b) => a.pos![1] - b.pos![1]);

    const len = rowElements.length;
    const center = Math.floor((len - 1) / 2);
    const ordered: Element[] = [];

    let left = center, right = center + 1;
    ordered.push(rowElements[center]);

    while (left > 0 || right < len) {
      if (right < len) ordered.push(rowElements[right++]);
      if (left > 0) ordered.push(rowElements[--left]);
    }

    for (const el of ordered) {
      el.index1 = globalIndex++;
    }
  }
}

// 矩阵重布局
function analyzeMatrix(elements: { pos: [number, number] }[]) {
  const rows = new Set<number>();
  const cols = new Set<number>();

  for (const el of elements) {
    const [r, c] = el.pos;
    rows.add(r);
    cols.add(c);
  }

  return {
    logicalRowCount: rows.size,
    logicalColCount: cols.size,
    matrixRowCount: Math.max(...rows) + 1,
    matrixColCount: Math.max(...cols) + 1,
  };
}

function recomputeCompressedMatrix(elements: Element[]): void {
  // 获取所有使用过的行号
  const rowsSet = new Set<number>();
  for (const el of elements) {
    rowsSet.add(el.pos![0]);
  }
  const sortedOldRows = [...rowsSet].sort((a, b) => a - b);

  // 行号映射：旧行号 -> 新行号
  const rowRemap = new Map<number, number>();
  sortedOldRows.forEach((oldRow, newRow) => {
    rowRemap.set(oldRow, newRow);
  });

  // 按行分组
  const rowGroups = new Map<number, Element[]>();
  for (const el of elements) {
    const [row] = el.pos!;
    const actualRow = rowRemap.get(row)!;
    if (!rowGroups.has(actualRow)) rowGroups.set(actualRow, []);
    rowGroups.get(actualRow)!.push(el);
  }

  // 对每一行内部按列排序并重新分配列号
  for (const [newRow, group] of rowGroups.entries()) {
    // 按列排序
    group.sort((a, b) => a.pos![1] - b.pos![1]);

    // 重排列号
    group.forEach((el, newCol) => {
      el.pos = [newRow, newCol];
    });
  }
}

function buildRowColumnIndexMap(elements: { pos: [number, number] }[]) {
  const rowToCols = new Map<number, number[]>();

  for (const el of elements) {
    const [r, c] = el.pos;
    if (!rowToCols.has(r)) rowToCols.set(r, []);
    rowToCols.get(r)!.push(c);
  }

  // 每一行内部按列从小到大排序，并建立原始列号 => 相对位置映射
  const rowColIndexMap = new Map<number, Map<number, number>>();
  for (const [r, cols] of rowToCols.entries()) {
    const sorted = cols.sort((a, b) => a - b);
    const colMap = new Map<number, number>();
    sorted.forEach((col, idx) => colMap.set(col, idx));
    rowColIndexMap.set(r, colMap);
  }

  return rowColIndexMap;
}

function isFullRow(elements: { pos: [number, number] }[], row: number, logicalColCount: number): number {
  const colsInRow = new Set<number>();

  for (const el of elements) {
    const [r, c] = el.pos;
    if (r === row) {
      colsInRow.add(c);
    }
  }

  return colsInRow.size === logicalColCount ? 0 : colsInRow.size;
}

export function updateMatrixGroupLayout(groupId: string) {
  const group = store.getGraphicGroupsById(groupId)
  if (!group) return
  const elements = store.getGraphicGroupElementsById(groupId)
  const elementLen = elements.length;

  recomputeCompressedMatrix(elements)

  const posMap = new Map<string, string>();
  const elPosArr: { pos: [number, number] }[] = []

  for (const el of elements) {
    elPosArr.push({pos: el.pos!})
    posMap.set(el.pos!.toString(), el.id)
  }

  // 获取矩阵最大行列
  console.log(elements);
  const {logicalRowCount, logicalColCount} = analyzeMatrix(elPosArr)
  console.log(logicalRowCount, logicalColCount)
  const [w, h] = getMatrixRect(logicalRowCount, logicalColCount)

  group.w = w
  group.h = h
  group.size = elementLen

  const rowColIndexMap = buildRowColumnIndexMap(elPosArr);

  let index = 1
  for (let y = 0; y < logicalRowCount; y++) {
    const fullRow = isFullRow(elPosArr, y, logicalColCount)
    for (let x = 0; x < logicalColCount; x++) {
      if (posMap.has(`${y},${x}`)) {
        const el = store.getGraphicGroupElementById(posMap.get(`${y},${x}`)!)
        if (el) {
          const relativeX = rowColIndexMap.get(y)!.get(x)!; // ← 相对x位置信息
          const {gX, gY} = getMatrixElementPos(relativeX, y, {logicalColCount, fullRow})
          el.x = gX
          el.y = gY
          el.index = index
          el.pos = [y, x]
        }
        index++
      }
    }
  }

  // 重新计算序号(如果需要)
  if (group.index_rule === '2') {
    const els = store.getGraphicGroupElementsById(groupId)
    const result: Record<string, Element> = els.reduce((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {} as Record<string, Element>);

    fillElementIndexOfRule2(result)
  }

  rebuildGroupTree(store)
}
