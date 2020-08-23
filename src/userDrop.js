const initializeUserDrop = () => {
  const dropContainer = document.getElementById('dropContainer');
  dropContainer.style.display = store.get('username') ? 'none' : 'flex';

  dropContainer.ondragover = () => {
    console.log('ondragover');
    dropContainer.style.border = '2px solid black';
    return false;
  };

  dropContainer.ondragleave = () => {
    console.log('ondragleave');
    dropContainer.style.border = '2px dashed black';
    return false;
  };

  dropContainer.ondragend = () => {
    console.log('ondragend');
    return false;
  };

  dropContainer.ondrop = event => {
    event.preventDefault();
    dropContainer.style.border = '2px dashed black';

    const file = event.dataTransfer.files[0];
    console.log('Dropped File: ', file.path);
    const filePath = file.path.split('\\');
    const fileName = filePath[filePath.length - 1];
    console.log(fileName);
    ipcRenderer.send('ondrop', file.path);

    return false;
  };
};

module.exports = {
  initializeUserDrop
};
