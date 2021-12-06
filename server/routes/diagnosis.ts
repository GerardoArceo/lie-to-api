import multer from 'multer';
import express from "express";
import MySQL from '../db/mysql';
import { execPythonNN } from '../utils/python';
import { transformAudioToWav, moveSoundFile, writeTrainingFile } from '../utils/files';

const app = express();

app.use('/data/gadget', express.static(__dirname + '/data/gadget'));

interface DiagnosisPayload {
    uid: string
    heartData: string
    eyeTrackingData: string
    mode: 'diagnosis' | 'calibration' | 'trainingTruth' | 'trainingLie' | 'testing'
}

var storageVoiceFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/gadget')
    },
    filename: (req, file, cb) => {
        let body = req.body;
        cb(null, `${body.uid}-voz.${file.originalname.split('.').pop()}`)
    }
})

var uploadVoiceFile = multer({
    storage: storageVoiceFile
})

app.post('/diagnosis', uploadVoiceFile.single('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        return next(error)
    }
    
    let body: DiagnosisPayload = req.body;
    
    const transformAudioToWavResponse = await transformAudioToWav(file.filename, `${body.uid}-voz.wav`);

    if (body.mode == 'trainingLie' || body.mode == 'trainingTruth') {
        const now = Date.now();
        writeTrainingFile(body.mode, body.eyeTrackingData, `${now}-ojos.txt`)
        writeTrainingFile(body.mode, body.heartData, `${now}-bpm.txt`)
        moveSoundFile(body.mode, `${body.uid}-voz.wav`, `${now}-voz.wav`)
        res.json({ok: true});
        return;
    } else if (body.mode == 'testing') {
        res.json({ok: true});
        return;
    }

    const promises = [
        execPythonNN('OjosNN', body.eyeTrackingData, `${body.uid}-ojos.txt`, `${body.uid}-ojos.txt`),
        execPythonNN('VozNN', null, file.filename, `${body.uid}-voz.txt`),
        execPythonNN('BPMNN', body.heartData, `${body.uid}-bpm.txt`, `${body.uid}-bpm.txt`)
    ];
    const pythonResults = await Promise.allSettled(promises)

    const eyeMovementResult = pythonResults[0].status === 'fulfilled' ? pythonResults[0].value : {} as any;
    const voiceSignalResult = pythonResults[1].status === 'fulfilled' ? pythonResults[1].value : {} as any;
    const bpmResult = pythonResults[2].status === 'fulfilled' ? pythonResults[2].value : {} as any;
    
    const finalResult = await execPythonNN('FinalNN', null, file.filename, `${body.uid}-final.txt`);

    if (body.mode == 'calibration') {
        const args = {
            google_id: body.uid,
            bpm_result: 50,
            eye_movement: 50,
            voice_signal: 50,
        }

        await MySQL.executeSP('save_user_baseline_variables', args);
    } else if (body.mode == 'diagnosis') {  
        const args = {
            google_id: body.uid,
            final_result: finalResult.result,
            eye_movement_result: eyeMovementResult.hit_probability,
            voice_signal_result: voiceSignalResult.hit_probability,
            bpm_result: bpmResult.hit_probability,
            hit_probability: finalResult.hit_probability,
        }

        await MySQL.executeSP('save_diagnosis', args);
    }

    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability + '%'
    }

    res.json(response);
})


interface RetroalimentationPayload {
    uid: string
    was_right: string
}
app.post('/retroalimentation', async(req, res) => {

    let body: RetroalimentationPayload = req.body;
    console.log({body});

    const args = {
        google_id: body.uid,
        was_right: body.was_right === 'true' 
    }

    const result = (await MySQL.executeSP('update_diagnosis_result', args)).results;

    res.json(result);
});

export default app