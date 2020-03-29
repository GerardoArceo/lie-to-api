//REQUIREDS
const express = require('express');
const bodyParser = require('body-parser');

//UTILIZR EXPRESS JS CÓMO FRAMEWORK WEB
const app = express();

//RECIBIR RESPUESTA DECODIFICADA EN FORMA DE JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//CONFIGURACIÓN GLOBAL DE RUTAS
app.use(require('./routes/index.js'));

//CONFIGURACIÓN DE CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//PONER SERVIDOR EN ESCUCHA
app.listen(3000);