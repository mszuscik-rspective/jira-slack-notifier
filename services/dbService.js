const _ = require('lodash');
const Developer = require('../models/Developer');

const KEYS = {
  developers: 'developers',
  assignments: 'assignments'
};

class DbService {
  constructor() {
    this.db = {
      [KEYS.developers]: [],
      [KEYS.assignments]: []
    };
  }

  resetAll() {
    this.db = {
      [KEYS.developers]: [],
      [KEYS.assignments]: []
    };
  }

  // ===== developers ====================================
  getAllDevs() {
    return this.db[KEYS.developers];
  }

  getDevByName(name) {
    return this.db[KEYS.developers]
      .find(dev => dev.name === name);
  }

  addDev(devName, slackId) {
    this.db[KEYS.developers]
      .push(new Developer(devName, slackId));
  }

  removeDev(devName) {
    this.db[KEYS.developers] = 
      _.remove(this.db[KEYS.developers], dev => dev.name === devName);
  }

  // ===== assignments ===================================
  getAllAssignments() {
    return this.db[KEYS.assignments];
  }

  addAssignments(assignments) {
    this.db[KEYS.assignments]
      .push(...assignments);
  }
}

const instance = new DbService();

module.exports = instance;
