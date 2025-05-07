import Render from "../render/render.ts";
import type {Canvaser} from "./core.types.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import Container from "../container/container.ts";
import {cancelAllEvents, registerAllEvents} from "../eventCenter/eventCenter.ts";
import Test from "../test/test.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";

const store = RuntimeStore.getInstance();

const MY_CANVAS: Canvaser = {
  cvs: null,
  pen: null,
};

let RenderInstance: Render | null = null;

let ContainerInstance: Container | null = null;

const instances: RenderTargetInstances = {
  Test: null
};

function initTest(canvas: Canvaser) {
  instances.Test = new Test(canvas);
}

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

export function init(
  target: HTMLElement,
  fps = 30,
) {

  MY_CANVAS.cvs = document.createElement('canvas')

  MY_CANVAS.cvs.style.display = 'block'

  MY_CANVAS.pen = MY_CANVAS.cvs.getContext('2d')

  ContainerInstance = new Container(target.clientWidth, target.clientHeight, MY_CANVAS)

  target.appendChild(MY_CANVAS.cvs)

  initTest(MY_CANVAS)

  initRender(fps);

  registerAllEvents()
}

export function exit() {
  ContainerInstance?.clear();
  ContainerInstance = null;

  store.unsubscribeAll()

  RenderInstance?.clear();

  for (const key in instances) {
    instances[key]?.clear();
  }

  RenderInstance = null;

  cancelAllEvents()
}
