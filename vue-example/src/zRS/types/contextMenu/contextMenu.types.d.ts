type ContextMenuType = 'default' | 'divider';
export interface ContextMenuItem {
    label?: string;
    type: ContextMenuType;
    onClick?: () => void;
    children?: ContextMenuItem[];
}
export {};
