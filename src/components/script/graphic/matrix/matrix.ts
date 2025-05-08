import type {Canvaser} from "../../core/core.types.ts";


class Matrix {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen
  }

  draw() {
    const ctx = this.ctx!

  }

  clear() {
  }
}

export default Matrix
