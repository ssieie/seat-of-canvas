import behaviorTasksInstance from "./behaviorTasks";
import {Element} from "../graphic/graphic.types";


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

export function elementIntervalHighlight(el: Element) {
  if (behaviorTasksInstance.hasBehavior('elementIntervalHighlight')) return
  let count = 0;
  behaviorTasksInstance.addBehavior<number>(
    "elementIntervalHighlight",
    () => {
      el.highlight = !el.highlight;
      return count++
    },
    (count) => {
      if (count === 5){
        delBehavior('elementIntervalHighlight')
      }
    },
    1000 / 3,
    false,
  ); // 3 次/秒
}

export function delBehavior(key: string) {
  behaviorTasksInstance.delBehavior(key)
}

export function delBehaviorAll() {
  behaviorTasksInstance.delBehaviorAll()
}
