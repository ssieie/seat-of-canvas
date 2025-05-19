declare class ZoomTool {
    private static instance;
    private toolElement;
    private readonly handleToolClickBind;
    private readonly onTransformStateChangeHandlerBind;
    static getInstance(): ZoomTool;
    constructor();
    onTransformStateChangeHandler(): void;
    private scaleHandler;
    handleToolClick(e: MouseEvent): void;
    private createToolElement;
    init(): void;
    private bindGlobalEvents;
    destroy(): void;
}
export default ZoomTool;
