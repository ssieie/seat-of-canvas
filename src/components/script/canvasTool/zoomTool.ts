import {scaleToPercentage} from "../container/container.ts";
import PubSub from "../utils/pubSub.ts";

class ZoomTool {
  private static instance: ZoomTool;
  private toolElement: HTMLDivElement | null = null;
  private readonly handleToolClickBind: ((e: MouseEvent) => void);
  private readonly onTransformStateChangeHandlerBind: (() => void);

  static getInstance(): ZoomTool {
    if (!ZoomTool.instance) {
      ZoomTool.instance = new ZoomTool();
    }
    return ZoomTool.instance;
  }

  constructor() {
    this.handleToolClickBind = this.handleToolClick.bind(this);
    this.onTransformStateChangeHandlerBind = this.onTransformStateChangeHandler.bind(this);
  }

  public onTransformStateChangeHandler() {
    const scaleProportion = document.querySelector('.zx-zoom-scale-proportion')
    if (scaleProportion) {
      scaleProportion.textContent = scaleToPercentage()
    }
  }

  public handleToolClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (target) {
      switch (target.className) {
        case 'zx-zoom-scale-up':
          break
        case 'zx-zoom-scale-proportion':
          break
        case 'zx-zoom-scale-down':
          break
      }
    }
  }

  private createToolElement(): HTMLDivElement {
    const tool = document.createElement('div');

    const scaleUp = document.createElement('div');
    scaleUp.className = 'zx-zoom-scale-up';
    const scaleProportion = document.createElement('div');
    scaleProportion.className = 'zx-zoom-scale-proportion';
    scaleProportion.textContent = scaleToPercentage()
    const scaleDown = document.createElement('div');
    scaleDown.className = 'zx-zoom-scale-down';

    tool.appendChild(scaleUp);
    tool.appendChild(scaleProportion);
    tool.appendChild(scaleDown);

    tool.className = 'z-canvas-tool-zoom';
    return tool;
  }

  init() {
    if (this.toolElement) return;
    this.toolElement = this.createToolElement();

    const myCanvasParentElement = document.querySelector('#zx-drag-canvas')?.parentElement
    if (myCanvasParentElement) {
      myCanvasParentElement.style.position = 'relative';
      myCanvasParentElement.appendChild(this.toolElement!);
    }
    this.bindGlobalEvents();

    PubSub.subscribe('calculateProportion', this.onTransformStateChangeHandlerBind)
  }

  private bindGlobalEvents(): void {
    if (!this.toolElement) return
    this.toolElement.addEventListener('click', this.handleToolClickBind!);
  }

  public destroy(): void {
    if (this.toolElement) {
      this.toolElement!.removeEventListener('click', this.handleToolClickBind!);

      this.toolElement.remove();
      this.toolElement = null;
    }

    PubSub.unsubscribe('calculateProportion', this.onTransformStateChangeHandlerBind);
  }
}

export default ZoomTool;
