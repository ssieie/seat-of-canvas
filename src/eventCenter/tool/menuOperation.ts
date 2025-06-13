import type {Element, Group} from "../../graphic/graphic.types";
import ContextMenu from "../../contextMenu/contextMenu";
import RuntimeStore from "../../runtimeStore/runtimeStore";

const menu = ContextMenu.getInstance();

export function openMenu(e: MouseEvent, group: Group | null, element: Element | null): void {

  if (e.button === 2) {
    if (RuntimeStore.getInstance().getState('canvasState') ==='freeze') return;
    if (element) {
      menu.show(e.clientX, e.clientY, 'element', group, element)
      return
    }
    if (group) {
      menu.show(e.clientX, e.clientY, 'group', group, element)
    }
  }
}
