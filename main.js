require('dotenv').config()
const rimraf = require('rimraf');
const { app, BrowserWindow, ipcMain, screen, Tray, Menu, shell } = require('electron');
const Store = require('electron-store');
const noop = require('./src/utils/noop');
const { PLAYER_GAMES_ROUTE } = require('./src/constants');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { initializeWatcher } = require('./src/replayWatcher');
const { syncLocalGames } = require('./src/sync');
const getAppIcon = require('./getAppIcon');

let tray = null;
let mainWindow = null;

const store = new Store();

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const windowWidth = 335;
  const windowHeight = 450;
  const taskBarHeight = 40;
  const xPosition = primaryDisplay.bounds.width - windowWidth;
  const yPosition = primaryDisplay.bounds.height - windowHeight - taskBarHeight;

  mainWindow = new BrowserWindow({
    frame: true,
    title: 'Banana Peel',
    width: windowWidth,
    height: windowHeight,
    x: xPosition,
    y: yPosition,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.on('minimize', event => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', event => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.loadFile('index.html');
};

const showTrayNotification = (message, title = 'Banana Peel', action) => {
  tray.displayBalloon({
    title,
    icon: getAppIcon(),
    content: message,
    respectQuietTime: true
  });

  tray.removeAllListeners(['balloon-click']);

  tray.once('balloon-click', e => {
    e.preventDefault();
    action ? action() : noop();
  });
};

const createTray = () => {
  const connectCode = store.get('connectCode').replace('#', '-');

  tray = new Tray(getAppIcon());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => mainWindow.show()
    },
    {
      label: 'Unlink User',
      click: () => rimraf(
        app.getPath('userData'),
        () => {
          app.exit();
          app.relaunch();
        }
      )
    },
    {
      label: 'Exit',
      click: () => mainWindow.destroy()
    }
  ]);

  tray.setToolTip('Banana Peel');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
  showTrayNotification(
    'Now recording your Slippi matches', 
    'Banana Peel Running',
    () => shell.openExternal(PLAYER_GAMES_ROUTE.replace(':connectCode', connectCode))
  );
};

const preventMultipleInstances = () => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    })
  }
};

app.whenReady().then(() => {
  autoLaunchApplication();
  preventMultipleInstances();
  createTray();
  createWindow();
  initializeWatcher();
  setTimeout(syncLocalGames, 5000);
});

ipcMain.on('ondrop', (event, filePath) => {
  const userData = require(filePath);
  const username = (userData || {}).displayName;
  const connectCode = (userData || {}).connectCode;

  event.sender.send('setUserInfo', { username, connectCode });
});

module.exports = {
  showTrayNotification
};
