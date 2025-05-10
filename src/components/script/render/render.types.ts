import type {GraphicOperateFunc} from "../core/core.types.ts";

interface RenderTargetInstancesFunc {
  draw: () => void;
  clear: () => void;
  // 以下为自定义
  operate?: () => GraphicOperateFunc;
}

export interface RenderTargetInstances {
  [key: string]: RenderTargetInstancesFunc | null;
}
