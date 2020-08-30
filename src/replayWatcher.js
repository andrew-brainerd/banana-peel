const Store = require('electron-store');
const chokidar = require('chokidar');
const log = require('electron-log');

const { defaultMonitorPath } = require('./constants');
const { uploadGame } = require('./upload');

const store = new Store();

let watcher = null;

const initializeWatcher = async () => {
  const monitorPath = store.get('monitorPath') || defaultMonitorPath;
  const username = store.get('username');

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

    watcher.on('change', uploadGame);
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
