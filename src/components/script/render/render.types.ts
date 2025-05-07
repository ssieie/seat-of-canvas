
interface RenderTargetInstancesFunc {
  draw: () => void;
  clear: () => void;
  resize?: (w: number, h: number) => void;
  // 以下为自定义
  changeWalkStatus?: () => void;
}

export interface RenderTargetInstances {
  [key: string]: RenderTargetInstancesFunc | null;
}
