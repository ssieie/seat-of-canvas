import type {ContextMenuOperateFunc, GraphicOperateFunc} from "../core/core.types";

interface RenderTargetInstancesFunc {
  draw: () => void;
  clear: () => void;
  // 以下为自定义
  operate?: () => GraphicOperateFunc;
  contextMenuOperate?: () => ContextMenuOperateFunc;
}

export interface RenderTargetInstances {
  [key: string]: RenderTargetInstancesFunc | null;
}
