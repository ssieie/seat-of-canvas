import type {Canvaser} from "../core/core.types";
import {canvasToScreen, scaleSize} from "../transform/transform";


class Test {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen
  }

  draw() {
    return
    const ctx = this.ctx!

    // const screen1 = canvasToScreen(0, 0);
    // ctx.textAlign = "center";
    // ctx.fillText('asdasd', screen1.x, screen1.y);
    // ctx.fillRect(screen1.x, screen1.y, scaleSize(50), scaleSize(50))

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'blue'
      const [x,y] = canvasToScreen(0 + i * 60, 550 + i * 60);
      ctx.fillRect(x, y, scaleSize(50), scaleSize(50))
    }

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      const [x,y] = canvasToScreen(400 + i * 60, 550 + i * 60);
      ctx.arc(x, y, scaleSize(20), 0, Math.PI * 2)
      ctx.fill()
    }

  }

  clear() {
  }
}

export default Test
