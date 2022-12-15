import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import Car from '../../objects/car';
import { IUIProps } from './types';

class UI {
  drawer?: ICanvasDrawer;
  car?: Car;

  constructor({ context, car }: IUIProps) {
    this.drawer = CanvasDrawer({ context });
    this.car = car;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({ deltaTime }: IRenderObjectProps): void => {
    if (!this.drawer || !this.car) return;

    // Distance
    this.drawer.text({
      color: '#FFFFFF',
      text: `Distance: ${Math.floor(this.car.distanceTraveled)}`,
      y: 10,
      x: 2,
      fontSize: '10px',
    });

    // Speed
    this.drawer.text({
      color: '#FFFFFF',
      text: `Speed: ${Math.floor(this.car.speed)}`,
      y: 20,
      x: 2,
      fontSize: '10px',
    });
  };
}

export default UI;
