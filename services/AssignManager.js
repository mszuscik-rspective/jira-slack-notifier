const _ = require('lodash');
const DbService = require('./DbService');
const RepeatQueue = require('./RepeatQueue');
const jiraService = require('./jiraService');
const Assignment = require('../models/Assignment');

const db = new DbService();

const _getLastSelectedDeveloper = () => {
  const lastAssignment = _.last(db.getAllAssignments());
  return lastAssignment
    ? lastAssignment.devs[1]
    : null;
};

class AssignManager {
  constructor() {
    const devNames = db
      .getAllDevs()
      .map(dev => dev.name);

    this.assigneeQueue = new RepeatQueue(devNames, _getLastSelectedDeveloper());
  }

  async assignDevs() {
    const waitingTasks = await jiraService.getWaitingTasks();
    const existingAssignments = db.getAllAssignments();

    const assignedTasks = existingAssignments
      .map(assignment => assignment.task);

    const unassignedTasks = waitingTasks
      .filter(task => !assignedTasks.includes(task));

    const newAssignments = unassignedTasks
      .map(task => {
        const users = [
          this.assigneeQueue.shift(),
          this.assigneeQueue.shift()
        ];

        return new Assignment(task, users);
      });

    db.addAssignments(newAssignments);

    const allAssignments = existingAssignments.concat(newAssignments);

    return waitingTasks
      .map(task => allAssignments.find(assignment => assignment.task === task))
      .map(assignment => `${assignment.task}: ${assignment.devs[0]}, ${assignment.devs[1]}`)
      .join('\n');
  }
}

module.exports = AssignManager;
