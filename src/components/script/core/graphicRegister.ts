import type {Canvaser, GraphicOperateFunc, OperateFunc} from "./core.types.ts";
import Test from "../test/test.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import GraphicMain from "../graphic/graphic.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {deepCopy} from "../utils/common.ts";

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): OperateFunc {

  initTest(canvas, instances)

  const graphicOperateFunc = initGraphic(canvas, instances)

  return {
    graphicOperateFunc,
    getData: () => deepCopy(RuntimeStore.getInstance().getState('graphicMatrix'))
  }

}

function initTest(canvas: Canvaser, instances: RenderTargetInstances) {
  instances.Test = new Test(canvas);
}

function initGraphic(canvas: Canvaser, instances: RenderTargetInstances): GraphicOperateFunc {
  instances.Graphic = new GraphicMain(canvas);

  return instances.Graphic.operate!.call(instances.Graphic)
}
