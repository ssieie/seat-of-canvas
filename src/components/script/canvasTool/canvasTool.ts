class CanvasTool {
  private static instance: CanvasTool;

  static getInstance(): CanvasTool {
    if (!CanvasTool.instance) {
      CanvasTool.instance = new CanvasTool();
    }
    return CanvasTool.instance;
  }

  //
}

export default CanvasTool;
