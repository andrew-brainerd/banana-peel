const initializeUserDrop = () => {
  const dropContainer = document.getElementById('dropContainer');
  dropContainer.style.display = store.get('username') ? 'none' : 'flex';

  dropContainer.ondragover = () => {
    dropContainer.style.border = '2px solid black';
    return false;
  };

  dropContainer.ondragleave = () => {
    dropContainer.style.border = '2px dashed black';
    return false;
  };

  dropContainer.ondragend = () => false;

  dropContainer.ondrop = event => {
    event.preventDefault();
    dropContainer.style.border = '2px dashed black';

    const file = event.dataTransfer.files[0];
    const filePath = file.path.split('\\');
    const fileName = filePath[filePath.length - 1];

    if (fileName !== 'user.json') {
      return false;
    }

    ipcRenderer.send('ondrop', file.path);

    return false;
  };
};

module.exports = {
  initializeUserDrop
};
