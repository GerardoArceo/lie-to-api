"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../db/mysql"));
const python_1 = require("../utils/python");
const files_1 = require("../utils/files");
const app = (0, express_1.default)();
app.use('/data/gadget', express_1.default.static(__dirname + '/data/gadget'));
var storageVoiceFile = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/gadget');
    },
    filename: (req, file, cb) => {
        let body = req.body;
        cb(null, `${body.uid}-voz.mp4`);
    }
});
var uploadVoiceFile = (0, multer_1.default)({
    storage: storageVoiceFile
});
app.post('/diagnosis', uploadVoiceFile.single('audioFile'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        return next(error);
    }
    let body = req.body;
    if (body.fixedAnswer) {
        yield new Promise(resolve => setTimeout(resolve, 2000));
        const random = Number((50 + Math.random() * 100).toFixed(2));
        const response = {
            ok: true,
            final_result: body.fixedAnswer === 'true',
            hit_probability: random
        };
        res.json(response);
        return;
    }
    try {
        yield (0, files_1.transformAudioToWav)(file.filename);
    }
    catch (error) {
        res.json({ ok: false });
        return;
    }
    if (body.mode == 'trainingLie' || body.mode == 'trainingTruth') {
        const now = Date.now();
        (0, files_1.writeTrainingFile)(body.mode, body.eyeTrackingData, `${now}-ojos.txt`);
        (0, files_1.writeTrainingFile)(body.mode, body.bpmData, `${now}-bpm.txt`);
        (0, files_1.moveSoundFile)(body.mode, `${body.uid}-voz.wav`, `${now}-voz.wav`);
        res.json({ ok: true });
        return;
    }
    else if (body.mode == 'testing') {
        res.json({ ok: true });
        return;
    }
    const promises = [
        (0, python_1.execPythonNN)('ojosNN', body.uid, body.eyeTrackingData),
        (0, python_1.execPythonNN)('bpmNN', body.uid, body.bpmData),
        (0, python_1.execPythonNN)('vozNN', body.uid),
    ];
    const pythonResults = yield Promise.allSettled(promises);
    const eyeMovementResult = pythonResults[0].status === 'fulfilled' ? pythonResults[0].value : {};
    const voiceSignalResult = pythonResults[1].status === 'fulfilled' ? pythonResults[1].value : {};
    const bpmResult = pythonResults[2].status === 'fulfilled' ? pythonResults[2].value : {};
    const finalResult = yield (0, python_1.execPythonNN)('finalNN', body.uid);
    if (body.mode == 'calibration') {
        const args = {
            google_id: body.uid,
            bpm_result: 50,
            eye_movement: 50,
            voice_signal: 50,
        };
        yield mysql_1.default.executeSP('save_user_baseline_variables', args);
    }
    else if (body.mode == 'diagnosis') {
        const args = {
            google_id: body.uid,
            final_result: finalResult.result,
            eye_movement_result: 100,
            voice_signal_result: 100,
            bpm_result: 100,
            hit_probability: finalResult.hit_probability,
        };
        yield mysql_1.default.executeSP('save_diagnosis', args);
    }
    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability
    };
    res.json(response);
}));
app.post('/diagnosisLite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    if (body.fixedAnswer) {
        yield new Promise(resolve => setTimeout(resolve, 13000));
        const random = Number((50 + Math.random() * 50).toFixed(2));
        const response = {
            ok: true,
            final_result: body.fixedAnswer === 'true',
            hit_probability: random
        };
        res.json(response);
        return;
    }
    const finalResult = yield (0, python_1.execPythonNN)('ojosNN', 'TEST', body.eyeTrackingData);
    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability
    };
    res.json(response);
}));
app.post('/retroalimentation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    console.log({ body });
    const args = {
        google_id: body.uid,
        was_right: body.was_right === 'true'
    };
    const result = (yield mysql_1.default.executeSP('update_diagnosis_result', args)).ok;
    res.json(result);
}));
exports.default = app;
