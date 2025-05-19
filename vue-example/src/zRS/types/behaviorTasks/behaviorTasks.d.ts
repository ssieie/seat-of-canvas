import type { BehaviorTasksValueType } from "./behaviorTasks.types.ts";
declare class BehaviorTasks {
    behaviorTasks: Map<string, BehaviorTasksValueType<any>>;
    constructor();
    get getBehaviorTasksSize(): number;
    addBehavior<T>(eventKey: string, event: () => T, call: (arg0: T) => void, interval: number, executeImmediately?: boolean): void;
    delBehavior(key: string): boolean;
    delBehaviorAll(): void;
    behaviorProcess(currentTime: number): void;
}
declare const behaviorTasksInstance: BehaviorTasks;
export default behaviorTasksInstance;
