const express = require('express');
const bodyParser = require('body-parser');
const port = 3004;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(require('./routes/index'));

app.listen(port, console.log(`SERVER LISTENING PORT: ${ port }`));