import type { Element, RBushGroupItem } from "../../graphic/graphic.types.ts";
export declare const mousemoveTargetHandler: (e: MouseEvent) => void;
export declare function updateHoverState(hitIds: Set<string>): void;
export declare const mousemoveTargetThrottleHandler: any;
export declare const didNotHitAnyElement: (e: MouseEvent) => RBushGroupItem | null;
export declare const hitElement: (e: MouseEvent, group: RBushGroupItem) => Element | null;
