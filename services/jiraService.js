const axios = require('axios');
const config = require('../config/config');

const links = {
  currentSprint: board =>
    `/rest/agile/1.0/board/${board}/sprint?state=active`,
  sprintIssues: (board, sprintId) =>
    `/rest/agile/1.0/board/${board}/sprint/${sprintId}/issue?maxResults=100&fields=assignee,status`
};

/**
 * returns { key: String, assignee: String}
 */
const getWaitingTasks = async () => {
  const jiraConfig = { headers: { Authorization: config.authorization } };

  const sprintResult = await axios.get(
    config.jiraUrl + links.currentSprint(config.board),
    jiraConfig
  );
  const activeSprintId = sprintResult.data.values[0].id;

  const issuesResult = await axios.get(
    config.jiraUrl + links.sprintIssues(config.board, activeSprintId),
    jiraConfig
  );

  const waitingStatusIds = config.waitingStatusIds.split(',');
  const waitingIssues = issuesResult.data
    .issues
    .filter(issue => waitingStatusIds.includes(issue.fields.status.id));

  return waitingIssues
    .map(issue => ({
      key: issue.key,
      assignee: issue.fields.assignee.name
    }));
};

module.exports = {
  getWaitingTasks
};
