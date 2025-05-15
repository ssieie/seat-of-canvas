import type {Canvaser, ContextMenuOperateFunc, GraphicOperateFunc} from "../core/core.types.ts";
import Matrix from "./matrix/matrix.ts";
import OperateGraphic from "./operateGraphic.ts";
import {drawDragElement, drawGroupMatrixElement, drawMatrixGroup} from "./matrix/matrixUtils.ts";
import Circle from "./circle/circle.ts";
import RuntimeStore from "../runtimeStore/runtimeStore.ts";
import {drawCircleGroup, drawGroupCircleElement} from "./circle/circleUtils.ts";
import Strip from "./strip/strip.ts";
import {drawGroupStripElement, drawStripGroup} from "./strip/stripUtils.ts";

const store = RuntimeStore.getInstance();

class GraphicMain extends OperateGraphic {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  matrix: Matrix
  circle: Circle
  strip: Strip

  constructor(cv: Canvaser) {
    super(cv);
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.matrix = new Matrix()
    this.circle = new Circle()
    this.strip = new Strip()
  }

  draw() {
    if (!this.ctx) return

    const ctx = this.ctx!
    // 绘制矩形组
    const allGroup = store.getGraphicGroupsArr()


    for (const group of allGroup.sort((a, b) => a.z_index - b.z_index)) {

      switch (group.type) {
        case "rectangle":
          drawMatrixGroup(ctx, group)
          break;
        case "circle":
          drawCircleGroup(ctx, group)
          break;
        case "strip":
          drawStripGroup(ctx, group)
          break
      }

      // 组内元素
      const elements = store.getGraphicGroupElementsById(group.group_id)

      for (const element of elements) {

        switch (group.type) {
          case "rectangle":
            drawGroupMatrixElement(ctx, element, group)
            break;
          case "circle":
            drawGroupCircleElement(ctx, element, group)
            break;
          case "strip":
            drawGroupStripElement(ctx, element, group)
            break
        }

      }
    }

    drawDragElement(this.ctx)
  }

  clear() {
    super.clear()
    this.matrix.clear()
    this.circle.clear()
    this.strip.clear()
  }

  operate(): GraphicOperateFunc {
    return {
      addMatrixGraphic: this.matrix.addMatrixGraphic!.bind(this.matrix),
      addCircleGraphic: this.circle.addCircleGraphic!.bind(this.circle),
      addStripGraphic: this.strip.addStripGraphic!.bind(this.circle)
    }
  }

  contextMenuOperate(): ContextMenuOperateFunc {
    return {
      delGroup: super.delGroup,
      exportToPng: super.exportToPng
    }
  }
}

export default GraphicMain
