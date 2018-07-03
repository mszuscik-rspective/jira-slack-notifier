const express = require('express');

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Notifier is working');
});

app.post('/test', (req, res) => {
  res.send({
    response_type: 'in_channel',
    text: JSON.stringify(req)
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
