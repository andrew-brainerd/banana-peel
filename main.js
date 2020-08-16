const { app, BrowserWindow } = require('electron');
const chokidar = require('chokidar');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { gameCompleted } = require('./api');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  const watcher = chokidar.watch('C:/SSBReplays', {
    depth: 0,
    persistent: true,
    usePolling: true,
    ignoreInitial: true,
  })

  watcher.on('add', path => {
    console.log('New Game Started');
  });
  
  watcher.on('change', path => {
    let game = new SlippiGame(path, { processOnTheFly: true });
    const metadata = game.getMetadata();
  
    if (metadata) {
      console.log('Game Finished', metadata);
  
      const settings = game.getSettings();
      const stats = game.getStats();
  
      gameCompleted({ user: 'Sp1d3rM0nk3y', metadata, settings, stats });
    }
  });
});
