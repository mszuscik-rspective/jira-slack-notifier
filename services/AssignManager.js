const _ = require('lodash');
const db = require('./dbService');
const RepeatQueue = require('./RepeatQueue');
const jiraService = require('./jiraService');
const Assignment = require('../models/Assignment');
const config = require('../config/config');

const _getLastSelectedDeveloper = () => {
  const lastAssignment = _.last(db.getAllAssignments());
  return lastAssignment
    ? lastAssignment.devs[1]
    : null;
};

const _getDev = devName => {
  const dev = db.getDevByName(devName);
  return dev.slackId ? `<@${dev.slackId}>` : dev.name;
};

class AssignManager {
  async assignDevs() {
    const assigneeQueue = new RepeatQueue(db.getAllDevs().map(dev => dev.name), _getLastSelectedDeveloper());

    if (!assigneeQueue.queue.length) {
      return 'No devs specified.';
    }

    const waitingTasks = await jiraService.getWaitingTasks();
    const existingAssignments = db.getAllAssignments();

    const assignedTasks = existingAssignments
      .map(assignment => assignment.task);

    const unassignedTasks = waitingTasks
      .filter(task => !assignedTasks.includes(task.key));

    const newAssignments = unassignedTasks
      .map(task => {
        const devs = [
          assigneeQueue.shift(task.assignee),
          assigneeQueue.shift(task.assignee)
        ];

        return new Assignment(task.key, devs);
      });

    db.addAssignments(newAssignments);

    const allAssignments = existingAssignments.concat(newAssignments);

    return waitingTasks
      .map(task => allAssignments.find(assignment => assignment.task === task.key))
      .map(assignment => {
        const link = `<${config.jiraUrl}/browse/${assignment.task}|${assignment.task}>`;
        return `${link}: ${_getDev(assignment.devs[0])}, ${_getDev(assignment.devs[1])}`;
      })
      .join('\n');
  }
}

module.exports = AssignManager;
