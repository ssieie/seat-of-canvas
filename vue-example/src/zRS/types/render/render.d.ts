import type { RenderTargetInstances } from "./render.types.ts";
import type { Canvaser } from "../core/core.types.ts";
declare class Render {
    cvs: HTMLCanvasElement;
    $: CanvasRenderingContext2D;
    fps: number;
    fpsInterval: number;
    lastRenderTime: number;
    frame: number | undefined;
    constructor(fps: number, context: Canvaser);
    run(instances: RenderTargetInstances): void;
    clear(): void;
    private clearScreen;
    private renderGrid;
    private renderInstances;
    private processBehavior;
}
export default Render;
