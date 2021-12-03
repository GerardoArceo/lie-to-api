import express from 'express';
import MySQL from '../db/mysql';

const app = express();

app.post('/saveUser', async(req, res) => {

    let body = req.body;
    console.log(body);

    const args = {
        nickname: body.nickname,
        google_id: body.google_id,
        email: body.email,
        pass: body.pass,
    }

    const result = (await MySQL.executeSP('save_user', args)).results;
    console.log(result);

    res.json(result);
});

app.get('/getUserBaselineVariables', async(req, res) => {
    let user_id = req.query.user_id;
    const result = (await MySQL.executeSP('get_user_baseline_variables', user_id)).results;
    console.log(result);
    res.json(result);
});

app.get('/get_user_diagnosis', async(req, res) => {
    let user_id = req.query.user_id;
    const result = (await MySQL.executeSP('get_user_diagnosis', user_id)).results;
    console.log(result);
    res.json(result);
});

app.get('/get_user', async(req, res) => {
    let user_id = req.query.user_id;
    const result = (await MySQL.executeSP('get_user', user_id)).results;
    console.log(result);
    res.json(result);
});

export default app