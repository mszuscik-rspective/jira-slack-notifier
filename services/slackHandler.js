

const commands = {
  help: () => 'test, list, add, remove, review',
  test: () => 'I\'m fine',
  list: () => {
    return 'list called';
  },
  add: () => {
    return 'add called';
  },
  remove: () => {
    return 'remove called';
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
