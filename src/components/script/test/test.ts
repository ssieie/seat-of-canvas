import type {Canvaser} from "../core/core.types.ts";
import {originToScreen, scaleSize} from "../transform/transform.ts";


class Test {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen
  }

  draw() {
    const ctx = this.ctx!
    ctx.fillStyle = '#f0f0f0'
    const screen1 = originToScreen(-1000, -1000);
    ctx.fillRect(screen1.x, screen1.y, scaleSize(2000), scaleSize(2000)) // 背景大点方便拖动


    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'blue'
      const screen2 = originToScreen(0 + i * 200, 0 + i * 300);
      ctx.fillRect(screen2.x, screen2.y, scaleSize(200), scaleSize(200))
    }

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      const screen3 = originToScreen(400 + i * 200, 200 + i * 200);
      ctx.arc(screen3.x, screen3.y, scaleSize(80), 0, Math.PI * 2)
      ctx.fill()
    }

  }

  clear() {
  }
}

export default Test
