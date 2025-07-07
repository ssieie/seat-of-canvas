import { Group, Element } from '../graphic/graphic.types';

type ContextMenuType = 'default' | 'divider';

export interface ContextMenuItem {
  label?: string;
  type: ContextMenuType;
  rule?: (group: Group, element: Element) => boolean;
  onClick?: () => void;
  children?: ContextMenuItem[];
}
