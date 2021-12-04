import multer from 'multer';
import express from "express";
import MySQL from '../db/mysql';
import { execPythonNN } from '../utils/python';

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

    const eyeMovementResult = await execPythonNN('OjosNN', 'data_ojos.txt', 'resultado.txt');
    const voiceSignalResult = await execPythonNN('VozNN', 'data_ojos.txt', 'resultado.txt');
    const bpmResult = await execPythonNN('BPMNN', 'data_ojos.txt', 'resultado.txt');
    const finalResult = await execPythonNN('FinalNN', 'data_ojos.txt', 'resultado.txt');

    if (body.isOnCalibrationMode == 'true') {
        const args = {
            user_id: body.uid,
            bpm_result: body.bpm,
            eye_movement: 50,
            voice_signal: 50,
        }

        const result = (await MySQL.executeSP('save_user_baseline_variables', args)).results;
        console.log(result);
    } else {  
        const args = {
            user_id: body.uid,
            final_result: finalResult.result,
            eye_movement_result: eyeMovementResult.result,
            voice_signal_result: voiceSignalResult.result,
            bpm_result: bpmResult.result,
            hit_probability: finalResult.hit_probability,
        }

        const result = (await MySQL.executeSP('save_diagnosis', args)).results;
        console.log(result);
    }

    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability + '%'
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

app.get('/test', async(req, res) => {
    const eyeMovementResult = await execPythonNN('OjosNN', 'data_ojos.txt', 'resultado.txt');
    const voiceSignalResult = await execPythonNN('VozNN', 'data_ojos.txt', 'resultado.txt');
    const bpmResult = await execPythonNN('BPMNN', 'data_ojos.txt', 'resultado.txt');
    const finalResult = await execPythonNN('FinalNN', 'data_ojos.txt', 'resultado.txt');

    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability + '%'
    }

    res.json(response);
});

export default app