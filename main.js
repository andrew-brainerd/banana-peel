require('dotenv').config()
const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const { initializeWatcher } = require('./src/replayWatcher');
const { autoLaunchApplication } = require('./src/autoLaunch');
const { preventMultipleInstances } = require('./src/instanceLock');
const getAppIcon = require('./getAppIcon');

let tray = null;
let mainWindow = null;

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

const createTray = () => {
  tray = new Tray(getAppIcon());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => mainWindow.show()
    },
    {
      label: 'Exit',
      click: () => mainWindow.destroy()
    }
  ]);

  tray.setToolTip('Banana Peel');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
  tray.displayBalloon({
    title: 'Banana Peel Running',
    icon: getAppIcon(),
    content: 'Now recording your Slippi matches',
    respectQuietTime: true
  });
};

app.whenReady().then(() => {
  autoLaunchApplication();
  preventMultipleInstances();
  createTray();
  createWindow();
  initializeWatcher();
});

ipcMain.on('ondrop', (event, filePath) => {
  const userData = require(filePath);
  const username = (userData || {}).displayName;

  event.sender.send('setUsername', username);
});

module.exports = {
  mainWindow
};
