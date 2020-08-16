const { getGames } = require('./src/api');

getGames().then(games => console.log(games));

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('monitorPath').onchange = () => {
    console.log(monitorPath.files[0].path);
    document.getElementById('')
  };
});
