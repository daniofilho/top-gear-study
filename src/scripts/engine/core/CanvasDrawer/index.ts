import { ICanvasDrawer, IDrawRectangleProps, ICanvasDrawerProps } from './types';

const CanvasDrawer = ({ context }: ICanvasDrawerProps): ICanvasDrawer => ({
  drawRectangle: ({ color, x, y, height, width }: IDrawRectangleProps) => {
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  },
});

export default CanvasDrawer;
