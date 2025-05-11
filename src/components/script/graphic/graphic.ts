import type {Canvaser, GraphicOperateFunc} from "../core/core.types.ts";
import Matrix from "./matrix/matrix.ts";
import OperateGraphic from "./operateGraphic.ts";

class Graphic extends OperateGraphic {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  matrix: Matrix

  constructor(cv: Canvaser) {
    super(cv);
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.matrix = new Matrix(cv)
  }

  draw() {
    this.matrix.draw()
  }

  clear() {
    super.clear()
    this.matrix.clear()
  }

  operate(): GraphicOperateFunc {
    return {
      addMatrixGraphic: this.matrix.addMatrixGraphic!.bind(this.matrix)
    }
  }
}

export default Graphic