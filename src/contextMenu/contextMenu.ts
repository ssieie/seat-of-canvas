import type { ContextMenuItem } from "./contextMenu.types";
import type { OperateFunc } from "../core/core.types";
import type {
  Element,
  Group,
  IncreaseElementPos,
} from "../graphic/graphic.types";
import type { RenderTargetInstances } from "../render/render.types";
import { deepCopy } from "../utils/common";
import {
  cancelSeatOccupancyRule,
  coveringAllRule,
  coveringRule,
  deletePersonnelRule,
  editorialStaffRule,
  occupyASeatRule,
} from "./menuRules";
import {
  moveForwardInSequence,
  movingForwardAsAWhole,
} from "../graphic/graphicUtils";

type ContextMenuType = "group" | "element";

export class ContextMenu {
  private static instance: ContextMenu;
  private menuElement: HTMLUListElement | null = null;
  private cFunc: OperateFunc | null = null;
  private readonly handleDocumentClick: (e: MouseEvent) => void;

  currentContextMenuGroup: Group | null = null;
  currentContextMenuElement: Element | null = null;

  private instances: RenderTargetInstances | null = null;

  contextMenuItems: Record<ContextMenuType, ContextMenuItem[]> | null = null;

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
    const menu = document.createElement("ul");
    menu.className = "z-custom-context-menu";
    return menu;
  }

  private populateMenuItems(
    items: ContextMenuItem[],
    parent?: HTMLUListElement
  ): void {
    const ul = parent || this.menuElement;
    if (!ul) return;

    ul.innerHTML = ""; // 清空旧的内容
    // while (ul!.firstChild) {
    //   const child = ul!.firstChild as HTMLElement;
    //   child.remove();
    // }

    for (const item of items) {
      const li = document.createElement("li");
      li.style.position = "relative";
      const span = document.createElement("span");
      span.textContent = item.label || "";
      li.appendChild(span);

      if (
        item.rule &&
        !item.rule(
          this.currentContextMenuGroup!,
          this.currentContextMenuElement!
        )
      ) {
        continue;
      }

      switch (item.type) {
        case "default":
          li.className = "z-custom-context-menu-item";
          const handler = (_e: MouseEvent) => {
            item.onClick && item.onClick();
          };
          li.addEventListener("click", handler, { once: true });
          break;
        case "divider":
          li.className = "z-custom-context-menu-item-divider";
          break;
      }

      // 有子菜单
      if (item.children && item.children.length > 0) {
        li.classList.add("z-custom-context-sub-menu");

        const arrow = document.createElement("span");
        arrow.className = "z-custom-context-sub-menu-arrow";
        li.appendChild(arrow);

        const subMenu = document.createElement("ul");
        subMenu.className = "z-custom-context-submenu";
        Object.assign(subMenu.style, {
          top: "0",
          left: "100%",
        });

        this.populateMenuItems(item.children, subMenu);
        li.appendChild(subMenu);
      }

      ul!.appendChild(li);
    }
  }

  public show(
    x: number,
    y: number,
    type: ContextMenuType,
    group: Group | null,
    element: Element | null
  ): void {
    if (!this.menuElement || !this.contextMenuItems) return;

    this.currentContextMenuGroup = deepCopy(group);
    this.currentContextMenuElement = deepCopy(element);

    // 不管行列规则统一设置为index
    if (this.currentContextMenuGroup?.index_rule === "2") {
      if (this.currentContextMenuElement) {
        this.currentContextMenuElement.index =
          this.currentContextMenuElement.index1;
      }
    }

    this.populateMenuItems(this.contextMenuItems?.[type] || []);

    if (this.menuElement) {
      this.menuElement.style.left = `${x}px`;
      this.menuElement.style.top = `${y}px`;
      //
      setTimeout(
        () => {
          this.menuElement!.classList.add("show");
        },
        this.menuElement!.classList.contains("show") ? 150 : 0
      );
      this.hide(null);
    }
  }

  public hide(e: MouseEvent | null): void {
    const target = e?.target as HTMLElement | null;

    // if (this.menuElement?.contains(target)) return;

    if (target instanceof HTMLElement) {
      if (
        target.classList.contains("z-custom-context-sub-menu") ||
        target.parentElement?.classList.contains("z-custom-context-sub-menu")
      ) {
        return;
      }
    }
    // this.menuElement!.style.display = 'none';
    this.menuElement?.classList.remove("show");
  }

  public generateContextMenuItem(func: OperateFunc) {
    this.cFunc = func;
    const insertEl = (type: IncreaseElementPos, num = 1) => {
      return func!.contextMenuOperateFunc.increaseElement.call(
        this.instances!.Graphic,
        ContextMenu.instance.currentContextMenuGroup!,
        ContextMenu.instance.currentContextMenuElement!,
        type,
        num
      );
    };
    this.contextMenuItems = {
      group: [
        {
          label: "区域编辑",
          type: "default",
          onClick: () => {
            func!.clickMenu(
              "areaEditing",
              JSON.stringify({
                group: ContextMenu.instance.currentContextMenuGroup!,
              })
            );
          },
        },
        {
          label: "导出图片",
          type: "default",
          onClick: () =>
            func!.contextMenuOperateFunc.exportToPng.call(
              this.instances!.Graphic,
              ContextMenu.instance.currentContextMenuGroup!
            ),
        },
        { type: "divider" },
        {
          label: "删除区域",
          type: "default",
          onClick: () => {
            // const res = func!.contextMenuOperateFunc.delGroup.call(
            //   this.instances!.Graphic,
            //   ContextMenu.instance.currentContextMenuGroup!
            // );
            func!.clickMenu(
              "deleteGroup",
              JSON.stringify({
                group: ContextMenu.instance.currentContextMenuGroup!,
              })
            );
          },
        },
      ],
      element: [
        {
          label: "编辑人员",
          rule: editorialStaffRule,
          type: "default",
          children: [
            {
              label: "新增人员",
              type: "default",
              onClick: () => {
                // if (ContextMenu.instance.currentContextMenuElement?.business_id) return;
                func!.clickMenu(
                  "newPersonnelAdded",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                  })
                );
              },
            },
            {
              label: "从人员库选择",
              type: "default",
              onClick: () => {
                // if (ContextMenu.instance.currentContextMenuElement?.business_id) return;
                func!.clickMenu(
                  "selectFromPersonnelPool",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                  })
                );
              },
            },
          ],
        },
        {
          label: "占位",
          rule: occupyASeatRule,
          type: "default",
          onClick: () => {
            if (ContextMenu.instance.currentContextMenuElement?.business_id)
              return;
            func!.contextMenuOperateFunc.setElementStatus.call(
              this.instances!.Graphic,
              ContextMenu.instance.currentContextMenuElement!,
              "occupy"
            );
          },
        },
        {
          label: "取消占位",
          rule: cancelSeatOccupancyRule,
          type: "default",
          onClick: () => {
            if (ContextMenu.instance.currentContextMenuElement?.business_id)
              return;
            func!.contextMenuOperateFunc.setElementStatus.call(
              this.instances!.Graphic,
              ContextMenu.instance.currentContextMenuElement!,
              "idle"
            );
          },
        },
        {
          label: "删除人员",
          rule: deletePersonnelRule,
          type: "default",
          onClick: () => {
            func!.clickMenu(
              "delPersonnel",
              JSON.stringify({
                element: ContextMenu.instance.currentContextMenuElement!,
              })
            );
          },
        },
        {
          label: "补位",
          rule: coveringRule,
          type: "default",
          children: [
            {
              label: "整体向前移动",
              type: "default",
              onClick: () => {
                const effectElement = movingForwardAsAWhole(
                  this.currentContextMenuGroup,
                  this.currentContextMenuElement
                );

                func!.clickMenu(
                  "covering",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                    effectElement,
                  })
                );
              },
            },
            {
              label: "依次向前移动",
              type: "default",
              onClick: () => {
                const effectElement = moveForwardInSequence(
                  this.currentContextMenuGroup,
                  this.currentContextMenuElement
                );

                func!.clickMenu(
                  "covering",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                    effectElement,
                  })
                );
              },
            },
          ],
        },
        {
          label: "整区域补位",
          rule: coveringAllRule,
          type: "default",
          children: [
            {
              label: "整体向前移动",
              type: "default",
              onClick: () => {
                const effectElement = movingForwardAsAWhole(
                  this.currentContextMenuGroup,
                  this.currentContextMenuElement
                );

                func!.clickMenu(
                  "covering",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                    effectElement,
                  })
                );
              },
            },
            {
              label: "依次向前移动",
              type: "default",
              onClick: () => {
                const effectElement = moveForwardInSequence(
                  this.currentContextMenuGroup,
                  this.currentContextMenuElement,
                  true
                );

                func!.clickMenu(
                  "covering",
                  JSON.stringify({
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                    effectElement,
                  })
                );
              },
            },
          ],
        },
        {
          label: "向前插入",
          type: "default",
          children: [
            {
              label: "插入一个",
              type: "default",
              onClick: () => {
                insertEl("before", 1);
                func!.clickMenu("insertOne", JSON.stringify({}));
              },
            },
            {
              label: "任意数量",
              type: "default",
              // onClick: () => insertEl('before', 2)
              onClick: () => {
                func!.clickMenu(
                  "insert",
                  JSON.stringify({
                    type: "before",
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                  })
                );
              },
            },
          ],
        },
        {
          label: "向后插入",
          type: "default",
          children: [
            {
              label: "插入一个",
              type: "default",
              onClick: () => {
                insertEl("after", 1);
                func!.clickMenu("insertOne", JSON.stringify({}));
              },
            },
            {
              label: "任意数量",
              type: "default",
              onClick: () => {
                func!.clickMenu(
                  "insert",
                  JSON.stringify({
                    type: "after",
                    group: ContextMenu.instance.currentContextMenuGroup!,
                    element: ContextMenu.instance.currentContextMenuElement!,
                  })
                );
              },
            },
          ],
        },
        { type: "divider" },
        {
          label: "删除座位",
          type: "default",
          onClick: () => {
            func!.clickMenu(
              "deleteSeat",
              JSON.stringify({
                group: ContextMenu.instance.currentContextMenuGroup!,
                element: ContextMenu.instance.currentContextMenuElement!,
              })
            );
            // func!.contextMenuOperateFunc.decreaseElement.call(
            //   this.instances!.Graphic,
            //   ContextMenu.instance.currentContextMenuGroup!,
            //   ContextMenu.instance.currentContextMenuElement!
            // );
          },
        },
      ],
    };
  }

  public sendEvent(type: string, val: string) {
    if (this.cFunc) {
      this.cFunc.clickMenu(type, val);
    }
  }

  private bindGlobalEvents(): void {
    document.addEventListener("click", this.handleDocumentClick!);
  }

  public destroy(): void {
    this.cFunc = null;
    if (this.menuElement) {
      this.menuElement.remove();
      this.menuElement = null;
    }
    this.contextMenuItems = null;
    document.removeEventListener("click", this.handleDocumentClick!);
  }
}

export default ContextMenu;
