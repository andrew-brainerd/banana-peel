const Store = require('electron-store');
const chokidar = require('chokidar');
const { isEmpty } = require('ramda');
const { default: SlippiGame } = require('@slippi/slippi-js');
const log = require('electron-log');
const { gameCompleted } = require('./api');
const { defaultMonitorPath } = require('./constants');

const store = new Store();

let watcher = null;

const initializeWatcher = async () => {
  const monitorPath = await store.get('monitorPath') || defaultMonitorPath;
  const username = await store.get('username');

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

    watcher.on('add', () => log.info('New Game Started'));

    watcher.on('change', path => {
      let game = new SlippiGame(path);
      const metadata = game.getMetadata();
      const gameId = path.split('\\')[2].split('.')[0];

      if (metadata) {
        const player1 = metadata.players[0];
        const player2 = metadata.players[1];
        const isNetplay = !isEmpty(player1.names) && !isEmpty(player2.names);

        if (isNetplay) {
          const player1Netplay = player1.names.netplay;
          const player2Netplay = player2.names.netplay;

          log.info(`[${username}] ${gameId} Finished: ${player1Netplay} vs ${player2Netplay}`);

          if (Object.keys(metadata.players).length === 2) {
            log.info(`Uploading ${gameId} to Banana Peel Server`);

            const settings = game.getSettings();
            const stats = game.getStats();

            gameCompleted({ gameId, username, isNetplay, metadata, settings, stats }).then(
              game => {
                require('../main').showTrayNotification(`Uploaded ${game.gameId}`, 'Game Over');
              }
            );
          }
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
