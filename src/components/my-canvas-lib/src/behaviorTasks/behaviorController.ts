import behaviorTasksInstance from "./behaviorTasks.ts";


export function behaviorController() {
  // 指定时间间隔触发器的例子
  behaviorTasksInstance.addBehavior<number | undefined>(
    "demo",
    () => {
      return 1
    },
    (frequency) => {
      if (frequency) {
        // console.log(frequency);
        // todo 改变某个值
      }
    },
    1000 / 0.1,
    false,
  ); // 0.1 次/秒
}

export function delBehavior(key: string) {
  behaviorTasksInstance.delBehavior(key)
}

export function delBehaviorAll() {
  behaviorTasksInstance.delBehaviorAll()
}