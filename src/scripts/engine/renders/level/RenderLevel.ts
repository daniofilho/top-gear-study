import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';

import { IRenderLevel, IRenderLevelProps } from './types';

const RenderLevel = ({ context }: IRenderLevelProps): IRenderLevel => {
  // Props
  const sky = {
    height: config.canvas.height * 0.5,
    color: '#3983d1', // TODO parâmetro
  };

  const lines = new Array(config.track.resolution).fill('');
  const lineHeight = (config.canvas.height - sky.height) / lines.length;

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Level props

  const grassColor = '#30aa23'; // TODO parâmetro

  const floor = {
    color: '#111111', // TODO parâmetro
    width: config.canvas.width * 0.05,
  };

  const line = {
    color: '#FFFFFF',
    width: config.canvas.width * 0.01,
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const drawer = CanvasDrawer({ context });

  const centerX = config.canvas.width / 2;

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const render = ({ deltaTime }: IRenderFunctionProps) => {
    // Sky
    drawer.drawRectangle({
      color: sky.color,
      x: 0,
      y: 0,
      width: config.canvas.width,
      height: sky.height,
    });

    lines.map((_, index) => {
      const y = sky.height + index * lineHeight;

      // "curve" the far
      const modifier = index * 5;

      // Grass
      drawer.drawRectangle({
        color: grassColor,
        x: 0,
        y,
        width: config.canvas.width,
        height: lineHeight,
      });

      // Line 01
      const line01X = centerX - floor.width / 2 - modifier;
      drawer.drawRectangle({
        color: line.color,
        x: line01X,
        y,
        width: line.width,
        height: lineHeight,
      });

      // Floor
      const floorX = line01X + line.width;
      drawer.drawRectangle({
        color: floor.color,
        x: floorX,
        y,
        width: floor.width + modifier * 2,
        height: lineHeight,
      });

      // Line 02
      const line02X = floorX + floor.width + modifier * 2;
      drawer.drawRectangle({
        color: line.color,
        x: line02X,
        y,
        width: line.width,
        height: lineHeight,
      });

      // Center line
      if (index % 2 === 0) {
        const centerLineX = centerX - line.width / 2;
        drawer.drawRectangle({
          color: line.color,
          x: centerLineX,
          y,
          width: line.width,
          height: lineHeight,
        });
      }
    });
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return {
    render,
  };
};

export default RenderLevel;
