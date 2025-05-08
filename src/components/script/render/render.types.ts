interface RenderTargetInstancesFunc {
  draw: () => void;
  clear: () => void;
  // 以下为自定义
  addMatrixGraphic?: (name: string, row: number, col: number) => void;
}

export interface RenderTargetInstances {
  [key: string]: RenderTargetInstancesFunc | null;
}
