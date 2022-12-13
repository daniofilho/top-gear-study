import config from '../../../config';
import RenderLevel from '../../renders/level/RenderLevel';
import { IRenderLevel } from '../../renders/level/types';

import { IGame } from './types';

const Game = (): IGame | null => {
  // FPS Control
  let fpsInterval: number = 0;
  let now: number = 0;
  let deltaTime: number = 0;
  let elapsed: number = 0;

  // Canvas

  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;

  // Renders
  let renderLevel: IRenderLevel = RenderLevel({ context });

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const clearScreen = () => {
    if (!context) return;

    context.beginPath();
    context.rect(0, 0, config.canvas.width, config.canvas.height);
    context.fillStyle = 'black';
    context.fill();
    context.shadowBlur = 0;
  };

  // # The Game Loop
  const updateGame = (deltaTime: number) => {
    //
    if (!context) return;

    clearScreen();

    // Renders
    renderLevel.render({ deltaTime });
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
    gameLoop();
  };

  // # Start/Restart a Game

  const startNewGame = () => {
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
