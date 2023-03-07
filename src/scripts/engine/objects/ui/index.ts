import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import Car from '../../objects/car';
import Level from '../level';
import { IUIProps } from './types';

class UI {
  #drawer?: ICanvasDrawer;
  #car?: Car;
  #level?: Level;
  #canvasWidth: number = 0;

  #showInstructions: boolean = true;
  #instructionsTimer: number = 0;
  #maxInstructionsTimer: number = 3;

  constructor({ context, car, level, canvasWidth }: IUIProps) {
    this.#drawer = CanvasDrawer({ context });
    this.#car = car;
    this.#level = level;
    this.#canvasWidth = canvasWidth;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({ deltaTime }: IRenderObjectProps): void => {
    if (!this.#drawer || !this.#car || !this.#level) return;

    // * Distance
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Distance Traveled: ${Math.floor(this.#car.distanceTraveled)}`,
      y: 20,
      x: 10,
      fontSize: '12px',
    });

    // * Position On Track
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Position on Level: ${Math.floor(this.#car.positionOnTrack)}`,
      y: 40,
      x: 10,
      fontSize: '12px',
    });

    // * Speed
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Speed: ${Math.floor(this.#car.speed)}`,
      y: 60,
      x: 10,
      fontSize: '12px',
    });

    // * Track / Level
    this.#drawer.text({
      color: '#FFFFFF',
      text: `Track section: ${Math.floor(this.#level.trackSection)}`,
      y: 80,
      x: 10,
      fontSize: '12px',
    });

    this.#drawer.text({
      color: '#FFFFFF',
      text: `Lap: ${Math.floor(this.#level.lap)}`,
      y: 100,
      x: 10,
      fontSize: '12px',
    });

    // * Instructions blinking only if player hasn't moved yet
    if (this.#car.distanceTraveled <= 10) {
      if (this.#showInstructions) {
        //this.#instructionsBlinking = true;

        this.#drawer.text({
          color: '#FFFFFF',
          text: `Use Arrow Keys to move!`,
          y: 150,
          x: this.#canvasWidth / 2 - 110,
          fontSize: '20px',
        });
      }

      this.#instructionsTimer += deltaTime;

      if (this.#instructionsTimer > this.#maxInstructionsTimer) {
        this.#showInstructions = !this.#showInstructions;
        this.#instructionsTimer = 0;
      }
    }
  };
}

export default UI;
