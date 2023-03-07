import Car from '../car';
import Level from '../level';

declare interface IUIProps extends IObjectProps {
  car: Car;
  level: Level;
  canvasWidth: number;
}
