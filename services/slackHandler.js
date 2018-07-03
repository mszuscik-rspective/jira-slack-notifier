const DevList = require('./DevList');

const devList = new DevList();

const commands = {
  help: () => 'test, list, add, remove, review',
  test: () => 'What\'s up?',
  list: () => devList.getAll().join(', '),
  add: dev => {
    devList.add(dev);
  },
  remove: dev => {
    devList.remove(dev);
  },
  review: () => {
    return 'review called';
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

  return command(params);
};

module.exports = {
  handleCommand
};
