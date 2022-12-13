import Game from './engine/core/Game/index';

window.onload = function () {
  const runGame = () => {
    let game = Game();
    game.run();
  };

  runGame();
};
