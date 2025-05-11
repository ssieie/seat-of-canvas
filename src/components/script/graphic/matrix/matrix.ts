import type {Canvaser} from "../../core/core.types.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";
import type {Graphic, Group, GroupType} from "../graphic.types.ts";
import {generateUuid} from "../../utils/common.ts";
import {
  drawGroup,
  drawGroupElement,
  drawGroupName,
  fillMatrixElement,
  getMatrixRect,
} from "./matrixUtils.ts";
import {getBasicPos} from "../graphicUtils.ts";

const store = RuntimeStore.getInstance();

const GRAPHIC_TYPE: GroupType = 'rectangle'

class Matrix {
  private readonly canvas: HTMLCanvasElement | null
  private readonly ctx: CanvasRenderingContext2D | null

  graphicData: Graphic

  constructor(cv: Canvaser) {
    this.canvas = cv.cvs
    this.ctx = cv.pen

    this.graphicData = store.getState('graphicMatrix')
    // store.subscribe('graphicMatrix', this.onGraphicMatrixChange.bind(this));
  }

  // onGraphicMatrixChange(newVal: Graphic) {
  //   this.graphicData = newVal
  // }

  async addMatrixGraphic(name: string, row: number, col: number) {
    // 新建一个矩形组
    // const graphicMatrix: Graphic = deepCopy()
    const graphicMatrix: Graphic = this.graphicData
    const groupId = generateUuid()
    const [w, h] = getMatrixRect(row, col)

    const [basicX, basicY] = getBasicPos(w, h, this.canvas!)

    const group: Group = {
      group_id: groupId,
      group_name: name,
      z_index: 0,
      x: basicX,
      y: basicY,
      w: w,
      h: h,
      hover: false,
      size: row * col,
      type: 'rectangle',
    }

    const elements = fillMatrixElement(groupId, row, col, [basicX, basicY])

    graphicMatrix.groups[GRAPHIC_TYPE][groupId] = group

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

    for (const group of Object.values(this.graphicData.groups[GRAPHIC_TYPE]).sort((a, b) => a.z_index - b.z_index)) {

      drawGroup(ctx, group)

      // 组描述文本
      drawGroupName(ctx, group)

      // 组内元素
      const elements = this.graphicData.groupElements[group.group_id]

      for (const elementId of elements) {
        const element = this.graphicData.elements[elementId]
        drawGroupElement(ctx, element, group)
      }
    }
  }

  clear() {
    // store.unsubscribe('graphicMatrix', this.onGraphicMatrixChange.bind(this));
  }
}

export default Matrix
