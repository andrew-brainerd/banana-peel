const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { gameCompleted } = require('./api');
const Store = require('electron-store');

const store = new Store();

const initializeWatcher = async () => {
  const monitorPath = await store.get('monitorPath');
  const username = await store.get('username');

  let watcher = null;

  if (monitorPath && username) {
    console.log(`Initializing watcher at ${monitorPath} for ${username}`);

    if (watcher) {
      console.log('Closing Watcher...');
      await watcher.close();
    }

    watcher = chokidar.watch(monitorPath, {
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

        if (Object.keys(metadata.players).length === 2) {
          console.log('Saving Game to Banana Peel Server');

          const settings = game.getSettings();
          const stats = game.getStats();

          gameCompleted({ username, metadata, settings, stats });
        }
      }
    });
  } else {
    if (!monitorPath) {
      console.error('Please set monitor path');
      showError()
    }
    !username && console.error('Please set username');
  }
};

module.exports = {
  initializeWatcher
};
