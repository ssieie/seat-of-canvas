import type {Element, Group} from "./graphic.types";
import {getTransformState, screenToCanvas} from "../transform/transform";
import RuntimeStore from "../runtimeStore/runtimeStore";
import {drawGroupMatrixElement, drawMatrixGroup} from "./matrix/matrixUtils";
import {drawGroupStripElement, drawStripGroup} from "./strip/stripUtils";
import {drawCircleGroup, drawGroupCircleElement} from "./circle/circleUtils";
import {deepCopy} from "../utils/common";

const store = RuntimeStore.getInstance();

function calculateCanvasBoundingBox(groups: Group[]) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const group of groups) {
    let x = group.x;
    let y = group.y;
    let width = group.w;
    let height = group.h;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    offsetX: -minX,
    offsetY: -minY
  };
}

// 保存组为图片
export function saveToImages(name = 'graphic-export', groupId?: string) {
  let allGroup: Group[] = []

  if (groupId) {
    const group = deepCopy(store.getGraphicGroupsById(groupId))
    if (group) {
      allGroup = [group]
    }
  } else {
    allGroup = deepCopy(store.getGraphicGroupsArr())
  }

  const {width, height, offsetX, offsetY} = calculateCanvasBoundingBox(allGroup);

  // 创建离屏 canvas
  const canvas = document.createElement('canvas');
  canvas.width = width + 12;
  canvas.height = height + 12;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // 平移到正区域（因为原始可能有负坐标）
  ctx.translate(offsetX, offsetY);

  const scale = getTransformState().scale

  // 渲染每个 Group
  for (const group of allGroup.sort((a, b) => a.z_index - b.z_index)) {
    const [x, y] = screenToCanvas(group.x, group.y)
    group.x = x + 6
    group.y = y + 6
    group.w = group.w / scale
    group.h = group.h / scale
    group.baseFontSize = group.baseFontSize / scale

    switch (group.type) {
      case "rectangle":
        drawMatrixGroup(ctx, group, false)
        break;
      case "circle":
        group.radius = group.radius! / scale
        drawCircleGroup(ctx, group)
        break;
      case "strip":
        drawStripGroup(ctx, group, false)
        break
    }

    // 组内元素
    const elements: Element[] = deepCopy(store.getGraphicGroupElementsById(group.group_id))

    for (const element of elements) {
      const ex = element.x / scale;
      const ey = element.y / scale;

      element.x = ex;
      element.y = ey;
      element.baseFontSize = element.baseFontSize / scale
      element.nameFontSize = element.nameFontSize / scale
      element.width = element.width / scale
      element.height = element.height / scale
      switch (group.type) {
        case "rectangle":
          drawGroupMatrixElement(ctx, element, group)
          break;
        case "circle":
          drawGroupCircleElement(ctx, element, group)
          break;
        case "strip":
          drawGroupStripElement(ctx, element, group)
          break
      }

    }
  }

  ctx.restore();

  // 导出为图片
  const imgDataUrl = canvas.toDataURL('image/png');

  // 下载图片
  const a = document.createElement('a');
  a.href = imgDataUrl;
  a.download = `${name}.png`;
  a.click();
}
