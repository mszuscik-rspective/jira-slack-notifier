const DbService = require('./DbService');
const AssignManager = require('./AssignManager');

const db = new DbService();
const assignManager = new AssignManager();

const commands = {
  help: () => 'test, list, add, remove, review',
  test: () => 'What\'s up?',
  list: () => db
    .getAllDevs()
    .map(dev => dev.name)
    .join(', '),
  add: dev => {
    db.addDev(dev);
  },
  remove: dev => {
    db.removeDev(dev);
  },
  review: async () => {
    return await assignManager.assignDevs();
  }
};

const handleCommand = async (data) => {
  const commandName = data.split(' ')[0];
  const command = commands[commandName];

  if (!command) {
    throw TypeError('Command doesn\'t exist');
  }

  const params = data
    .replace(commandName, '')
    .trim();

  return await command(params);
};

module.exports = {
  handleCommand
};
