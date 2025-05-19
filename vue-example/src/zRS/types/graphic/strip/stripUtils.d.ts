import type { Element, Group, IncreaseElementPos } from "../graphic.types.ts";
export declare function getStripRect(shortNum: number, longNum: number): number[];
export declare function fillStripElement(groupId: string, shortNum: number, longNum: number): {
    [s: string]: Element;
};
export declare function drawStripGroup(ctx: CanvasRenderingContext2D, group: Group, transformation?: boolean): void;
export declare function stripElementPosInGroup(group: Group, element: Element): {
    x: number;
    y: number;
};
export declare function drawGroupStripElement(ctx: CanvasRenderingContext2D, element: Element, group: Group): void;
export declare function addStripGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number): void;
export declare function updateStripGroupLayout(groupId: string): void;
