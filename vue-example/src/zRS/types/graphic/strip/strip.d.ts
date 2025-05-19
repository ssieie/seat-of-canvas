import type { Graphic } from "../graphic.types.ts";
declare class Strip {
    graphicData: Graphic;
    constructor();
    addStripGraphic(name: string, shortNum: number, longNum: number): Promise<void>;
    clear(): void;
}
export default Strip;
