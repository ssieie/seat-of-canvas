import type {BehaviorTasksValueType, RenderTargetInstances} from "./render.types.ts";
import type {Canvaser} from "../core/core.types.ts";

class Render {
  cvs: HTMLCanvasElement;
  $: CanvasRenderingContext2D;
  fps: number;
  fpsInterval: number;
  lastRenderTime: number;
  behaviorTasks: Map<string, BehaviorTasksValueType<any>>;
  frame: number | undefined;

  constructor(fps: number, context: Canvaser) {
    this.cvs = context.cvs!;
    this.$ = context.pen!;

    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.lastRenderTime = performance.now();

    this.behaviorTasks = new Map(); // 维护一个行为调度器
  }

  addBehavior<T>(
    eventKey: string,
    event: () => T,
    call: (arg0: T) => void,
    interval: number,
    executeImmediately?: boolean,
  ) {
    this.behaviorTasks.set(eventKey, {
      event,
      call,
      interval,
      lastExecuteTime: executeImmediately ? performance.now() - interval : performance.now(),
    });
  }

  behaviorProcess(currentTime: number) {
    this.behaviorTasks.forEach((task, _key) => {
      let sendElapsed = currentTime - task.lastExecuteTime;
      if (sendElapsed > task.interval) {
        task.lastExecuteTime = currentTime - (sendElapsed % task.interval);

        const res = task.event();

        task.call && task.call(res);
      }
    });
  }

  run(instances: RenderTargetInstances) {
    this.frame = window.requestAnimationFrame(this.run.bind(this, instances));

    let currentTime = performance.now();
    let elapsed = currentTime - this.lastRenderTime;

    this.behaviorTasks.size && this.behaviorProcess(currentTime);

    if (elapsed > this.fpsInterval) {
      this.lastRenderTime = currentTime - (elapsed % this.fpsInterval);

      this.$.clearRect(0, 0, this.cvs.width, this.cvs.height);

      for (const key in instances) {
        instances[key]?.draw();
      }
    }
  }

  clear() {
    this.frame && window.cancelAnimationFrame(this.frame);
  }
}

export default Render;
