import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import Car from '../../objects/car';
import Level from '../level';
import { IUIProps } from './types';

class UI {
  #drawer?: ICanvasDrawer;
  #car?: Car;
  #level?: Level;

  constructor({ context, car, level }: IUIProps) {
    this.#drawer = CanvasDrawer({ context });
    this.#car = car;
    this.#level = level;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({}: IRenderObjectProps): void => {
    if (!this.#drawer || !this.#car || !this.#level) return;

    // Distance
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Distance: ${Math.floor(this.#car.distanceTraveled)}`,
      y: 10,
      x: 2,
      fontSize: '10px',
    });
    // Position On Track
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Position: ${Math.floor(this.#car.positionOnTrack)}`,
      y: 20,
      x: 2,
      fontSize: '10px',
    });

    // Speed
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Speed: ${Math.floor(this.#car.speed)}`,
      y: 30,
      x: 2,
      fontSize: '10px',
    });

    // Track / Level
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Track section: ${Math.floor(this.#level.trackSection)}`,
      y: 40,
      x: 2,
      fontSize: '10px',
    });
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Lap: ${Math.floor(this.#level.lap)}`,
      y: 50,
      x: 2,
      fontSize: '10px',
    });
  };
}

export default UI;
