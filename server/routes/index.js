//REQUIREDS
const express = require('express');

const app = express();

app.use(require('./api'));

module.exports = app;