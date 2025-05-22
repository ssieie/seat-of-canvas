import {
  AccordingToTheRanksAddGroupOptions,
  Canvaser,
  ContextMenuOperateFunc,
  GraphicOperateFunc
} from "../core/core.types";
import Matrix from "./matrix/matrix";
import OperateGraphic from "./operateGraphic";
import {drawGroupMatrixElement, drawMatrixGroup} from "./matrix/matrixUtils";
import Circle from "./circle/circle";
import RuntimeStore from "../runtimeStore/runtimeStore";
import {drawCircleGroup, drawGroupCircleElement, getCircleRect} from "./circle/circleUtils";
import Strip from "./strip/strip";
import {drawGroupStripElement, drawStripGroup} from "./strip/stripUtils";
import {drawDragElement, getBasicPos} from "./graphicUtils";
import {GroupType} from "./graphic.types";
import {MATRIX_GAP} from "./constant";

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

  // 按照行列批量新增区域
  accordingToTheRanksAddGroup(row: number, col: number, type: GroupType, groupOptions: AccordingToTheRanksAddGroupOptions) {
    switch (type) {
      case "rectangle": // 未实现
        break
      case "circle":
        const {w, h} = getCircleRect(groupOptions.num)
        const bW = w * row + (row - 1) * MATRIX_GAP
        const bH = h * col + (col - 1) * MATRIX_GAP
        const [basicX, basicY] = getBasicPos(bW, bH)
        for (let r = 0; r < row; r++) {
          for (let c = 0; c < col; c++) {
            const x = basicX + c * (w + MATRIX_GAP);
            const y = basicY + r * (h + MATRIX_GAP);
            this.circle.addCircleGraphic(groupOptions.name, groupOptions.num, [x, y]).then()
          }
        }
        break
      case "strip":
        break
    }
  }

  operate(): GraphicOperateFunc {
    return {
      addMatrixGraphic: this.matrix.addMatrixGraphic!.bind(this.matrix),
      addCircleGraphic: this.circle.addCircleGraphic!.bind(this.circle),
      addStripGraphic: this.strip.addStripGraphic!.bind(this.circle),
      highlightAppointEl: super.highlightAppointEl,
      accordingToTheRanksAddGroup: this.accordingToTheRanksAddGroup.bind(this),
    }
  }

  contextMenuOperate(): ContextMenuOperateFunc {
    return {
      delGroup: super.delGroup,
      exportToPng: super.exportToPng,
      increaseElement: super.increaseElement,
      decreaseElement: super.decreaseElement,
      setElementStatus: super.setElementStatus,
    }
  }
}

export default GraphicMain
