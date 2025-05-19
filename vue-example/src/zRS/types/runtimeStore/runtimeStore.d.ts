import type { ContainerTransformState } from "../container/container.type.ts";
import type { Element, Graphic, Group, GroupType, RBushGroupItem } from "../graphic/graphic.types.ts";
import RBush from 'rbush';
export declare const allGraphicGroups: GroupType[];
type RuntimeState = {
    highlightElements: boolean;
    currentDragEl: Element | null;
    cvs: HTMLCanvasElement | null;
    containerTransformState: ContainerTransformState;
    graphicMatrix: Graphic;
    groupTree: RBush<RBushGroupItem>;
};
export declare function rebuildGroupTree(store: RuntimeStore): void;
declare class RuntimeStore {
    private static instance;
    private state;
    private listeners;
    private constructor();
    static getInstance(): RuntimeStore;
    getState(): RuntimeState;
    getState<K extends keyof RuntimeState>(key: K): RuntimeState[K];
    getState<K extends keyof RuntimeState>(...keys: K[]): Pick<RuntimeState, K>;
    updateState<K extends keyof RuntimeState>(key: K, value: RuntimeState[K]): void;
    subscribe<K extends keyof RuntimeState>(key: K, listener: (val: RuntimeState[K], old: RuntimeState[K]) => void, immediately?: boolean): void;
    unsubscribe<K extends keyof RuntimeState>(key: K, listener: (val: RuntimeState[K], old: RuntimeState[K]) => void): void;
    unsubscribeAll(): void;
    private notify;
    getGraphicGroups(graphic: GroupType[]): Map<string, Group>;
    getGraphicGroupsArr(): Group[];
    getGraphicGroupsById(groupId: string): Group | null;
    getGraphicGroupElementsById(groupId: string): Element[];
    getGraphicGroupElementById(elementId: string): Element | null;
    reset(): void;
    destroy(): void;
}
export default RuntimeStore;
