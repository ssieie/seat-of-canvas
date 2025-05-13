import type {Element, Group} from "../../graphic/graphic.types.ts";
import RuntimeStore from "../../runtimeStore/runtimeStore.ts";

const store = RuntimeStore.getInstance();

export function openMenu(e: MouseEvent, group: Group | null, element: Element | null): void {
  const menu = store.getState('ContextMenuInstance')

  if (e.button === 2) {
    if (element) {
      menu.show(e.clientX, e.clientY, 'element')
      return
    }
    if (group) {
      menu.show(e.clientX, e.clientY, 'group')
    }
  }
}
