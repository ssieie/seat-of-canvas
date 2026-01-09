import './css/style.css';
import { init, exit } from './src';

// 全局变量
let operateFunc: any = null;
let currentContextGroup: any = null;
let currentContextElement: any = null;
let groupCounter = 1;

// 工具函数
const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
  const container = document.getElementById('toast-container')!;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

const updateStatus = () => {
  if (!operateFunc) return;
  const data = operateFunc.getData();
  const groupCount = Object.keys(data.graphic.groups.rectangle).length +
    Object.keys(data.graphic.groups.circle).length +
    Object.keys(data.graphic.groups.strip).length;
  const seatCount = Object.keys(data.graphic.elements).length;
  document.getElementById('group-count')!.textContent = `组: ${groupCount}`;
  document.getElementById('seat-count')!.textContent = `座位: ${seatCount}`;
};

const hideAllMenus = () => {
  document.getElementById('context-menu')!.classList.remove('show');
  document.getElementById('batch-dialog')!.classList.remove('show');
  document.getElementById('rename-dialog')!.classList.remove('show');
};

// 添加区域
(window as any).addGroup = (type: string, rows?: number, cols?: number) => {
  if (!operateFunc) return;
  const name = `区域${groupCounter++}`;
  const funcs = operateFunc.graphicOperateFunc;

  switch (type) {
    case 'rectangle':
      funcs.addMatrixGraphic(name, rows || 3, cols || 3);
      break;
    case 'circle':
      funcs.addCircleGraphic(name, rows || 6);
      break;
    case 'strip':
      funcs.addStripGraphic(name, rows || 2, cols || 4);
      break;
  }
  updateStatus();
  showToast(`已添加${name}`, 'success');
};

// 批量添加对话框
(window as any).showBatchDialog = () => {
  document.getElementById('batch-dialog')!.classList.add('show');
};

(window as any).hideBatchDialog = () => {
  document.getElementById('batch-dialog')!.classList.remove('show');
};

(window as any).confirmBatchAdd = () => {
  const type = document.getElementById('batch-type') as HTMLSelectElement;
  const rows = parseInt((document.getElementById('batch-rows') as HTMLInputElement).value);
  const cols = parseInt((document.getElementById('batch-cols') as HTMLInputElement).value);
  const seats = parseInt((document.getElementById('batch-seats') as HTMLInputElement).value);

  if (!operateFunc) return;

  const options: Record<string, any> = {
    name: [],
    setName: `批量组`,
    num: seats,
    shortNum: Math.ceil(seats / 3),
    longNum: Math.ceil(seats / 2),
  };

  for (let i = 0; i < rows * cols; i++) {
    options.name.push(`${groupCounter++}区`);
  }

  operateFunc.graphicOperateFunc.accordingToTheRanksAddGroup(rows, cols, type as any, options);
  hideAllMenus();
  updateStatus();
  showToast(`已批量添加 ${rows * cols} 个区域`, 'success');
};

// 右键菜单
const showContextMenu = (e: MouseEvent, group: any, element: any) => {
  e.preventDefault();
  currentContextGroup = group;
  currentContextElement = element;

  const menu = document.getElementById('context-menu')!;
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;
  menu.classList.add('show');
};

(window as any).deleteGroup = () => {
  if (!operateFunc || !currentContextGroup) return;
  operateFunc.contextMenuOperateFunc.delGroup(currentContextGroup);
  hideAllMenus();
  updateStatus();
  showToast('区域已删除', 'info');
};

(window as any).insertSeat = (pos: 'before' | 'after') => {
  if (!operateFunc || !currentContextElement || !currentContextGroup) return;
  operateFunc.contextMenuOperateFunc.increaseElement(
    currentContextGroup,
    currentContextElement,
    pos,
    1
  );
  hideAllMenus();
  updateStatus();
  showToast('座位已插入', 'success');
};

(window as any).setSeatStatus = (status: 'idle' | 'occupy' | 'full') => {
  if (!operateFunc || !currentContextElement) return;
  operateFunc.contextMenuOperateFunc.setElementStatus(currentContextElement, status);
  hideAllMenus();
  showToast(`状态已设为${status}`, 'info');
};

(window as any).renameGroup = () => {
  document.getElementById('rename-input')!.value = currentContextGroup?.group_name || '';
  document.getElementById('rename-set-input')!.value = currentContextGroup?.group_set_name || '';
  document.getElementById('rename-dialog')!.classList.add('show');
};

(window as any).hideRenameDialog = () => {
  document.getElementById('rename-dialog')!.classList.remove('show');
};

(window as any).confirmRename = () => {
  if (!operateFunc || !currentContextGroup) return;
  const name = (document.getElementById('rename-input') as HTMLInputElement).value;
  const setName = (document.getElementById('rename-set-input') as HTMLInputElement).value;
  operateFunc.contextMenuOperateFunc.updateGroupName(currentContextGroup.group_id, name, setName);
  hideAllMenus();
  showToast('重命名成功', 'success');
};

(window as any).exportGroup = () => {
  if (!operateFunc || !currentContextGroup) return;
  operateFunc.contextMenuOperateFunc.exportToPng(currentContextGroup);
  hideAllMenus();
  showToast('区域已导出', 'success');
};

// 导出数据
(window as any).exportData = () => {
  if (!operateFunc) return;
  const data = operateFunc.getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `座位数据_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据已导出', 'success');
};

// 导入数据
(window as any).importData = () => {
  document.getElementById('import-input')!.click();
};

(window as any).clearCanvas = () => {
  if (!operateFunc) return;
  if (confirm('确定要清空所有内容吗？')) {
    operateFunc.resetData();
    updateStatus();
    showToast('画布已清空', 'info');
  }
};

// 文件导入处理
const importInput = document.getElementById('import-input') as HTMLInputElement;
importInput.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !operateFunc) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string);
      operateFunc.setData(data);
      updateStatus();
      showToast('数据已导入', 'success');
    } catch {
      showToast('导入失败', 'error');
    }
  };
  reader.readAsText(file);
  target.value = '';
});

// 视图切换
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 点击其他区域关闭菜单
document.addEventListener('click', hideAllMenus);

// 阻止右键菜单默认行为
document.getElementById('canvas-container')?.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// 初始化
const initCanvas = async () => {
  const container = document.getElementById('canvas-container')!;
  container.addEventListener('contextmenu', (e) => e.preventDefault());

  try {
    operateFunc = await init(container, 60);

    // 监听画布内事件
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('contextmenu', (e: MouseEvent) => {
        // 通知库显示上下文菜单
        operateFunc.clickMenu?.((group: any, element: any) => {
          showContextMenu(e, group, element);
        });
      });
    }

    // 初始示例数据
    operateFunc.graphicOperateFunc.addMatrixGraphic('A区', 3, 3);
    operateFunc.graphicOperateFunc.addCircleGraphic('B区', 8);
    operateFunc.graphicOperateFunc.addStripGraphic('C区', 2, 4);

    updateStatus();
    showToast('画布初始化完成', 'success');
  } catch (error) {
    console.error('初始化失败:', error);
    showToast('初始化失败', 'error');
  }
};

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (operateFunc) {
    exit();
  }
});

initCanvas();
