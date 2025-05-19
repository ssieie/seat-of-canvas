import type {Element, Group} from "../../graphic/graphic.types";
import ContextMenu from "../../contextMenu/contextMenu";

const menu = ContextMenu.getInstance();

export function openMenu(e: MouseEvent, group: Group | null, element: Element | null): void {

  if (e.button === 2) {
    if (element) {
      menu.show(e.clientX, e.clientY, 'element', group, element)
      return
    }
    if (group) {
      menu.show(e.clientX, e.clientY, 'group', group, element)
    }
  }
}
