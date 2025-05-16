import type {ContextMenuItem} from "./contextMenu.types.ts";
import type {OperateFunc} from "../core/core.types.ts";
import type {Element, Group, IncreaseElementPos} from "../graphic/graphic.types.ts";
import type {RenderTargetInstances} from "../render/render.types.ts";

type ContextMenuType = 'group' | 'element'

export class ContextMenu {
  private static instance: ContextMenu;
  private menuElement: HTMLUListElement | null = null;
  private readonly handleDocumentClick: ((e: MouseEvent) => void);

  currentContextMenuGroup: Group | null = null;
  currentContextMenuElement: Element | null = null;

  private instances: RenderTargetInstances | null = null;

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

  public init(instances: RenderTargetInstances) {
    if (this.menuElement) return;
    this.instances = instances;
    this.menuElement = this.createMenuElement();
    document.body.appendChild(this.menuElement);
    this.bindGlobalEvents();
  }

  private createMenuElement(): HTMLUListElement {
    const menu = document.createElement('ul');
    menu.className = 'z-custom-context-menu';
    return menu;
  }

  private populateMenuItems(items: ContextMenuItem[], parent?: HTMLUListElement): void {
    const ul = parent || this.menuElement;
    if (!ul) return;

    ul.innerHTML = ''; // 清空旧的内容
    // while (ul!.firstChild) {
    //   const child = ul!.firstChild as HTMLElement;
    //   child.remove();
    // }

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.position = 'relative';
      const span = document.createElement('span');
      span.textContent = item.label || '';
      li.appendChild(span)
      switch (item.type) {
        case "default":
          li.className = 'z-custom-context-menu-item';
          const handler = (_e: MouseEvent) => {
            item.onClick && item.onClick();
          };
          li.addEventListener('click', handler, {once: true});
          break
        case "divider":
          li.className = 'z-custom-context-menu-item-divider';
          break
      }

      // 有子菜单
      if (item.children && item.children.length > 0) {
        li.classList.add('z-custom-context-sub-menu');

        const arrow = document.createElement('span');
        arrow.className = 'z-custom-context-sub-menu-arrow';
        li.appendChild(arrow);

        const subMenu = document.createElement('ul');
        subMenu.className = 'z-custom-context-submenu';
        Object.assign(subMenu.style, {
          top: '0',
          left: '100%',
        });

        this.populateMenuItems(item.children, subMenu);
        li.appendChild(subMenu);
      }

      ul!.appendChild(li);
    });
  }

  public show(x: number, y: number, type: ContextMenuType, group: Group | null, element: Element | null): void {
    if (!this.menuElement || !this.contextMenuItems) return;
    this.currentContextMenuGroup = group;
    this.currentContextMenuElement = element;
    this.populateMenuItems(this.contextMenuItems?.[type] || []);

    if (this.menuElement) {
      this.menuElement.style.left = `${x}px`;
      this.menuElement.style.top = `${y}px`;
      //
      setTimeout(() => {
        this.menuElement!.classList.add('show');
      }, this.menuElement!.classList.contains('show') ? 150 : 0)
      this.hide(null)
    }

  }

  public hide(e: MouseEvent | null): void {


    const target = e?.target as HTMLElement | null;

    // if (this.menuElement?.contains(target)) return;

    if (target instanceof HTMLElement) {
      if (target.classList.contains('z-custom-context-sub-menu') || target.parentElement?.classList.contains('z-custom-context-sub-menu')) {
        return
      }
    }
    // this.menuElement!.style.display = 'none';
    this.menuElement?.classList.remove('show');
  }

  public generateContextMenuItem(func: OperateFunc) {
    const insertEl = (type: IncreaseElementPos, num = 1) => {
      return func!.contextMenuOperateFunc.increaseElement.call(this.instances!.Graphic, ContextMenu.instance.currentContextMenuGroup!, ContextMenu.instance.currentContextMenuElement!, type, num)
    }
    this.contextMenuItems = {
      group: [
        {
          label: '区域编辑',
          type: 'default',
          onClick: () => {
          }
        },
        {
          label: '导出图片',
          type: 'default',
          onClick: () => func!.contextMenuOperateFunc.exportToPng.call(this.instances!.Graphic, ContextMenu.instance.currentContextMenuGroup!)
        },
        {type: 'divider'},
        {
          label: '删除区域',
          type: 'default',
          onClick: () => func!.contextMenuOperateFunc.delGroup.call(this.instances!.Graphic, ContextMenu.instance.currentContextMenuGroup!)
        },
      ],
      element: [
        {label: '编辑人员', type: 'default', onClick: () => console.log('编辑人员')},
        {
          label: '占位', type: 'default',
          onClick: () => func!.contextMenuOperateFunc.setElementStatus.call(this.instances!.Graphic, ContextMenu.instance.currentContextMenuElement!, 'occupy')
        },
        {label: '删除人员', type: 'default', onClick: () => console.log('删除人员')},
        {
          label: '向前插入', type: 'default', children: [
            {
              label: '插入一个', type: 'default',
              onClick: () => insertEl('before', 1)
            },
            {
              label: '任意数量', type: 'default',
              onClick: () => insertEl('before', 2)
            }
          ]
        },
        {
          label: '向后插入', type: 'default', children: [
            {
              label: '插入一个', type: 'default',
              onClick: () => insertEl('after', 1)
            },
            {
              label: '任意数量', type: 'default',
              onClick: () => insertEl('after', 2)
            }
          ]
        },
        {type: 'divider'},
        {
          label: '删除座位', type: 'default',
          onClick: () => func!.contextMenuOperateFunc.decreaseElement.call(this.instances!.Graphic, ContextMenu.instance.currentContextMenuGroup!, ContextMenu.instance.currentContextMenuElement!)
        },
      ],
    }
  }

  private bindGlobalEvents(): void {
    document.addEventListener('click', this.handleDocumentClick!);
  }

  public destroy(): void {
    if (this.menuElement) {
      this.menuElement.remove();
      this.menuElement = null;
    }
    this.contextMenuItems = null
    document.removeEventListener('click', this.handleDocumentClick!);
  }
}

export default ContextMenu
