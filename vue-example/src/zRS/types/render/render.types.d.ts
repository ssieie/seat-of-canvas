import type { ContextMenuOperateFunc, GraphicOperateFunc } from "../core/core.types.ts";
interface RenderTargetInstancesFunc {
    draw: () => void;
    clear: () => void;
    operate?: () => GraphicOperateFunc;
    contextMenuOperate?: () => ContextMenuOperateFunc;
}
export interface RenderTargetInstances {
    [key: string]: RenderTargetInstancesFunc | null;
}
export {};
