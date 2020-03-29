//REQUIREDS
const express = require('express');
const fs = require('fs');
const { CORS } = require('../middlewares/access');

const app = express();

app.use(CORS);

app.post('/diagnosis', async(req, res) => {
    let body = req.body;
    let voice_signal = body.voice_signal;

    const buffer = new Buffer.from(voice_signal);
    fs.writeFile('sound.aac', buffer, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

    response = {
        ok: true,
        result: 'Mentira',
        interval: '55%'
    }

    res.json(response);
});

app.post('/retroalimentation', async(req, res) => {
    let body = req.body;

    console.log(body);

    response = {
        ok: true,
    }

    res.json(response);
});

app.get('/', (req, res) => {

    console.log('Lie to Api');
    data = {
        app: 'Lie to Api',
        fecha: Date.now(),
        nombre: 'Gerardo Arceo',
        mensaje: 'Sé feliz :)'
    };
    res.json({
        data
    });
});

module.exports = app;