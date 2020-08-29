const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const log = require('electron-log');
const { gameCompleted } = require('./api');
const Store = require('electron-store');

const store = new Store();

const initializeWatcher = async () => {
  const monitorPath = await store.get('monitorPath');
  const username = await store.get('username');

  let watcher = null;

  if (monitorPath && username) {
    log.info(`Initializing watcher at ${monitorPath} for ${username}`);

    if (watcher) {
      log.info('Closing Watcher...');
      await watcher.close();
    }

    watcher = chokidar.watch(monitorPath, {
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    })

    watcher.on('add', () => log('New Game Started'));

    watcher.on('change', path => {
      log.info('Playing game', path);
      let game = new SlippiGame(path); //{ processOnTheFly: true }
      const metadata = game.getMetadata();

      if (metadata) {
        log.info('Game Finished', metadata);

        if (Object.keys(metadata.players).length === 2) {
          log('Saving Game to Banana Peel Server');

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
