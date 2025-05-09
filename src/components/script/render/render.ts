import type {RenderTargetInstances} from "./render.types.ts";
import type {Canvaser} from "../core/core.types.ts";
import behaviorTasksInstance from "../behaviorTasks/behaviorTasks.ts";
import drawGrid from "./drawGrid.ts";

class Render {
  cvs: HTMLCanvasElement;
  $: CanvasRenderingContext2D;
  fps: number;
  fpsInterval: number;
  lastRenderTime: number;
  frame: number | undefined;

  constructor(fps: number, context: Canvaser) {
    this.cvs = context.cvs!;
    this.$ = context.pen!;

    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.lastRenderTime = performance.now();
  }


  run(instances: RenderTargetInstances) {
    this.frame = window.requestAnimationFrame(this.run.bind(this, instances));

    let currentTime = performance.now();
    let elapsed = currentTime - this.lastRenderTime;

    if (elapsed > this.fpsInterval) {
      this.lastRenderTime = currentTime - (elapsed % this.fpsInterval);

      this.$.clearRect(0, 0, this.cvs.width, this.cvs.height);

      drawGrid(this.$, this.cvs.width, this.cvs.height)

      for (const key in instances) {
        instances[key]?.draw?.();
      }
    }

    behaviorTasksInstance.getBehaviorTasksSize && behaviorTasksInstance.behaviorProcess(currentTime);
  }

  clear() {
    this.frame && window.cancelAnimationFrame(this.frame);
  }
}

export default Render;
