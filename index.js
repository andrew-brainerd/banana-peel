const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const { initializeWatcher } = require('./src/replayWatcher');
const { initializeUserDrop } = require('./src/userDrop');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const monitorPath = document.getElementById('monitorPath');
  monitorPath.value = store.get('monitorPath') || '';

  const username = document.getElementById('username');
  username.innerText = store.get('username') ? `Netplay ID: ${store.get('username')}` : '';

  initializeUserDrop();
});

const updateMonitorPath = () => {
  const monitorPath = document.getElementById('monitorPath').value;

  console.log('Update monitor path', monitorPath);
  store.set('monitorPath', monitorPath);
  initializeWatcher();
};

const updateUsername = username => {
  document.getElementById('username').innerText = `Netplay ID: ${username}`;
  document.getElementById('dropContainer').style.display = 'none';
  store.set('username', username);
  initializeWatcher();
};

ipcRenderer.on('setUsername', (event, username) => {
  updateUsername(username);
});
