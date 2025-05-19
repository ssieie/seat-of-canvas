import type { Element, Group, IncreaseElementPos, POS } from "../graphic.types.ts";
export declare function getCircleRect(num: number): {
    radius: number;
    w: number;
    h: number;
};
export declare function fillCircleElement(group: Group): {
    [s: string]: Element;
};
export declare function addCircleGroupElement(groupTree: Group, element: Element, type: IncreaseElementPos, num: number): void;
export declare function updateCircleGroupLayout(groupId: string): void;
export declare function drawCircleGroup(ctx: CanvasRenderingContext2D, group: Group): void;
export declare function drawGroupName(ctx: CanvasRenderingContext2D, group: Group, centerOfACirclePos: POS): void;
export declare function circleElementPosInGroup(group: Group, element: Element): {
    x: number;
    y: number;
};
export declare function drawGroupCircleElement(ctx: CanvasRenderingContext2D, element: Element, group: Group): void;
