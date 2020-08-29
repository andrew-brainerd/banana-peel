const AutoLaunch = require('auto-launch');

const autoLaunchApplication = () => {
  const bananaPeelAutoLauncher = new AutoLaunch({ name: 'Banana Peel' });
  bananaPeelAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
