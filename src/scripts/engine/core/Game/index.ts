import config from '../../../config';
import Level from '../../objects/level';
import Car from '../../objects/car';
import UI from '../../objects/ui';

class Game {
  // FPS Control
  fpsInterval: number = 0;
  now: number = 0;
  deltaTime: number = 0;
  elapsed: number = 0;

  // Canvas

  canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  context: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;

  car?: Car;
  level?: Level;
  ui?: UI;

  keysDown: any = {}; // TODO correct type this

  constructor() {
    // turn off image aliasing
    this.context.imageSmoothingEnabled = false;

    this.canvas.width = config.canvas.width;
    this.canvas.height = config.canvas.height;

    // Objects
    this.car = new Car({ context: this.context });
    this.level = new Level({ context: this.context, car: this.car });
    this.ui = new UI({ context: this.context, car: this.car });
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  startEventListeners = (): void => {
    window.addEventListener(
      'keydown',
      (e) => {
        this.keysDown[e.key] = true;
      },
      false
    );

    window.addEventListener(
      'keyup',
      (e) => {
        this.keysDown[e.key] = false;
      },
      false
    );
  };

  handleKeyPress = (): void => {
    if (!this.car) return;

    if (this.keysDown['ArrowLeft']) this.car.turnLeft();
    if (this.keysDown['ArrowRight']) this.car.turnRight();

    if (this.keysDown['ArrowUp']) {
      this.car.accelerate();
    } else {
      this.car.slowDown();
    }

    if (this.keysDown['ArrowDown']) this.car.stop();
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  clearScreen = () => {
    this.context.beginPath();
    this.context.rect(0, 0, config.canvas.width, config.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fill();
    this.context.shadowBlur = 0;
  };

  // # The Game Loop
  updateGame = (deltaTime: number) => {
    if (!this.context || !this.level || !this.car || !this.ui) return;

    this.clearScreen();

    // Render Objects
    this.level.render({ deltaTime });
    this.car.render({ deltaTime });
    this.ui.render({ deltaTime });

    // Keypress
    this.handleKeyPress();
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  gameLoop = (): void => {
    // calc elapsed time since last loop
    this.now = Date.now();
    this.elapsed = this.now - this.deltaTime;

    // if enough time has elapsed, draw the next frame
    if (this.elapsed > this.fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.deltaTime = this.now - (this.elapsed % this.fpsInterval);

      this.updateGame(this.deltaTime);
    }

    // Runs only when the browser is in focus
    // Request another frame
    requestAnimationFrame(this.gameLoop);
  };

  // # "Thread" tha runs the game
  runGame = (fps: number) => {
    this.fpsInterval = 1000 / fps;
    this.deltaTime = Date.now();
    this.gameLoop();
  };

  // # Start/Restart a Game

  startNewGame = () => {
    this.runGame(config.fps); // GO GO GO
  };

  // # Run
  run = (): void => {
    this.startEventListeners();
    this.startNewGame();
  };
}

export default Game;
