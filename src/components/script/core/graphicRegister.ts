import type {Canvaser, GraphicFunc} from "./core.types.ts";
import Test from "../test/test.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import Matrix from "../graphic/matrix/matrix.ts";

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): GraphicFunc {

  initTest(canvas, instances)
  const matrixFunc = initMatrix(canvas, instances)

  return {
    matrixFunc
  }

}

function initTest(canvas: Canvaser, instances: RenderTargetInstances) {
  instances.Test = new Test(canvas);
}

function initMatrix(canvas: Canvaser, instances: RenderTargetInstances) {
  instances.Matrix = new Matrix(canvas);

  return {
    addMatrixGraphic: instances.Matrix.addMatrixGraphic!.bind(instances.Matrix)
  }
}
