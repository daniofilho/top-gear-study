import config from '../../../config';

import { IGame } from './types';

const Game = (): IGame => {
  // FPS Control
  let fpsInterval: number = 0;
  let now: number = 0;
  let deltaTime: number = 0;
  let startTime: number = 0;
  let elapsed: number = 0;

  // Canvas
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const clearScreen = () => {
    context.clearRect(0, 0, config.canvas.width, config.canvas.height);

    context.beginPath();
    context.rect(0, 0, config.canvas.width, config.canvas.height);
    context.fillStyle = 'black';
    context.fill();
  };

  // # The Game Loop
  const updateGame = (deltaTime: number) => {
    clearScreen();

    // The fun....

    context.beginPath();
    context.arc(
      Math.floor(Math.random() * config.canvas.width - 30) + 0,
      Math.floor(Math.random() * config.canvas.height - 30) + 0,
      30,
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  };

  const gameLoop = () => {
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - deltaTime;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      deltaTime = now - (elapsed % fpsInterval);

      updateGame(deltaTime);
    }

    // Runs only when the browser is in focus
    // Request another frame
    requestAnimationFrame(gameLoop);
  };

  // # "Thread" tha runs the game
  const runGame = (fps: number) => {
    fpsInterval = 1000 / fps;
    deltaTime = Date.now();
    startTime = deltaTime;
    gameLoop();
  };

  // # Start/Restart a Game

  const startNewGame = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = canvas.getContext('2d');

    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;

    // Ok, run the game now
    runGame(config.fps); // GO GO GO
  };

  // # Run
  const run = () => {
    startNewGame();
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return {
    run,
  };
};

export default Game;
