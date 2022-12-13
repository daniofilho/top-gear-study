interface IDefaultCoordinatesParams {
  x: number;
  y: number;
}

interface IDefaultSizesParams {
  width: number;
  height: number;
}

interface IDefaultVisualParams {
  color: string;
}

// * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

interface IDrawRectangleProps
  extends IDefaultCoordinatesParams,
    IDefaultSizesParams,
    IDefaultVisualParams {}

// * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface ICanvasDrawerProps {
  context: CanvasRenderingContext2D;
}

export interface ICanvasDrawer {
  drawRectangle: (params: IDrawRectangleProps) => void;
}
