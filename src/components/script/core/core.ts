import Render from "../render/render.ts";
import type {Canvaser, OperateFunc} from "./core.types.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import Container from "../container/container.ts";
import {cancelAllEvents, registerAllEvents} from "../eventCenter/eventCenter.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import initGraphicInstances from "./graphicRegister.ts";
import AssetsLoader from "../assetsLoader/assetsLoader.ts";
import {graphicUtilsClear, graphicUtilsInit} from "../graphic/graphicUtils.ts";

const store = RuntimeStore.getInstance();

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
  RenderInstance = new Render(fps, MY_CANVAS);

  // 主渲染任务
  RenderInstance.run(instances);

  // 注册渲染期间任何自定义行为
  // behaviorController();
}

export function resize(w: number, h: number) {
  ContainerInstance?.resize?.(w, h);
}

export async function init(
  target: HTMLElement,
  fps = 30,
): Promise<OperateFunc> {

  MY_CANVAS.cvs = document.createElement('canvas')

  MY_CANVAS.cvs.style.display = 'block'

  MY_CANVAS.pen = MY_CANVAS.cvs.getContext('2d')

  graphicUtilsInit()

  ContainerInstance = new Container(target.clientWidth, target.clientHeight, MY_CANVAS)

  target.appendChild(MY_CANVAS.cvs)

  await AssetsLoader.load().catch(console.error)

  const func = initGraphicInstances(MY_CANVAS, instances)

  initRender(fps);

  registerAllEvents(MY_CANVAS.cvs)

  store.getState('ContextMenuInstance').init()

  store.getState('ContextMenuInstance').generateContextMenuItem(func)

  return func
}

export function exit() {
  ContainerInstance?.clear();
  ContainerInstance = null;

  graphicUtilsClear()

  RenderInstance?.clear();

  for (const key in instances) {
    instances[key]?.clear();
  }

  RenderInstance = null;

  RuntimeStore.getInstance().destroy()

  RuntimeStore.getInstance().reset()

  store.unsubscribeAll()

  cancelAllEvents(MY_CANVAS.cvs!)

  MY_CANVAS.cvs!.remove()
  MY_CANVAS.cvs = null;
  MY_CANVAS.pen = null;
}
