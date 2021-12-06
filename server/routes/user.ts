import express from 'express';
import MySQL from '../db/mysql';

const app = express();

interface SaveUserPayload {
    uid: string
    email: string
    nickname: string
}
app.post('/saveUser', async(req, res) => {
    let body: SaveUserPayload = req.body;

    const args = {
        google_id: body.uid,
        email: body.email,
        nickname: body.nickname,
    }

    const ok = (await MySQL.executeSP('save_user', args)).ok;
    res.json({ok});
});

app.get('/getUserBaselineVariables', async(req, res) => {
    let uid = req.query.uid;
    const result = (await MySQL.executeSP('get_user_baseline_variables', {uid})).results;
    res.json(result);
});

app.get('/get_user_diagnosis', async(req, res) => {
    let uid = req.query.uid;
    const result = (await MySQL.executeSP('get_user_diagnosis', {uid})).results;
    console.log(result);
    res.json(result);
});

export default app