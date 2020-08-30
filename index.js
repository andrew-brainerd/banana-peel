const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const log = require('electron-log');
const { initializeWatcher } = require('./src/replayWatcher');
const { initializeUserDrop } = require('./src/userDrop');
const { defaultMonitorPath } = require('./src/constants');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
  const currentMonitorPath = store.get('monitorPath') || defaultMonitorPath;
  document.getElementById('monitorPath').value = currentMonitorPath;
  document.getElementById('currentMonitorPath').innerText = `Replay Path: ${currentMonitorPath}`;

  const username = document.getElementById('username');
  username.innerText = store.get('username') ? `Name: ${store.get('username')}` : '';

  const connectCode = document.getElementById('connectCode');
  connectCode.innerText = store.get('connectCode') ? `Netplay ID: ${store.get('connectCode')}` : '';

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

const updateUserInfo = ({ username, connectCode}) => {
  document.getElementById('username').innerText = `Name: ${username}`;
  document.getElementById('connectCode').innerText = `Netplay ID: ${connectCode}`;
  document.getElementById('dropContainer').style.display = 'none';
  store.set('username', username);
  store.set('connectCode', connectCode);
  initializeWatcher();
};

ipcRenderer.on('setUserInfo', (event, userInfo) => {
  updateUserInfo(userInfo);
});
