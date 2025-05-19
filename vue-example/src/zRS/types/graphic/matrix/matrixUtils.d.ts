import type { Element, Group, IncreaseElementPos } from "../graphic.types.ts";
export declare function getMatrixRect(row: number, col: number): [w: number, h: number];
export declare function fillMatrixElement(groupId: string, row: number, col: number, oId?: string): {
    [s: string]: Element;
};
export declare function drawMatrixGroup(ctx: CanvasRenderingContext2D, group: Group, transformation?: boolean): void;
export declare function matrixElementPosInGroup(group: Group, element: Element): {
    x: number;
    y: number;
};
export declare function drawGroupMatrixElement(ctx: CanvasRenderingContext2D, element: Element, group: Group): void;
export declare function addMatrixGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number): void;
export declare function updateMatrixGroupLayout(groupId: string): void;
