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

interface IRectangleProps
  extends IDefaultCoordinatesParams,
    IDefaultSizesParams,
    IDefaultVisualParams {}
interface ITextProps extends IDefaultCoordinatesParams, IDefaultVisualParams {
  text: string;
  fontSize: string;
}

interface IImageProps extends IDefaultCoordinatesParams, IDefaultSizesParams {
  image: HTMLImageElement;
  destinationX: number;
  destinationY: number;
  destinationWidth: number;
  destinationHeight: number;
}

// * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface ICanvasDrawerProps {
  context: CanvasRenderingContext2D;
}

export interface ICanvasDrawer {
  rectangle: (params: IRectangleProps) => void;
  text: (params: ITextProps) => void;
  image: (params: IImageProps) => void;
}
