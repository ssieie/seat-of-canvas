import type {Canvaser, GraphicOperateFunc} from "../core/core.types.ts";
import Matrix from "./matrix/matrix.ts";

class Graphic {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  matrix: Matrix

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.matrix = new Matrix(cv)
  }

  draw() {
    this.matrix.draw()
  }

  clear() {
    this.matrix.clear()
  }

  operate(): GraphicOperateFunc {
    return {
      addMatrixGraphic: this.matrix.addMatrixGraphic!.bind(this.matrix)
    }
  }
}

export default Graphic