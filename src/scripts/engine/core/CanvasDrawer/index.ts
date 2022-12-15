import { ICanvasDrawer, IRectangleProps, ICanvasDrawerProps, ITextProps } from './types';

const CanvasDrawer = ({ context }: ICanvasDrawerProps): ICanvasDrawer => ({
  rectangle: ({ color, x, y, height, width }: IRectangleProps) => {
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  },
  text: ({ color, x, y, text, fontSize }: ITextProps) => {
    context.font = `${fontSize} Arial`;
    context.fillStyle = color;
    context.fillText(text, x, y);
  },
});

export default CanvasDrawer;
