const express = require('express');
const multer = require('multer')
const {
    executeAction
} = require('../db/mysql');

const app = express();

app.use('/uploads', express.static(__dirname + '/uploads'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
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
        error.httpStatusCode = 400
        return next("hey error")
    }

    let body = req.body;
    console.log(body);

    const final_result = Math.random() > 0.5

    const hit_probability = Math.floor(Math.random() * (100))

    response = {
        ok: true,
        final_result,
        hit_probability: hit_probability + '%'
    }

    if (body.isOnCalibrationMode == 'true') {
        const params = {
            user_id: body.uid,
            bpm: body.bpm,
            eye_movement: 50,
            voice_signal: 50,
        }

        let result = await executeAction('save_user_baseline_variables', params);
        console.log(result);
    } else {
        const params = {
            user_id: body.uid,
            created_date: new Date(),
            final_result,
            eye_movement_result: 50,
            voice_signal_result: 50,
            bpm_result: body.bpm,
            hit_probability
        }

        let result = await executeAction('save_diagnosis', params);
        console.log(result);
    }


    res.json(response);
})

module.exports = app;