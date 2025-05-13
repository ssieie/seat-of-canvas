import type {ContextMenuItem} from "./contextMenu.types.ts";
import type {OperateFunc} from "../core/core.types.ts";
import type {CSSProperties} from "vue";

type ContextMenuType = 'group' | 'element'

const zCustomWrapStyle: CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  display: 'none',
  listStyle: 'none',
  padding: '8px 6px',
  background: '#fff',
  border: '1px solid rgb(18 17 42 / 7%)',
  zIndex: '9999',
  margin: '0',
  minWidth: '146px',
  boxShadow: '0px 8px 24px rgba(25,25,26,.06), 0px 4px 16px rgba(25,25,26,.04), 0px 0px 4px rgba(25,25,26,.04)',
  borderRadius: '8px',
}

const zCustomWrapItemStyle: CSSProperties = {
  pointerEvents: 'auto',
  padding: '4px 12px',
  cursor: 'pointer',
  color: '#19191a',
  fontSize: '12px',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'space-between',
}

const zCustomWrapItemDividerStyle: CSSProperties = {
  height: '1px',
  margin: '4px 0',
  backgroundColor: 'rgb(18 17 42 / 7%)'
}

export class ContextMenu {
  private static instance: ContextMenu;
  private menuElement: HTMLUListElement | null = null;
  private readonly handleDocumentClick: ((e: MouseEvent) => void);

  contextMenuItems: Record<ContextMenuType, ContextMenuItem[]> | null = null

  constructor() {
    this.handleDocumentClick = this.hide.bind(this);
  }

  public static getInstance(): ContextMenu {
    if (!ContextMenu.instance) {
      ContextMenu.instance = new ContextMenu();
    }
    return ContextMenu.instance;
  }

  public init() {
    this.menuElement = this.createMenuElement();
    document.body.appendChild(this.menuElement);
    this.bindGlobalEvents();
  }

  private createMenuElement(): HTMLUListElement {
    const menu = document.createElement('ul');
    menu.className = 'z-custom-context-menu';
    Object.assign(menu.style, zCustomWrapStyle);
    return menu;
  }

  private populateMenuItems(items: ContextMenuItem[], parent?: HTMLUListElement): void {
    const ul = parent || this.menuElement;
    while (ul!.firstChild) {
      const child = ul!.firstChild as HTMLElement;
      child.remove();
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      const span = document.createElement('span');
      span.textContent = item.label || '';
      li.appendChild(span)
      switch (item.type) {
        case "default":
          li.className = 'z-custom-context-menu-item';
          Object.assign(li.style, zCustomWrapItemStyle);
          const handler = (_e: MouseEvent) => {
            item.onClick && item.onClick();
          };
          li.addEventListener('click', handler, {once: true});
          break
        case "divider":
          Object.assign(li.style, zCustomWrapItemDividerStyle);
          break
      }

      // 有子菜单
      if (item.children && item.children.length > 0) {
        li.classList.add('z-custom-context-sub-menu');
        const arrow = document.createElement('span');
        arrow.textContent = '▶';
        li.appendChild(arrow);

        const subMenu = document.createElement('ul');
        subMenu.className = 'z-custom-context-submenu';
        Object.assign(subMenu.style, {
          top: '0',
          left: '100%',
        }, zCustomWrapStyle);

        this.populateMenuItems(item.children, subMenu);
        li.appendChild(subMenu);
      }

      ul!.appendChild(li);
    });
  }

  public show(x: number, y: number, type: ContextMenuType): void {
    this.populateMenuItems(this.contextMenuItems?.[type] || []);
    this.menuElement!.style.left = `${x}px`;
    this.menuElement!.style.top = `${y}px`;
    this.menuElement!.style.display = 'block';
  }

  public hide(e: MouseEvent): void {
    console.log(e)
    const target = e.target as HTMLElement | null;
    if (target instanceof HTMLElement) {
      if (target.classList.contains('z-custom-context-sub-menu') || target.parentElement?.classList.contains('z-custom-context-sub-menu')) {
        return
      }
    }
    this.menuElement!.style.display = 'none';
  }

  public generateContextMenuItem(func: OperateFunc) {
    this.contextMenuItems = {
      group: [
        {label: '删除区域', type: 'default', onClick: () => console.log('删除区域')},
      ],
      element: [
        {label: '编辑人员', type: 'default', onClick: () => console.log('编辑人员')},
        {label: '占位', type: 'default', onClick: () => console.log('占位')},
        {label: '删除人员', type: 'default', onClick: () => console.log('删除人员')},
        {
          label: '向前插入', type: 'default', children: [
            {label: '插入一个', type: 'default', onClick: () => console.log('向前插入一个')}
          ]
        },
        {
          label: '向后插入', type: 'default', children: [
            {label: '插入一个', type: 'default', onClick: () => console.log('向后插入一个')}
          ]
        },
        {type: 'divider'},
        {label: '删除座位', type: 'default', onClick: () => console.log('删除座位')},
      ],
    }
  }

  private bindGlobalEvents(): void {
    document.addEventListener('click', this.handleDocumentClick!);
  }

  public destroy(): void {
    this.menuElement!.remove();
    this.contextMenuItems = null
    document.removeEventListener('click', this.handleDocumentClick!);
  }
}

export default ContextMenu
