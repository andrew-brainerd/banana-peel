require('dotenv').config()
const { app, BrowserWindow } = require('electron');
const { initializeWatcher } = require('./src/replayWatcher');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 335,
    height: 450,
    minWidth: 335,
    minHeight: 450,
    maxWidth: 335,
    maxHeight: 450,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
  win.minimize();
};

app.whenReady().then(() => {
  createWindow();
  initializeWatcher();
});
