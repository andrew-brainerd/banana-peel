const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { gameCompleted } = require('./api');

const watcher = chokidar.watch('C:/SSBReplays', {
  depth: 0,
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
}).on('all', (event, path) => {
  event !== 'change' && console.log(event, path);
});

watcher.on('change', path => {
  let game = new SlippiGame(path, { processOnTheFly: true });
  const metadata = game.getMetadata();

  if (metadata) {
    console.log('Game Finished', metadata);

    const settings = game.getSettings();
    const stats = game.getStats();

    gameCompleted({ user: 'Sp1d3rM0nk3y', metadata, settings, stats });
  }
});
