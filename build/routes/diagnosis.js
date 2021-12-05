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
const app = (0, express_1.default)();
app.use('/uploads', express_1.default.static(__dirname + '/uploads'));
var storageVoiceFile = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        let body = req.body;
        cb(null, `${body.uid}-voz.mp4`);
    }
});
var uploadVoiceFile = (0, multer_1.default)({
    storage: storageVoiceFile
});
app.post('/diagnosis', uploadVoiceFile.single('myFile'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        return next("hey error");
    }
    let body = req.body;
    if (body.eyeTrackingData === '[]')
        body.eyeTrackingData = '[1,1,1,1,1,1,1,1,1,1,1,1,,1,1,1,1,1,1]';
    const promises = [
        (0, python_1.execPythonNN)('OjosNN', body.eyeTrackingData, `${body.uid}-ojos.txt`, `${body.uid}-ojos.txt`),
        (0, python_1.execPythonNN)('VozNN', null, `${body.uid}-voz.mp4`, `${body.uid}-voz.txt`),
        (0, python_1.execPythonNN)('BPMNN', body.bpm, `${body.uid}-bpm.txt`, `${body.uid}-bpm.txt`)
    ];
    const pythonResults = yield Promise.allSettled(promises);
    const eyeMovementResult = pythonResults[0].status === 'fulfilled' ? pythonResults[0].value : {};
    const voiceSignalResult = pythonResults[1].status === 'fulfilled' ? pythonResults[1].value : {};
    const bpmResult = pythonResults[2].status === 'fulfilled' ? pythonResults[2].value : {};
    const finalResult = yield (0, python_1.execPythonNN)('FinalNN', null, file.filename, `${body.uid}-final.txt`);
    if (body.isOnCalibrationMode == 'true') {
        const args = {
            user_id: body.uid,
            bpm_result: body.bpm,
            eye_movement: 50,
            voice_signal: 50,
        };
        const result = (yield mysql_1.default.executeSP('save_user_baseline_variables', args)).results;
        console.log(result);
    }
    else {
        const args = {
            user_id: body.uid,
            final_result: finalResult.result,
            eye_movement_result: eyeMovementResult.result,
            voice_signal_result: voiceSignalResult.result,
            bpm_result: bpmResult.result,
            hit_probability: finalResult.hit_probability,
        };
        const result = (yield mysql_1.default.executeSP('save_diagnosis', args)).results;
    }
    const response = {
        ok: true,
        final_result: finalResult.result,
        hit_probability: finalResult.hit_probability + '%'
    };
    res.json(response);
}));
app.post('/retroalimentation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    console.log(body);
    const args = {
        id: body.id,
        was_right: body.was_right
    };
    const result = (yield mysql_1.default.executeSP('update_diagnosis_result', args)).results;
    res.json(result);
}));
exports.default = app;
