import type { Graphic } from "../graphic.types.ts";
declare class Circle {
    graphicData: Graphic;
    constructor();
    addCircleGraphic(name: string, num: number): Promise<void>;
    clear(): void;
}
export default Circle;
