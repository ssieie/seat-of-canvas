import type {Canvaser, ContextMenuOperateFunc, GraphicOperateFunc, OperateFunc} from "./core.types";
import type {RenderTargetInstances} from "../render/render.types";
import GraphicMain from "../graphic/graphic";
import RuntimeStore from "../runtimeStore/runtimeStore";
import {deepCopy} from "../utils/common";
import {saveToImages} from "../graphic/externalMethods";
import {CanvasState} from '../runtimeStore/runtimeStore'

export default function initGraphicInstances(canvas: Canvaser, instances: RenderTargetInstances): OperateFunc {

  // initTest(canvas, instances)
  let clickMenuCallback: ((...args: any[]) => any) | null = null


  const {graphicOperateFunc, contextMenuOperateFunc} = initGraphic(canvas, instances)

  return {
    graphicOperateFunc,
    contextMenuOperateFunc,
    getData: () => {
      const graphicData = RuntimeStore.getInstance().getState('graphicMatrix')
      for (const el in graphicData.elements) {
        graphicData.elements[el].groupName = RuntimeStore.getInstance().getGraphicGroupsById(graphicData.elements[el].group_by)?.group_name || ''
      }
      return deepCopy({
        graphic: graphicData,
        transform: RuntimeStore.getInstance().getState('containerTransformState')
      })
    },
    setData: (data) => {
      if (data.graphic) RuntimeStore.getInstance().updateState('graphicMatrix', data.graphic)
      if (data.transform) RuntimeStore.getInstance().updateState('containerTransformState', data.transform)
    },
    resetData: () => {
      RuntimeStore.getInstance().reset()
    },
    saveToImages: saveToImages,
    clickMenu: function (callbackOrArg?: ((...args: any[]) => any) | any, ...args: any[]): any {
      if (typeof callbackOrArg === 'function') {
        // 设置回调
        clickMenuCallback = callbackOrArg
      } else {
        // 调用回调并传参
        return clickMenuCallback?.(callbackOrArg, ...args)
      }
    },
    setCanvasState: (state: CanvasState) => {
      RuntimeStore.getInstance().updateState('canvasState', state)
    }
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
