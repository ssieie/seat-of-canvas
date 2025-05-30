import RuntimeStore from "../../runtimeStore/runtimeStore";
import type {Graphic, Group, GroupType} from "../graphic.types";
import {generateUuid} from "../../utils/common";
import {getBasicPos} from "../graphicUtils";
import {fillCircleElement, getCircleRect} from "./circleUtils";

const store = RuntimeStore.getInstance();

const GRAPHIC_TYPE: GroupType = 'circle'

class Circle {

  constructor() {
  }

  async addCircleGraphic(name: string, num: number, pos?: [number, number]) {
    const graphicMatrix: Graphic = store.getState('graphicMatrix')
    const groupId = generateUuid()
    const {radius, w, h} = getCircleRect(num)

    const [basicX, basicY] = pos || getBasicPos(w, h)

    const group: Group = {
      group_id: groupId,
      group_name: name,
      z_index: 0,
      x: basicX,
      y: basicY,
      w: w,
      h: h,
      hover: false,
      size: num,
      type: GRAPHIC_TYPE,
      radius,
      baseFontSize: 13,
    }

    const elements = fillCircleElement(group)

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

export default Circle
