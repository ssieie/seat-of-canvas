import type {Canvaser} from "../../core/core.types.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";
import type {Graphic, Group} from "../graphic.types.ts";
import {deepCopy, generateUuid} from "../../../../utils/common.ts";
import {
  drawGroup,
  drawGroupElement, drawGroupElementIndex,
  drawGroupName,
  fillMatrixElement,
  getMatrixRect,
} from "./matrixUtils.ts";
import {getBasicPos} from "../graphicUtils.ts";

const store = RuntimeStore.getInstance();

class Matrix {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  graphicData: Graphic

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.graphicData = store.getState('graphicMatrix')
    store.subscribe('graphicMatrix', this.onGraphicMatrixChange.bind(this));
  }

  onGraphicMatrixChange(newVal: Graphic) {
    this.graphicData = newVal
  }

  addMatrixGraphic(name: string, row: number, col: number) {
    // 新建一个矩形组
    const graphicMatrix: Graphic = deepCopy(this.graphicData)
    const groupId = generateUuid()
    const [w, h] = getMatrixRect(row, col)

    const [basicX, basicY] = getBasicPos(w, h, this.canvas!)

    const group: Group = {
      group_id: groupId,
      group_name: name,
      z_index: 1,
      x: basicX,
      y: basicY,
      width: w,
      height: h,
      size: row * col,
      type: 'rectangle',
    }

    const elements = fillMatrixElement(groupId, row, col, [basicX, basicY])

    graphicMatrix.groups[groupId] = group

    graphicMatrix.elements = {
      ...graphicMatrix.elements,
      ...elements,
    }

    graphicMatrix.groupElements[groupId] = Object.keys(elements)

    store.updateState('graphicMatrix', graphicMatrix)
  }

  draw() {
    const ctx = this.ctx!
    // 绘制矩形组
    for (const groupId in this.graphicData.groups) {
      const group = this.graphicData.groups[groupId]
      drawGroup(ctx, group)

      // 组描述文本
      drawGroupName(ctx, group)

      // 组内元素
      const elements = this.graphicData.groupElements[groupId]

      for (const elementId of elements) {
        const element = this.graphicData.elements[elementId]
        drawGroupElement(ctx, element)

        // 元素序号
        drawGroupElementIndex(ctx, element)
      }
    }
  }

  clear() {
    store.unsubscribe('graphicMatrix', this.onGraphicMatrixChange.bind(this));
  }
}

export default Matrix
