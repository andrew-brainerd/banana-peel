const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { gameCompleted } = require('./api');
const Store = require('electron-store');

const store = new Store();

const initializeWatcher = () => {
  const monitorPath = store.get('monitorPath');

  if (monitorPath) {
    console.log(`Initializing watcher at`, monitorPath);

    const watcher = chokidar.watch(monitorPath, {
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
  } else {
    console.error('Please set monitor path');
  }
};

module.exports = {
  initializeWatcher
};
