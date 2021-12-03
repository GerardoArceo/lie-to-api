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
const app = (0, express_1.default)();
app.use('/uploads', express_1.default.static(__dirname + '/uploads'));
var storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
var upload = (0, multer_1.default)({
    storage: storage
});
app.post('/diagnosis', upload.single('myFile'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        return next("hey error");
    }
    let body = req.body;
    console.log(body);
    const final_result = Math.random() > 0.5;
    const hit_probability = Math.floor(Math.random() * (100));
    const response = {
        ok: true,
        final_result,
        hit_probability: hit_probability + '%'
    };
    if (body.isOnCalibrationMode == 'true') {
        const args = {
            user_id: body.uid,
            bpm: body.bpm,
            eye_movement: 50,
            voice_signal: 50,
        };
        const result = (yield mysql_1.default.executeSP('save_user_baseline_variables', args)).results;
        console.log(result);
    }
    else {
        const args = {
            user_id: body.uid,
            final_result,
            eye_movement_result: 50,
            voice_signal_result: 50,
            bpm_result: body.bpm,
            hit_probability
        };
        const result = (yield mysql_1.default.executeSP('save_diagnosis', args)).results;
        console.log(result);
    }
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
    console.log(result);
    res.json(result);
}));
exports.default = app;
