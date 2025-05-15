import type {Graphic, Group} from "../graphic/graphic.types.ts";

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
}

export type OperateFunc = {
  graphicOperateFunc: GraphicOperateFunc
  contextMenuOperateFunc: ContextMenuOperateFunc
  getData: () => Graphic
} | null
