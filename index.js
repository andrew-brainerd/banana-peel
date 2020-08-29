const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const log = require('electron-log');
const { initializeWatcher } = require('./src/replayWatcher');
const { initializeUserDrop } = require('./src/userDrop');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const currentMonitorPath = store.get('monitorPath') || '';
  document.getElementById('monitorPath').value = currentMonitorPath;
  document.getElementById('currentMonitorPath').innerText = `Replay Path: ${currentMonitorPath}`;

  const username = document.getElementById('username');
  username.innerText = store.get('username') ? `Netplay ID: ${store.get('username')}` : '';

  initializeUserDrop();
});

const editMonitorPath = () => {
  document.getElementById('monitorPathDisplay').style.display = 'none';
  document.getElementById('monitorPathInput').style.display = 'block';
};

const updateMonitorPath = () => {
  const monitorPath = document.getElementById('monitorPath').value;
  document.getElementById('currentMonitorPath').innerText = `Replay Path: ${monitorPath}`;
  document.getElementById('monitorPathDisplay').style.display = 'block';
  document.getElementById('monitorPathInput').style.display = 'none';

  log.info('Updating monitor path to', monitorPath);
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
