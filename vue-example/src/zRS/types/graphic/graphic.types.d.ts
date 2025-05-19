export interface Graphic {
    groups: Record<GroupType, Record<string, Group>>;
    elements: Record<string, Element>;
    groupElements: Record<string, string[]>;
}
export type POS = {
    x: number;
    y: number;
};
export type StripPos = 'top' | 'bottom' | 'left' | 'right';
export type IncreaseElementPos = 'before' | 'after';
export type GroupType = 'rectangle' | 'circle' | 'strip';
export interface Group {
    group_id: string;
    group_name: string;
    z_index: number;
    x: number;
    y: number;
    w: number;
    h: number;
    hover: boolean;
    size: number;
    type: GroupType;
    baseFontSize: number;
    radius?: number;
}
export type RBushGroupItem = Group & {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
export type ElementStatus = 'idle' | 'occupy' | 'full';
export interface Element {
    id: string;
    group_by: string;
    index: number;
    x: number;
    y: number;
    isDragging: boolean;
    dX: number;
    dY: number;
    width: number;
    height: number;
    highlight?: boolean;
    pos?: [number, number];
    strip?: {
        pos: StripPos;
        idx: number;
    };
    status: ElementStatus;
    text?: string;
    baseFontSize: number;
    nameFontSize: number;
}
