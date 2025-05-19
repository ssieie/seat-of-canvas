import type {Canvaser, ContextMenuOperateFunc, GraphicOperateFunc, OperateFunc} from "./core.types";
import type {RenderTargetInstances} from "../render/render.types";
import GraphicMain from "../graphic/graphic";
import RuntimeStore from "../runtimeStore/runtimeStore";
import {deepCopy} from "../utils/common";
import {saveToImages} from "../graphic/externalMethods";

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): OperateFunc {

  // initTest(canvas, instances)

  const {graphicOperateFunc, contextMenuOperateFunc} = initGraphic(canvas, instances)

  return {
    graphicOperateFunc,
    contextMenuOperateFunc,
    getData: () => deepCopy(RuntimeStore.getInstance().getState('graphicMatrix')),
    saveToImages: saveToImages
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
