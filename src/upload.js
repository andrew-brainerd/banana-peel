const { isEmpty } = require('ramda');
const Store = require('electron-store');
const { default: SlippiGame } = require('@slippi/slippi-js');
const log = require('electron-log');
const { gameCompleted } = require('./api');

const store = new Store();

const uploadGame = (filePath, showNotification = true) => {
  const username = store.get('username');
  const game = new SlippiGame(filePath);
  const metadata = game.getMetadata();
  const gameId = filePath.split('\\')[2].split('.')[0];

  if (metadata) {
    const player1 = metadata.players[0];
    const player2 = metadata.players[1];
    const isNetplay = !isEmpty(player1.names) && !isEmpty(player2.names);

    if (isNetplay) {
      const player1Netplay = player1.names.netplay;
      const player2Netplay = player2.names.netplay;

      log.info(`[${username}] ${gameId} Finished: ${player1Netplay} vs ${player2Netplay}`);

      if (Object.keys(metadata.players).length === 2) {
        log.info(`Uploading ${gameId} to Banana Peel Server`);

        const settings = game.getSettings();
        const stats = game.getStats();
        const gameEnd = game.getGameEnd();
        const lastFrame = game.getLatestFrame();

        gameCompleted({ gameId, username, isNetplay, metadata, gameEnd, lastFrame, settings, stats }).then(
          game => {
            showNotification && require('../main').showTrayNotification(`Uploaded ${game.gameId}`, 'Game Over');
          }
        );
      }
    }
  }
};

module.exports = {
  uploadGame
};
