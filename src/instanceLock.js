const { app } = require('electron');
const { mainWindow } = require('../main');

const preventMultipleInstances = () => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    })
  }
};

module.exports = {
  preventMultipleInstances
};
