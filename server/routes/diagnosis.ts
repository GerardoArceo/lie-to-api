import multer from 'multer';
import express from "express";
import MySQL from '../db/mysql';

const app = express();

app.use('/uploads', express.static(__dirname + '/uploads'));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

var upload = multer({
    storage: storage
})

app.post('/diagnosis', upload.single('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        return next("hey error")
    }

    let body = req.body;
    console.log(body);

    const final_result = Math.random() > 0.5

    const hit_probability = Math.floor(Math.random() * (100))

    const response = {
        ok: true,
        final_result,
        hit_probability: hit_probability + '%'
    }

    if (body.isOnCalibrationMode == 'true') {
        const args = {
            user_id: body.uid,
            bpm: body.bpm,
            eye_movement: 50,
            voice_signal: 50,
        }

        const result = (await MySQL.executeSP('save_user_baseline_variables', args)).results;

        console.log(result);
    } else {
        const args = {
            user_id: body.uid,
            final_result,
            eye_movement_result: 50,
            voice_signal_result: 50,
            bpm_result: body.bpm,
            hit_probability
        }

        const result = (await MySQL.executeSP('save_diagnosis', args)).results;
        console.log(result);
    }


    res.json(response);
})

app.post('/retroalimentation', async(req, res) => {

    let body = req.body;
    console.log(body);

    const args = {
        id: body.id,
        was_right: body.was_right
    }

    const result = (await MySQL.executeSP('update_diagnosis_result', args)).results;
    console.log(result);

    res.json(result);
});

export default app