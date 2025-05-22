import {Graphic, Group, Element, IncreaseElementPos, ElementStatus, GroupType} from "../graphic/graphic.types";

export type Canvaser = {
  cvs: HTMLCanvasElement | null;
  pen: CanvasRenderingContext2D | null;
};

export type AccordingToTheRanksAddGroupOptions = {
  name: string;
  row?: number;
  col?: number;
  num: number;
  shortNum: number;
  longNum: number;
}

export type GraphicOperateFunc = {
  addMatrixGraphic: (name: string, row: number, col: number) => void
  addCircleGraphic: (name: string, num: number) => void
  addStripGraphic: (name: string, shortNum: number, longNum: number) => void
  highlightAppointEl: (groupId: string, elementId: string) => void
  accordingToTheRanksAddGroup: (row: number, col: number, type: GroupType, groupOptions: AccordingToTheRanksAddGroupOptions) => void
}

export type ContextMenuOperateFunc = {
  delGroup: (group: Group) => boolean
  exportToPng: (group: Group) => void
  increaseElement: (group: Group, element: Element, type: IncreaseElementPos, num: number) => void
  decreaseElement: (group: Group, element: Element) => void
  setElementStatus: (element: Element, status: ElementStatus) => void
}

export type OperateFunc = {
  graphicOperateFunc: GraphicOperateFunc
  contextMenuOperateFunc: ContextMenuOperateFunc
  getData: () => Graphic
  saveToImages: (name?: string, preview?: boolean) => string | boolean
  clickMenu: (callbackOrArg?: ((...args: any[]) => any) | any, ...args: any[]) => void
} | null
