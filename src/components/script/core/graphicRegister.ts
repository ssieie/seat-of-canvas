import type {Canvaser, ContextMenuOperateFunc, GraphicOperateFunc, OperateFunc} from "./core.types.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import GraphicMain from "../graphic/graphic.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {deepCopy} from "../utils/common.ts";

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): OperateFunc {

  // initTest(canvas, instances)

  const {graphicOperateFunc, contextMenuOperateFunc} = initGraphic(canvas, instances)

  return {
    graphicOperateFunc,
    contextMenuOperateFunc,
    getData: () => deepCopy(RuntimeStore.getInstance().getState('graphicMatrix'))
  }

}

// function initTest(canvas: Canvaser, instances: RenderTargetInstances) {
//   instances.Test = new Test(canvas);
// }

function initGraphic(canvas: Canvaser, instances: RenderTargetInstances): {
  graphicOperateFunc: GraphicOperateFunc,
  contextMenuOperateFunc: ContextMenuOperateFunc
} {
  instances.Graphic = new GraphicMain(canvas);

  return {
    graphicOperateFunc: instances.Graphic.operate!.call(instances.Graphic),
    contextMenuOperateFunc: instances.Graphic.contextMenuOperate!.call(instances.Graphic)
  }
}
