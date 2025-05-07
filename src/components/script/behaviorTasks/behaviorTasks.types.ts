export interface BehaviorTasksValueType<T> {
  event: () => T;
  call: (arg0: T) => void;
  interval: number;
  lastExecuteTime: number;
}
