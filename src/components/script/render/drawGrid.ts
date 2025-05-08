import {getTransformState} from "../transform/transform.ts";

export default function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const {scale: rawScale, offsetX, offsetY} = getTransformState();

  const scale = Math.min(Math.max(rawScale, 0.75), 3); // 限制 scale 在 0.2 ~ 5 之间

  const gridSpacing = 30; // 原始点阵间距
  let dotRadius = 1;  // 每个点的半径
  const scaledSpacing = gridSpacing * scale;

  const startX = offsetX % scaledSpacing;
  const startY = offsetY % scaledSpacing;

  ctx.save();
  ctx.fillStyle = '#ccc';
  dotRadius = scale > 1 ? dotRadius * scale : dotRadius;

  for (let x = startX; x < width; x += scaledSpacing) {
    for (let y = startY; y < height; y += scaledSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
