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

    // const screen1 = originToScreen(0, 0);
    // ctx.textAlign = "center";
    // ctx.fillText('asdasd', screen1.x, screen1.y);
    // ctx.fillRect(screen1.x, screen1.y, scaleSize(50), scaleSize(50))

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'blue'
      const screen2 = originToScreen(0 + i * 60, 550 + i * 60);
      ctx.fillRect(screen2.x, screen2.y, scaleSize(50), scaleSize(50))
    }

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      const screen3 = originToScreen(400 + i * 60, 550 + i * 60);
      ctx.arc(screen3.x, screen3.y, scaleSize(20), 0, Math.PI * 2)
      ctx.fill()
    }

  }

  clear() {
  }
}

export default Test
