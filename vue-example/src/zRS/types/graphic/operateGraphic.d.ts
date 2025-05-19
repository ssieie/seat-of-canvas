import type { Canvaser } from "../core/core.types.ts";
import type { Element, ElementStatus, Group, IncreaseElementPos } from "./graphic.types.ts";
declare class OperateGraphic {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    lastMousePos: {
        x: number;
        y: number;
    } | null;
    private currentGroup;
    private dragging;
    private currentElement;
    private elDragging;
    constructor(cv: Canvaser);
    private addGroupEvents;
    private addElementEvents;
    elementStopDragging(e: MouseEvent): void;
    stopDraggingHandler(_e: MouseEvent, offScreen?: boolean): void;
    delGroup(group: Group): boolean;
    exportToPng(group: Group): void;
    increaseElement(group: Group, element: Element, type: IncreaseElementPos, num: number): void;
    decreaseElement(group: Group, element: Element): void;
    setElementStatus(element: Element, type: ElementStatus): void;
    clear(): void;
}
export default OperateGraphic;
