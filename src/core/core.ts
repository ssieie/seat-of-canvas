import Render from "../render/render";
import type {Canvaser, OperateFunc} from "./core.types";
import type {RenderTargetInstances} from "../render/render.types";
import Container from "../container/container";
import {cancelAllEvents, registerAllEvents} from "../eventCenter/eventCenter";
import RuntimeStore from "../runtimeStore/runtimeStore";
import initGraphicInstances from "./graphicRegister";
import AssetsLoader from "../assetsLoader/assetsLoader";
import {graphicUtilsClear, graphicUtilsInit} from "../graphic/graphicUtils";
import ContextMenu from "../contextMenu/contextMenu";
import {MY_CANVAS_BG} from "../graphic/constant";
import ZoomTool from "../canvasTool/zoomTool";
import {throttle} from '../utils/common'

const store = RuntimeStore.getInstance();
const menu = ContextMenu.getInstance();
const zoomTool = ZoomTool.getInstance();

const MY_CANVAS: Canvaser = {
  cvs: null,
  pen: null,
};

let RenderInstance: Render | null = null;

let ContainerInstance: Container | null = null;


const instances: RenderTargetInstances = {
  Test: null,
  Graphic: null,
};

function initRender(fps: number) {

  if (!RenderInstance) {
    RenderInstance = new Render(fps, MY_CANVAS);

    // 主渲染任务
    RenderInstance.run(instances);

    // 注册渲染期间任何自定义行为
    // behaviorController();
  }

}

export function resize(w: number, h: number) {
  ContainerInstance?.resize?.(w, h);
}

export async function init(
  target: HTMLElement,
  fps = 30,
): Promise<OperateFunc> {

  MY_CANVAS.cvs = document.createElement('canvas')

  MY_CANVAS.cvs.setAttribute('id', 'zx-drag-canvas');
  MY_CANVAS.cvs.style.display = 'block'
  MY_CANVAS.cvs.style.backgroundColor = MY_CANVAS_BG

  MY_CANVAS.pen = MY_CANVAS.cvs.getContext('2d')

  graphicUtilsInit()

  ContainerInstance = new Container(target.clientWidth, target.clientHeight, MY_CANVAS)

  target.appendChild(MY_CANVAS.cvs)

  await AssetsLoader.load().catch(console.error)

  const func = initGraphicInstances(MY_CANVAS, instances)

  initRender(fps);

  registerAllEvents(MY_CANVAS.cvs)

  menu.init(instances);
  menu.generateContextMenuItem(func);

  zoomTool.init()

  return func
}

export function exit() {
  ContainerInstance?.clear();
  ContainerInstance = null;

  graphicUtilsClear()

  RenderInstance?.clear();
  RenderInstance = null;

  for (const key in instances) {
    instances[key]?.clear();
  }

  RuntimeStore.getInstance().destroy()

  RuntimeStore.getInstance().reset()

  store.unsubscribeAll()

  cancelAllEvents(MY_CANVAS.cvs!)

  menu.destroy();
  zoomTool.destroy()

  MY_CANVAS.cvs!.remove()
  MY_CANVAS.cvs = null;
  MY_CANVAS.pen = null;
}

export {
  throttle
}
