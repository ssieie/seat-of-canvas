export type Canvaser = {
  cvs: HTMLCanvasElement | null;
  pen: CanvasRenderingContext2D | null;
};

export type GraphicFunc = {
  matrixFunc: { addMatrixGraphic: (name: string, row: number, col: number) => void }
} | null
