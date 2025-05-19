import type {BehaviorTasksValueType} from "./behaviorTasks.types";

class BehaviorTasks {
  behaviorTasks: Map<string, BehaviorTasksValueType<any>>;

  constructor() {
    this.behaviorTasks = new Map(); // 维护一个行为调度器
  }

  get getBehaviorTasksSize() {
    return this.behaviorTasks.size;
  }

  addBehavior<T>(
    eventKey: string,
    event: () => T,
    call: (arg0: T) => void,
    interval: number,
    executeImmediately?: boolean,
  ) {
    this.behaviorTasks.set(eventKey, {
      event,
      call,
      interval,
      lastExecuteTime: executeImmediately ? performance.now() - interval : performance.now(),
    });
  }

  delBehavior(key: string) {
    return this.behaviorTasks.delete(key);
  }

  delBehaviorAll() {
    this.behaviorTasks.clear();
  }

  behaviorProcess(currentTime: number) {
    this.behaviorTasks.forEach((task, _key) => {
      let sendElapsed = currentTime - task.lastExecuteTime;
      if (sendElapsed > task.interval) {
        task.lastExecuteTime = currentTime - (sendElapsed % task.interval);

        const res = task.event();

        task.call && task.call(res);
      }
    });
  }
}

const behaviorTasksInstance = new BehaviorTasks()
export default behaviorTasksInstance