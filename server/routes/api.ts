import express from 'express';

const app = express();

app.post('/retroalimentation', async(req, res) => {
    let body = req.body;

    console.log(body);

    const response = {
        ok: true,
    }

    res.json(response);
});

app.get('/', (req, res) => {
    const data = {
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

export default app