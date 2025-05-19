import {MAX_SCALE, percentageToScale, scaleToPercentage} from "../container/container";
import PubSub from "../utils/pubSub";
import {setTransformFrame} from "../transform/keyframe";
import {getCanvas, getTransformState} from "../transform/transform";

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
      scaleProportion.textContent = scaleToPercentage() + '%'
    }
  }

  private scaleHandler(type: 'up' | 'down' | 'reset' | 'situ') {
    if (type === 'situ') {
      setTransformFrame({scale: 1, offsetX: 0, offsetY: 0})
      return;
    }

    const cvs = getCanvas();
    if (!cvs) return;
    let {offsetX, offsetY, scale} = getTransformState();
    const centerX = cvs.width / 2;
    const centerY = cvs.height / 2;
    if (type === "reset") {
      const scaleChange = 1 / scale;

      const oX = centerX - (centerX - offsetX) * scaleChange
      const oY = centerY - (centerY - offsetY) * scaleChange
      setTransformFrame({offsetX: oX, offsetY: oY, scale: 1})
    } else {
      const currentScale = scaleToPercentage();
      const newScalePercentage = type === 'up' ? currentScale + 50 : currentScale - 50;
      if (newScalePercentage > MAX_SCALE * 100) return;
      if (newScalePercentage < 0) return;
      const newScale = percentageToScale(newScalePercentage)

      const scaleChange = newScale / scale;
      const oX = centerX - (centerX - offsetX) * scaleChange
      const oY = centerY - (centerY - offsetY) * scaleChange

      setTransformFrame({offsetX: oX, offsetY: oY, scale: newScale})
    }
  }

  public handleToolClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (target) {
      switch (target.className) {
        case 'zx-zoom-in-situ':
          this.scaleHandler('situ')
          break
        case 'zx-zoom-scale-up':
          this.scaleHandler('up')
          break
        case 'zx-zoom-scale-proportion':
          this.scaleHandler('reset')
          break
        case 'zx-zoom-scale-down':
          this.scaleHandler('down')
          break
      }
    }
  }

  private createToolElement(): HTMLDivElement {
    const tool = document.createElement('div');

    const resetScale = document.createElement('div');
    resetScale.className = 'zx-zoom-in-situ';

    const scaleUp = document.createElement('div');
    scaleUp.className = 'zx-zoom-scale-up';

    const scaleProportion = document.createElement('div');
    scaleProportion.className = 'zx-zoom-scale-proportion';
    scaleProportion.textContent = scaleToPercentage() + '%'

    const scaleDown = document.createElement('div');
    scaleDown.className = 'zx-zoom-scale-down';

    tool.appendChild(resetScale);
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
