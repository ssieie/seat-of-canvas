import {getTransformState} from "../transform/transform.ts";

export default function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const {scale: rawScale, offsetX, offsetY} = getTransformState();

  const scale = Math.min(Math.max(rawScale, 0.75), 3);

  const gridSpacing = 30; // 原始点阵间距
  const scaledSpacing = gridSpacing * scale;
  const dotRadius = scale > 1 ? scale : 1;// 每个点的半径

  const startX = offsetX % scaledSpacing;
  const startY = offsetY % scaledSpacing;

  ctx.fillStyle = '#dfdfe1';

  for (let x = startX; x < width; x += scaledSpacing) {
    for (let y = startY; y < height; y += scaledSpacing) {
      // ctx.beginPath();
      // ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      // ctx.fill();
      ctx.fillRect(x - dotRadius, y - dotRadius, dotRadius * 2, dotRadius * 2);
    }
  }

}
