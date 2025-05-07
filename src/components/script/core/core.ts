import Render from "../render/render.ts";
import type {Canvaser} from "./core.types.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";
import Container from "../container/container.ts";
import {cancelAllEvents, registerAllEvents} from "../eventCenter/eventCenter.ts";


const MY_CANVAS: Canvaser = {
  cvs: null,
  pen: null,
};

let RenderInstance: Render | null = null;

const instances: RenderTargetInstances = {
  Container: null, // 主容器
};

function initContainer(w: number, h: number, canvas: Canvaser) {
  instances.Container = new Container(w, h, canvas);
}

function initRender(fps: number) {
  RenderInstance = new Render(fps, MY_CANVAS);

  // 主渲染任务
  RenderInstance.run(instances);

  // 指定时间间隔触发器的例子
  RenderInstance.addBehavior<number | undefined>(
    "demo",
    () => {
      return 1
    },
    (frequency) => {
      if (frequency) {
        console.log(frequency);
        // todo 改变某个值
      }
    },
    1000 / 0.1,
    false,
  ); // 0.1 次/秒
}

export function resize(w: number, h: number) {
  instances.Container?.resize?.(w, h);
}

export function init(
  target: HTMLElement,
  fps = 30,
) {

  MY_CANVAS.cvs = document.createElement('canvas')

  MY_CANVAS.cvs.style.display = 'block'

  MY_CANVAS.pen = MY_CANVAS.cvs.getContext('2d')

  target.appendChild(MY_CANVAS.cvs)

  initContainer(target.clientWidth, target.clientHeight, MY_CANVAS)

  initRender(fps);

  registerAllEvents()
}

export function exit() {
  RenderInstance?.clear();

  for (const key in instances) {
    instances[key]?.clear();
  }

  RenderInstance = null;

  cancelAllEvents()
}
