import RuntimeStore from "../../runtimeStore/runtimeStore";
import type {Graphic, Group, GroupType} from "../graphic.types";
import {generateUuid} from "../../utils/common";
import {getBasicPos} from "../graphicUtils";
import {fillStripElement, getStripRect} from "./stripUtils";

const store = RuntimeStore.getInstance();

const GRAPHIC_TYPE: GroupType = 'strip'

class Strip {

  constructor() {
  }

  async addStripGraphic(name: string, shortNum: number, longNum: number, pos?: [number, number]) {
    const graphicMatrix: Graphic = store.getState('graphicMatrix')
    const groupId = generateUuid()
    const [w, h] = getStripRect(shortNum, longNum)

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
      size: shortNum * 2 + longNum * 2,
      type: GRAPHIC_TYPE,
      baseFontSize: 13,
    }

    const elements = fillStripElement(groupId, shortNum, longNum)

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

export default Strip
