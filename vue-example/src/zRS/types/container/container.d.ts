import type { Canvaser } from "../core/core.types.ts";
import type { ContainerTransformState } from "./container.type.ts";
export declare const MAX_SCALE = 3;
export declare const MIN_SCALE = 0.2;
export declare function scaleToPercentage(): number;
export declare function percentageToScale(percentage: number): number;
export declare function scaleContainerHandler(e: WheelEvent): void;
declare class Container {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    private dragging;
    transformState: ContainerTransformState;
    onTransformStateChangeHandler: (newVal: ContainerTransformState) => void;
    constructor(w: number, h: number, cv: Canvaser);
    onTransformStateChange(newVal: ContainerTransformState): void;
    resize(width: number, height: number): void;
    private addEvents;
    resetTransform(): void;
    clear(): void;
}
export default Container;
