import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import { CarDirections, ICarProps, ICarRenderProps } from './types';

class Car {
  #drawer: ICanvasDrawer | null;

  #width: number = config.canvas.width * 0.25;
  #height: number = config.canvas.height * 0.2;
  #y: number = config.canvas.height - config.canvas.height * 0.22;
  #sideVelocity: number = 0.5;
  #acceleration: number = 2;

  #position: number = 0; // -1 to 1, 0 is center of screen
  #curvature: number = 0;
  #distanceTraveled: number = 0;
  #positionOnTrack: number = 0;
  #speed: number = 0;
  #maxSpeed: number = 100;

  #centerX: number = config.canvas.width / 2;
  #screenWidthWithBounds: number = config.canvas.width - this.#width;

  #isOutOfTrack: boolean = false;

  #spriteCarElement: HTMLImageElement | null = null;
  #spriteDirtElement: HTMLImageElement | null = null;

  #sprite = {
    width: 63,
    height: 34,
    idle: {
      x: 0,
      y: 0,
    },
    left: {
      x: 0,
      y: 34,
    },
    right: {
      x: 0,
      y: 68,
    },
  };

  #carDirection: CarDirections = 'idle';

  constructor({ context }: ICarProps) {
    this.#drawer = CanvasDrawer({ context });

    const carImg = new Image();
    carImg.src = 'assets/images/car-white.png';
    carImg.onload = () => {
      this.#spriteCarElement = carImg;
    };

    const dirtImg = new Image();
    dirtImg.src = 'assets/images/car-dirt.png';
    dirtImg.onload = () => {
      this.#spriteDirtElement = dirtImg;
    };
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get speed() {
    return this.#speed;
  }

  set speed(targetSpeed: number) {
    this.#speed = targetSpeed;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get position() {
    return this.#position;
  }

  set position(targetPosition: number) {
    this.#position = targetPosition;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get positionOnTrack() {
    return this.#positionOnTrack;
  }

  set positionOnTrack(newPosition: number) {
    this.#positionOnTrack = newPosition;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get distanceTraveled() {
    return this.#distanceTraveled;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get isOutOfTrack() {
    return this.#isOutOfTrack;
  }

  set isOutOfTrack(newBool: boolean) {
    this.#isOutOfTrack = newBool;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  set carDirection(newDirection: CarDirections) {
    this.#carDirection = newDirection;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  turnLeft = (): void => {
    if (this.#speed <= 0) return;

    this.#carDirection = 'left';

    let newCurvature = this.#curvature - (this.#sideVelocity * this.#speed) / 1000;
    if (newCurvature < -1) newCurvature = -1;

    this.#curvature = newCurvature;
  };

  turnRight = (): void => {
    if (this.#speed <= 0) return;

    this.#carDirection = 'right';

    let newCurvature = this.#curvature + (this.#sideVelocity * this.#speed) / 1000;
    if (newCurvature > 1) newCurvature = 1;

    this.#curvature = newCurvature;
  };

  accelerate = (deltaTime: number): void => {
    // limit max speed if is out of track
    let maxSpeed = this.#maxSpeed;

    if (this.#isOutOfTrack) maxSpeed = this.#maxSpeed / 3;

    // stop accelerating if is out of track until reach limit speed
    if (this.#isOutOfTrack && this.#speed > maxSpeed) return this.slowDown(deltaTime);

    // limit acceleration if os out of track
    let acceleration = this.#acceleration;
    if (this.#isOutOfTrack) acceleration = acceleration / 10;

    let newSpeed = this.#speed + this.#acceleration * deltaTime;
    if (newSpeed >= this.#maxSpeed) newSpeed = this.#maxSpeed;

    this.speed = newSpeed;
  };

  slowDown = (deltaTime: number): void => {
    let newSpeed = 0;
    const reverseSpeed = this.#acceleration * 2;

    newSpeed = this.#speed - reverseSpeed * deltaTime;

    if (newSpeed <= 0) newSpeed = 0;

    this.speed = newSpeed;
  };

  break = (deltaTime: number): void => {
    let newSpeed = this.#speed - this.#acceleration * 5 * deltaTime;
    if (newSpeed <= 0) newSpeed = 0;

    this.speed = newSpeed;
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  #getCarSprite = () => {
    return this.#sprite[this.#carDirection];
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  render = ({ deltaTime, levelCurvature }: ICarRenderProps): void => {
    if (!this.#drawer || !this.#spriteCarElement || !this.#spriteDirtElement) return;

    this.#position = this.#curvature - levelCurvature * 3; // increase number to increase difficulty to control the car

    // limit the car on track bounds
    if (this.#position < -1) this.#position = -1;
    if (this.#position > 1) this.#position = 1;

    let carX = this.#centerX + (this.#screenWidthWithBounds * this.#position) / 2 - this.#width / 2;

    const carSprite = this.#getCarSprite();

    this.#drawer.image({
      image: this.#spriteCarElement,
      height: this.#sprite.height,
      width: this.#sprite.width,
      y: carSprite.y,
      x: carSprite.x,
      destinationHeight: this.#height,
      destinationWidth: this.#width,
      destinationX: carX,
      destinationY: this.#y,
    });

    if (this.#isOutOfTrack) {
      this.#drawer.image({
        image: this.#spriteDirtElement,
        height: this.#sprite.height,
        width: this.#sprite.width,
        y: carSprite.y,
        x: carSprite.x,
        destinationHeight: this.#height,
        destinationWidth: this.#width,
        destinationX: carX,
        destinationY: this.#y,
      });
    }

    // Update distance traveled based on speed
    const newTraveled = (this.#speed / 30) * deltaTime;

    if (this.#speed > 0) this.#distanceTraveled += newTraveled;
    this.#positionOnTrack += newTraveled;
  };
}

export default Car;
