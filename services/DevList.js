const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const KEYS = {
  developers: 'developers'
};

class DevList {
  constructor() {
    const adapter = new FileSync('db.json');
    this.db = low(adapter);
 
    this.db.defaults({ developers: [] })
      .write();
  }

  getAll() {
    return this.db
      .get(KEYS.developers)
      .map(dev => '@' + dev.name);
  }

  add(devName) {
    this.db
      .get(KEYS.developers)
      .push({ name: devName })
      .write();
  }

  remove(devName) {
    this.db
      .get(KEYS.developers)
      .remove({ name: devName })
      .write();
  }
}

module.exports = DevList;
