const express = require('express');

const app = express();

app.use(express.urlencoded());

require('./routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
