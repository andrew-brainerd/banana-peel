const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { gameCompleted } = require('./api');

const initializeWatcher = () => {
  console.log(`Initializing watcher at`, process.env.REPLAY_PATH);

  const watcher = chokidar.watch(process.env.REPLAY_PATH, {
    depth: 0,
    persistent: true,
    usePolling: true,
    ignoreInitial: true,
  })

  watcher.on('add', () => console.log('New Game Started'));
  
  watcher.on('change', path => {
    console.log('Playing game', path);
    let game = new SlippiGame(path, { processOnTheFly: true });
    const metadata = game.getMetadata();
  
    if (metadata) {
      console.log('Game Finished', metadata);
  
      const settings = game.getSettings();
      const stats = game.getStats();
  
      gameCompleted({ user: 'Sp1d3rM0nk3y', metadata, settings, stats });
    }
  });
};

module.exports = {
  initializeWatcher
};
