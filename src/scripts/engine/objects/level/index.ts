import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import Car from '../car';
import { ILevelProps } from './types';

class Level {
  drawer?: ICanvasDrawer;
  car?: Car;

  sky = {
    height: config.canvas.height * 0.5,
    color: '#3983d1', // TODO parâmetro
  };

  lines = new Array(config.canvas.height / 2).fill('');
  lineHeight = (config.canvas.height - this.sky.height) / this.lines.length;

  roadProps = {
    color: '#555555', // TODO parâmetro
    width: (config.canvas.width * 0.8) / 2, // Road takes 60% of screen, but / 2 is to make road symmetrical on both sides
  };

  grassProps = {
    colors: ['#20aa20', '#20BB20'],
    frequency: 30,
  };

  roadLineProps = {
    colors: ['#AA0000', '#FFFFFF'],
    width: this.roadProps.width * 0.1,
    frequency: 100,
  };

  centerX = config.canvas.width / 2;

  constructor({ context, car }: ILevelProps) {
    this.drawer = CanvasDrawer({ context });
    this.car = car;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({ deltaTime }: IRenderObjectProps) => {
    this.lines.map((_, index) => {
      if (!this.drawer || !this.car) return;

      const initialY = this.sky.height + index * this.lineHeight;

      let perspective = index / (config.canvas.height / 2);
      perspective = 0.2 + perspective * 0.7; // limit perspective to goes from 30% to 90%

      const variableRoadWidth = this.roadProps.width * perspective;

      const road = {
        ...this.roadProps,
        x: this.centerX - variableRoadWidth,
        //width: 0.1 + variableRoadWidth * 0.8,
        width: variableRoadWidth,
      };

      const roadLine = {
        ...this.roadLineProps,
        color:
          Math.sin(
            this.roadLineProps.frequency * Math.pow(1 - perspective, 2) + this.car.speed * 0.5
          ) > 0
            ? this.roadLineProps.colors[0]
            : this.roadLineProps.colors[1],
        left: {
          x: this.centerX - road.width - this.roadLineProps.width,
        },
        right: {
          x: this.centerX + road.width,
        },
      };

      const grass = {
        ...this.grassProps,
        width: this.centerX - road.width - this.roadLineProps.width,
        color:
          Math.sin(
            this.grassProps.frequency * Math.pow(1 - perspective, 2) + this.car.speed * 0.5
          ) > 0
            ? this.grassProps.colors[0]
            : this.grassProps.colors[1],
        right: {
          x: this.centerX + road.width + this.roadLineProps.width,
        },
      };

      // # Left Grass
      this.drawer.rectangle({
        color: grass.color,
        x: 0,
        y: initialY,
        width: grass.width,
        height: this.lineHeight,
      });

      // # Left Road Line
      this.drawer.rectangle({
        color: roadLine.color,
        x: roadLine.left.x,
        y: initialY,
        width: roadLine.width,
        height: this.lineHeight,
      });

      // # Road
      this.drawer.rectangle({
        color: road.color,
        x: road.x,
        y: initialY,
        width: road.width * 2,
        height: this.lineHeight,
      });

      // # Right Grass
      this.drawer.rectangle({
        color: grass.color,
        x: grass.right.x,
        y: initialY,
        width: grass.width,
        height: this.lineHeight,
      });

      // # Right Road Line
      this.drawer.rectangle({
        color: roadLine.color,
        x: roadLine.right.x,
        y: initialY,
        width: roadLine.width,
        height: this.lineHeight,
      });

      // ! Debug
      this.drawer.rectangle({
        color: '#FF0000',
        x: this.centerX,
        y: initialY,
        width: 1,
        height: this.lineHeight,
      });
    });
  };
}

export default Level;
