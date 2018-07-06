const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Developer = require('../models/Developer');

const KEYS = {
  developers: 'developers',
  assignments: 'assignments'
};

class DbService {
  constructor() {
    const adapter = new FileSync('db.json');
    this.db = low(adapter);
 
    this.db.defaults({ developers: [], assignments: [] })
      .write();
  }

  // ===== developers ====================================
  getAllDevs() {
    return this.db
      .get(KEYS.developers)
      .value();
  }

  getDevByName(name) {
    return this.db
      .get(KEYS.developers)
      .find({ name })
      .value();
  }

  addDev(devName, slackId) {
    this.db
      .get(KEYS.developers)
      .push(new Developer(devName, slackId))
      .write();
  }

  removeDev(devName) {
    this.db
      .get(KEYS.developers)
      .remove({ name: devName })
      .write();
  }

  // ===== assignments ===================================
  getAllAssignments() {
    return this.db
      .get(KEYS.assignments)
      .value();
  }

  addAssignments(assignments) {
    this.db
      .get(KEYS.assignments)
      .push(...assignments)
      .write();
  }
}

const instance = new DbService();

module.exports = instance;
