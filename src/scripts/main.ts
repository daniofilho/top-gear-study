import Game from './engine/core/game/index';

window.onload = function () {
  const runGame = () => {
    let game = Game();
    game.run();
  };

  runGame();
};
