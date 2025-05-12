import RuntimeStore from "../../runtimeStore/runtimeStore.ts";
import type {Graphic, Group, GroupType} from "../graphic.types.ts";
import {generateUuid} from "../../utils/common.ts";
import {getBasicPos} from "../graphicUtils.ts";
import {fillCircleElement, getCircleRect} from "./circleUtils.ts";

const store = RuntimeStore.getInstance();

const GRAPHIC_TYPE: GroupType = 'circle'

class Circle {

  graphicData: Graphic

  constructor() {
    this.graphicData = store.getState('graphicMatrix')
  }

  async addCircleGraphic(name: string, num: number) {
    const graphicMatrix: Graphic = this.graphicData
    const groupId = generateUuid()
    const {radius, w, h} = getCircleRect(num)

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
      size: num,
      type: GRAPHIC_TYPE,
      radius,
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
