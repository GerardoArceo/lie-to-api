//REQUIREDS
const express = require('express');

const app = express();

app.use(require('./api'));
app.use(require('./diagnosis'));

module.exports = app;