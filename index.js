const Store = require('electron-store');
const { initializeWatcher } = require('./src/replayWatcher');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const monitorPath = document.getElementById('monitorPath');
  monitorPath.value = store.get('monitorPath') || '';

  const username = document.getElementById('username');
  username.value = store.get('username') || '';
});

const updateMonitorPath = () => {
  const monitorPath = document.getElementById('monitorPath').value;

  console.log('Update monitor path', monitorPath);
  store.set('monitorPath', monitorPath);
  initializeWatcher();
};

const updateUsername = () => {
  const username = document.getElementById('username').value;

  console.log('Update username', username);
  store.set('username', username);
  initializeWatcher();
};
