import config from '../../../config';
import Level from '../../objects/level';
import Car from '../../objects/car';
import UI from '../../objects/ui';
import CanvasDrawer from '../../core/CanvasDrawer';
import defaultTrack from '../../../tracks/test';
import { ICanvasDrawer } from '../CanvasDrawer/types';
class Game {
  // Game Loop Control
  #delta: number = 0;
  #lastFrameTimeMs: number = 0;
  #fps: number = config.fps;
  #lastFpsUpdate: number = this.#fps;
  #framesThisSecond: number = 0;
  #timestep: number = 1000 / config.fps;

  // Canvas

  #canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  #context: CanvasRenderingContext2D = this.#canvas.getContext('2d') as CanvasRenderingContext2D;

  #car?: Car;
  #level?: Level;
  #ui?: UI;

  #drawer: ICanvasDrawer | null;

  #keysDown: any = {}; // TODO correct type this

  constructor() {
    // turn off image aliasing
    this.#context.imageSmoothingEnabled = false;

    this.#canvas.width = config.canvas.width;
    this.#canvas.height = config.canvas.height;

    // Objects
    this.#car = new Car({ context: this.#context });
    this.#level = new Level({ context: this.#context, car: this.#car, track: defaultTrack });
    this.#ui = new UI({ context: this.#context, car: this.#car, level: this.#level });

    this.#drawer = CanvasDrawer({ context: this.#context });
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  #startEventListeners = (): void => {
    window.addEventListener(
      'keydown',
      (e) => {
        this.#keysDown[e.key] = true;
      },
      false
    );

    window.addEventListener(
      'keyup',
      (e) => {
        this.#keysDown[e.key] = false;
      },
      false
    );
  };

  #handleKeyPress = (deltaTime: number): void => {
    if (!this.#car) return;

    if (this.#keysDown['ArrowLeft']) {
      this.#car.turnLeft();
    } else {
      if (this.#keysDown['ArrowRight']) {
        this.#car.turnRight();
      } else {
        this.#car.carDirection = 'idle';
      }
    }

    if (this.#keysDown['ArrowUp']) {
      this.#car.accelerate(deltaTime);
    } else if (this.#keysDown['ArrowDown']) {
      this.#car.break(deltaTime);
    } else {
      this.#car.slowDown(deltaTime);
    }
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  #clearScreen = () => {
    this.#context.beginPath();
    this.#context.rect(0, 0, config.canvas.width, config.canvas.height);
    this.#context.fillStyle = 'black';
    this.#context.fill();
    this.#context.shadowBlur = 0;
  };

  // # The Game Loop
  #updateGame = (deltaTime: number) => {
    if (!this.#context || !this.#level || !this.#car || !this.#ui || !this.#drawer) return;

    this.#clearScreen();

    // Render Objects
    this.#level.render({ deltaTime });
    this.#car.render({ deltaTime, levelCurvature: this.#level.curvature });
    this.#ui.render({ deltaTime });

    // Keypress
    this.#handleKeyPress(deltaTime);

    // FPS DEBUG
    this.#drawer.text({
      color: '#FFFFFF',
      text: `FPS: ${this.#fps}`,
      y: 10,
      x: config.canvas.width - 50,
      fontSize: '10px',
    });
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  #gameLoop = (timestamp: number): void => {
    // Control the frame rate
    if (timestamp < this.#lastFrameTimeMs + 1000 / config.fps) {
      requestAnimationFrame(this.#gameLoop);
      return;
    }

    this.#delta += timestamp - this.#lastFrameTimeMs;
    this.#lastFrameTimeMs = timestamp;

    // Measure fps
    if (timestamp > this.#lastFpsUpdate + 1000) {
      this.#fps = 0.25 * this.#framesThisSecond + 0.75 * this.#fps;

      this.#lastFpsUpdate = timestamp;
      this.#framesThisSecond = 0;
    }
    this.#framesThisSecond++;

    while (this.#delta >= this.#timestep) {
      this.#delta -= this.#timestep;
    }

    this.#updateGame(this.#delta / this.#timestep);

    requestAnimationFrame(this.#gameLoop);
  };

  // # Start/Restart a Game

  #startNewGame = () => {
    this.#gameLoop(0); // GO GO GO
  };

  // # Run
  run = (): void => {
    this.#startEventListeners();
    this.#startNewGame();
  };
}

export default Game;
