const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(require('./routes/index'));

if (process.env.NODE_ENV === 'dev') {
    app.listen(3000);
} else {
    https.createServer({
        key: fs.readFileSync('/home/bitnami/private/private.key'),
        cert: fs.readFileSync('/home/bitnami/private/certificate.crt')
    }, app).listen(3000);
}

console.log(`SERVER IS LISTENING:
            PORT: ${3000} 
`);