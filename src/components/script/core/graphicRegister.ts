import type {Canvaser, GraphicOperateFunc, OperateFunc} from "./core.types.ts";
import Test from "../test/test.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import GraphicMain from "../graphic/graphic.ts";

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): OperateFunc {

  initTest(canvas, instances)

  const graphicOperateFunc = initGraphic(canvas, instances)

  return {
    graphicOperateFunc
  }

}

function initTest(canvas: Canvaser, instances: RenderTargetInstances) {
  instances.Test = new Test(canvas);
}

function initGraphic(canvas: Canvaser, instances: RenderTargetInstances): GraphicOperateFunc {
  instances.Graphic = new GraphicMain(canvas);

  return instances.Graphic.operate!.call(instances.Graphic)
}
