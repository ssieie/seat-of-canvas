import type {Element, Group} from "./graphic.types.ts";
import {canvasToScreen, getTransformState, scaleSize, screenToCanvas} from "../transform/transform.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {drawGroupMatrixElement, drawMatrixGroup} from "./matrix/matrixUtils.ts";
import {drawGroupStripElement, drawStripGroup} from "./strip/stripUtils.ts";
import {drawCircleGroup, drawGroupCircleElement} from "./circle/circleUtils.ts";
import {deepCopy} from "../utils/common.ts";

const store = RuntimeStore.getInstance();

export function exportLogicalRegionToImage(
  canvas: HTMLCanvasElement,
  logicX: number,
  logicY: number,
  logicW: number,
  logicH: number,
  downloadName: string
) {
  const [srcX, srcY] = canvasToScreen(logicX, logicY)
  const srcW = scaleSize(logicW);
  const srcH = scaleSize(logicH);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = srcW;
  tempCanvas.height = srcW;

  const ctx = tempCanvas.getContext('2d');
  if (!ctx) throw new Error("无法获取上下文");

  ctx.drawImage(canvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcW);

  tempCanvas.toBlob((blob) => {
    if (blob) {
      const link = document.createElement('a');
      link.download = `${downloadName}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }, 'image/png');
}

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

// 保存整个画布为图片
export function saveToImages(name = 'graphic-export') {
  const allGroup: Group[] = deepCopy(store.getGraphicGroupsArr())
  const {width, height, offsetX, offsetY} = calculateCanvasBoundingBox(allGroup);

  // 创建离屏 canvas
  const canvas = document.createElement('canvas');
  canvas.width = width + 10;
  canvas.height = height + 10;
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
    group.x = x + 5
    group.y = y + 5
    group.w = group.w / scale
    group.h = group.h / scale
    group.baseFontSize = group.baseFontSize / scale

    switch (group.type) {
      case "rectangle":
        drawMatrixGroup(ctx, group)
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
