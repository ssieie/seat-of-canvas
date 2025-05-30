import RuntimeStore from "../../runtimeStore/runtimeStore";
import type {Graphic, Group, GroupType} from "../graphic.types";
import {generateUuid} from "../../utils/common";
import {
  fillMatrixElement,
  getMatrixRect,
} from "./matrixUtils";
import {getBasicPos} from "../graphicUtils";

const store = RuntimeStore.getInstance();

const GRAPHIC_TYPE: GroupType = 'rectangle'

class Matrix {

  constructor() {
  }

  addMatrixGraphic(name: string, row: number, col: number, _element: Element[] = []) {
    // 新建一个矩形组
    // const graphicMatrix: Graphic = deepCopy()
    const graphicMatrix: Graphic = store.getState('graphicMatrix')
    const groupId = generateUuid()

    const elements = fillMatrixElement(groupId, row, col)

    const [w, h] = getMatrixRect(row, col)

    const [basicX, basicY] = getBasicPos(w, h)

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
      type: GRAPHIC_TYPE,
      baseFontSize: 13,
    }

    graphicMatrix.groups[GRAPHIC_TYPE][groupId] = group

    graphicMatrix.elements = {
      ...graphicMatrix.elements,
      ...elements,
    }

    graphicMatrix.groupElements[groupId] = Object.keys(elements)

    store.updateState('graphicMatrix', graphicMatrix)
  }

  clear() {
  }
}

export default Matrix
