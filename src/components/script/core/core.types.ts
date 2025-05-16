import type {Graphic, Group, Element, IncreaseElementPos, ElementStatus} from "../graphic/graphic.types.ts";

export type Canvaser = {
  cvs: HTMLCanvasElement | null;
  pen: CanvasRenderingContext2D | null;
};

export type GraphicOperateFunc = {
  addMatrixGraphic: (name: string, row: number, col: number) => void
  addCircleGraphic: (name: string, num: number) => void
  addStripGraphic: (name: string, shortNum: number, longNum: number) => void
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
  saveToImages: () => void
} | null
