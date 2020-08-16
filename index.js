const Store = require('electron-store');
const { initializeWatcher } = require('./src/replayWatcher');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const monitorPath = document.getElementById('monitorPath');
  monitorPath.value = store.get('monitorPath') || '';
});

const updateMonitorPath = () => {
  const monitorPath = document.getElementById('monitorPath').value;

  console.log('Update monitor path', monitorPath);
  store.set('monitorPath', monitorPath);
  initializeWatcher();
};
