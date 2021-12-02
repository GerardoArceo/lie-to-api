const express = require('express');

const app = express();

app.post('/api', async(req, res) => {
    let body = req.body;

    console.log(body);

    try {
        params = JSON.parse(body.params);
    } catch (Exception) {
        params = {};
    }
    let result = await executeAction(db, accion, params);
    res.json(result);
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
    data = {
        app: 'Lie to Api 2',
        fecha: Date.now(),
        nombre: 'Gerardo Arceo',
        mensaje: 'Sé feliz :)'
    };
    console.log(data);
    res.json({
        data
    });
});

module.exports = app;