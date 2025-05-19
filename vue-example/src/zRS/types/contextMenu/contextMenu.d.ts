import type { ContextMenuItem } from "./contextMenu.types.ts";
import type { OperateFunc } from "../core/core.types.ts";
import type { Element, Group } from "../graphic/graphic.types.ts";
import type { RenderTargetInstances } from "../render/render.types.ts";
type ContextMenuType = 'group' | 'element';
export declare class ContextMenu {
    private static instance;
    private menuElement;
    private readonly handleDocumentClick;
    currentContextMenuGroup: Group | null;
    currentContextMenuElement: Element | null;
    private instances;
    contextMenuItems: Record<ContextMenuType, ContextMenuItem[]> | null;
    constructor();
    static getInstance(): ContextMenu;
    init(instances: RenderTargetInstances): void;
    private createMenuElement;
    private populateMenuItems;
    show(x: number, y: number, type: ContextMenuType, group: Group | null, element: Element | null): void;
    hide(e: MouseEvent | null): void;
    generateContextMenuItem(func: OperateFunc): void;
    private bindGlobalEvents;
    destroy(): void;
}
export default ContextMenu;
