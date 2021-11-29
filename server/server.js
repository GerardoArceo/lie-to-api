
const express= require('express')
const { CORS } = require('./middlewares/access');
require('./config/config');

const app= express();

app.use(CORS);

app.use(require('./routes/index'));

app.listen(process.env.PORT, () => console.log(`SERVER RUNNING ON PORT: ${process.env.PORT} 🐨`));