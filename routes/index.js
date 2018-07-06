const slackHandler = require('../services/slackHandler');

module.exports = app => {
  /**
   * test endpoint
   */
  app.get('/test', (req, res) => {
    res.send('Notifier is working');
  });

  /**
   * slack callouts
   */
  app.post('/slack', async (req, res) => {
    const { text } = req.body;

    let response;
    try {
      response = await slackHandler.handleCommand(text);
    } catch (error) {
      console.error(error);
      response = 'Something went wrong. Please check the service.';
    }

    if (response) {
      res.send({
        response_type: 'in_channel',
        text: response
      });
    } else {
      res.sendStatus(200);
    }
  });
};
