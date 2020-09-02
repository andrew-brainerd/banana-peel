const Store = require('electron-store');
const chokidar = require('chokidar');
const log = require('electron-log');

const { DEFAULT_MONITOR_PATH } = require('./constants');
const { uploadGame } = require('./upload');

const store = new Store();

let watcher = null;

const initializeWatcher = async () => {
  const monitorPath = store.get('monitorPath') || DEFAULT_MONITOR_PATH;
  const username = store.get('username');
  const connectCode = store.get('connectCode');

  if (monitorPath && username && connectCode) {
    log.info(`Initializing watcher at ${monitorPath} for ${username} [${connectCode}]`);

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
    (!username || !connectCode) && console.error('Please set user info');
  }
};

module.exports = {
  initializeWatcher
};
