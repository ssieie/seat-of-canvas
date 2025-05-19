export declare const getCanvas: () => HTMLCanvasElement | null;
export declare function getTransformState(): import("../container/container.type.ts").ContainerTransformState;
export declare function canvasToScreen(x: number, y: number): [number, number];
export declare const screenToCanvas: (x: number, y: number) => [number, number];
export declare function scaleSize(size: number): number;
