const express = require('express');

const app = express();
const port = 8888;

// require in our database functionality
const mongo = require('./db');

// require in the exported router from search.js
const search = require('./routes/search.js');
app.use('/search', search);

// require in the exported router from history.js
const history = require('./routes/history.js');
app.use('/history', history);

// start the server
app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  await mongo.connect();
});