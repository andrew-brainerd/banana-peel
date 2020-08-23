require('dotenv').config()
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { initializeWatcher } = require('./src/replayWatcher');

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const windowWidth = 335;
  const windowHeight = 450;
  const taskBarHeight = 40;
  const xPosition = primaryDisplay.bounds.width - windowWidth;
  const yPosition = primaryDisplay.bounds.height - windowHeight - taskBarHeight;

  const mainWindow = new BrowserWindow({
    frame: true,
    title: 'Banana Peel',
    width: windowWidth,
    height: windowHeight,
    x: xPosition,
    y: yPosition,
    resizable: false,
    autoHideMenuBar: true,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.minimize();
};

app.whenReady().then(() => {
  createWindow();
  initializeWatcher();
});

ipcMain.on('ondrop', (event, filePath) => {
  const userData = require(filePath);
  const username = (userData || {}).displayName;

  event.sender.send('setUsername', username);
});
