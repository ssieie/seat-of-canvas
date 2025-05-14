import type {Graphic} from "../graphic/graphic.types.ts";

export type Canvaser = {
  cvs: HTMLCanvasElement | null;
  pen: CanvasRenderingContext2D | null;
};

export type GraphicOperateFunc = {
  addMatrixGraphic: (name: string, row: number, col: number) => void
  addCircleGraphic: (name: string, num: number) => void
  addStripGraphic: (name: string, shortNum: number, longNum: number) => void
}

export type OperateFunc = {
  graphicOperateFunc: GraphicOperateFunc
  getData: () => Graphic
} | null
