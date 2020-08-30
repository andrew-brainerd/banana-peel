const fs = require('fs');
const Store = require('electron-store');
const log = require('electron-log');
const { isEmpty } = require('ramda');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { getGameById } = require('./api');
const { uploadGame } = require('./upload');

const store = new Store();

const syncLocalGames = () => {
  const monitorPath = store.get('monitorPath');

  log.info('Syncing Local Games from ', monitorPath);

  if (monitorPath) {
    let uploadCounter = 0;

    fs.readdir(monitorPath, (err, games) => {
      Promise.all((games || []).map(async game => {
        const filePath = `${monitorPath}\\${game}`.replace(/\//g, '\\');
        const gameId = game.split('.')[0];
        const metadata = new SlippiGame(filePath).getMetadata();

        if (metadata) {
          const player1 = metadata.players[0];
          const player2 = metadata.players[1];
          const isNetplay = !isEmpty(player1.names) && !isEmpty(player2.names);

          if (isNetplay) {
            const gameData = await getGameById(gameId);

            if (isEmpty(gameData)) {
              uploadGame(filePath, false);
              uploadCounter++;
            }
          }
        }
      })).then(() => {
        uploadCounter > 0 &&
          require('../main').showTrayNotification(`Uploaded ${uploadCounter} games`, 'Sync Complete')
      });
    });
  }
};

module.exports = {
  syncLocalGames
};
