const db = require('./dbService');
const AssignManager = require('./AssignManager');

const assignManager = new AssignManager();

const commands = {
  help: () => 'test, list, add, remove, review',
  test: () => 'What\'s up?',
  list: () => {
    const list = db
      .getAllDevs()
      .map(dev => dev.name)
      .join(', ');
    return list ? list : '<empty>';
  },
  add: data => { // data: name slackId
    const params = data.split(' ');
    db.addDev(params[0], params[1]);
  },
  remove: dev => { // dev: name
    db.removeDev(dev);
  },
  reset: () => {
    db.resetAll();
  },
  review: async () => {
    return await assignManager.assignDevs();
  }
};

const handleCommand = async (data) => {
  const commandName = data.split(' ')[0];
  const command = commands[commandName];

  if (!command) {
    return 'I don\'t understand the command';
  }

  const params = data
    .replace(commandName, '')
    .trim();

  return await command(params);
};

module.exports = {
  handleCommand
};
