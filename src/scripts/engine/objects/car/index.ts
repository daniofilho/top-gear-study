import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';

class Car {
  drawer: ICanvasDrawer | null;

  width: number = config.canvas.width * 0.25;
  height: number = config.canvas.height * 0.1;
  color = '#FF0';
  y: number = config.canvas.height - config.canvas.height * 0.15;
  sideVelocity: number = 0.05;
  acceleration: number = 0.3;

  position: number = 0; // -1 to 1, 0 is center of screen
  distanceTraveled: number = 0;
  speed: number = 0;
  maxSpeed: number = 200;

  centerX: number = config.canvas.width / 2;
  screenWidthWithBounds: number = config.canvas.width - this.width;

  constructor({ context }: ICarProps) {
    this.drawer = CanvasDrawer({ context });
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  turnLeft = (): void => {
    let newPosition = this.position - this.sideVelocity;
    if (newPosition < -1) newPosition = -1;

    this.position = newPosition;
  };

  turnRight = (): void => {
    let newPosition = this.position + this.sideVelocity;
    if (newPosition > 1) newPosition = 1;

    this.position = newPosition;
  };

  accelerate = (): void => {
    let newSpeed = this.speed + this.acceleration * 5;

    if (newSpeed >= this.maxSpeed) newSpeed = this.maxSpeed;

    this.speed = newSpeed;
    this.distanceTraveled += newSpeed / 10;
  };

  slowDown = (): void => {
    let newSpeed = this.speed - this.acceleration;
    if (newSpeed <= 0) newSpeed = 0;

    this.speed = newSpeed;
  };

  stop = (): void => {
    let newSpeed = this.speed - this.acceleration * 10;
    if (newSpeed <= 0) newSpeed = 0;

    this.speed = newSpeed;
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({ deltaTime }: IRenderObjectProps): void => {
    if (!this.drawer) return;

    let carX = this.centerX + (this.screenWidthWithBounds * this.position) / 2 - this.width / 2;

    this.drawer.rectangle({
      color: this.color,
      height: this.height,
      width: this.width,
      y: this.y,
      x: carX,
    });
  };
}

export default Car;
