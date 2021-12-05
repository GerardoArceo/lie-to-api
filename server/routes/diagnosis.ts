import multer from 'multer';
import express from "express";
import MySQL from '../db/mysql';
import { execPythonNN } from '../utils/python';

const app = express();

app.use('/uploads', express.static(__dirname + '/uploads'));

interface DiagnosisPayload {
    uid: string
    bpm: string
    isOnCalibrationMode: string
    eyeTrackingData: string
}

var storageVoiceFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        let body = req.body;
        cb(null, `${body.uid}-voz.mp4`)
    }
})

var uploadVoiceFile = multer({
    storage: storageVoiceFile
})

app.post('/diagnosis', uploadVoiceFile.single('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        return next("hey error")
    }
    
    let body: DiagnosisPayload = req.body;
    if (body.eyeTrackingData === '[]') body.eyeTrackingData = '[1,1,1,1,1,1,1,1,1,1,1,1,,1,1,1,1,1,1]';

    const promises = [
        execPythonNN('OjosNN', body.eyeTrackingData, `${body.uid}-ojos.txt`, `${body.uid}-ojos.txt`),
        execPythonNN('VozNN', null, `${body.uid}-voz.mp4`, `${body.uid}-voz.txt`),
        execPythonNN('BPMNN', body.bpm, `${body.uid}-bpm.txt`, `${body.uid}-bpm.txt`)
    ];
    const pythonResults = await Promise.allSettled(promises)

    const eyeMovementResult = pythonResults[0].status === 'fulfilled' ? pythonResults[0].value : {} as any;
    const voiceSignalResult = pythonResults[1].status === 'fulfilled' ? pythonResults[1].value : {} as any;
    const bpmResult = pythonResults[2].status === 'fulfilled' ? pythonResults[2].value : {} as any;
    
    const finalResult = await execPythonNN('FinalNN', null, file.filename, `${body.uid}-final.txt`);

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

    res.json(result);
});

export default app