declare interface IRenderProps {
  context: CanvasRenderingContext2D;
}

// * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

declare interface IRenderFunctionProps {
  deltaTime: number;
}

declare interface IRender {
  render: (data: IRenderFunctionProps) => void;
}
