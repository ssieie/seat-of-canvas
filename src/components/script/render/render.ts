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
    if (!context.cvs || !context.pen) {
      throw new Error("Canvaser context is incomplete.");
    }
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

      this.clearScreen();
      this.renderGrid();
      this.renderInstances(instances);
    }

    this.processBehavior(currentTime);
  }

  clear() {
    this.frame && window.cancelAnimationFrame(this.frame);
  }

  private clearScreen() {
    this.$.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  private renderGrid() {
    drawGrid(this.$, this.cvs.width, this.cvs.height);
  }

  private renderInstances(instances: RenderTargetInstances) {
    for (const key in instances) {
      instances[key]?.draw?.();
    }
  }

  private processBehavior(time: number) {
    if (behaviorTasksInstance.getBehaviorTasksSize) {
      behaviorTasksInstance.behaviorProcess(time);
    }
  }
}

export default Render;
