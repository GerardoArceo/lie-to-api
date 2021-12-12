"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveSoundFile = exports.transformAudioToWav = exports.writeTrainingFile = exports.createRequiredFolders = exports.deleteAllData = void 0;
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const deleteAllData = () => {
    fs.rmSync('data', { recursive: true, force: true });
};
exports.deleteAllData = deleteAllData;
const createRequiredFolders = () => {
    if (!fs.existsSync('data'))
        fs.mkdirSync('data');
    if (!fs.existsSync('data/gadget'))
        fs.mkdirSync('data/gadget');
    if (!fs.existsSync('data/results'))
        fs.mkdirSync('data/results');
    if (!fs.existsSync('data/training'))
        fs.mkdirSync('data/training');
    if (!fs.existsSync('data/training/truths'))
        fs.mkdirSync('data/training/truths');
    if (!fs.existsSync('data/training/lies'))
        fs.mkdirSync('data/training/lies');
};
exports.createRequiredFolders = createRequiredFolders;
const writeTrainingFile = (mode, data, inputFile) => {
    if (mode === 'trainingTruth') {
        if (data)
            fs.writeFileSync(`data/training/truths/${inputFile}`, data);
    }
    else if (mode === 'trainingLie') {
        if (data)
            fs.writeFileSync(`data/training/lies/${inputFile}`, data);
    }
};
exports.writeTrainingFile = writeTrainingFile;
const transformAudioToWav = (filename) => {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(`data/gadget/${filename}`)
            .inputFormat('mp4')
            .output(`data/gadget/${filename.split('.')[0]}.wav`)
            .outputFormat('wav')
            .on('end', () => {
            resolve('ok');
            fs.unlinkSync(`data/gadget/${filename}`);
        })
            .on('error', (err) => {
            return reject(new Error(err));
        })
            .run();
    });
};
exports.transformAudioToWav = transformAudioToWav;
const moveSoundFile = (mode, audioFile, inputFile) => {
    if (mode === 'trainingTruth') {
        fs.renameSync(`data/gadget/${audioFile}`, `data/training/truths/${inputFile}`);
    }
    else if (mode === 'trainingLie') {
        fs.renameSync(`data/gadget/${audioFile}`, `data/training/lies/${inputFile}`);
    }
};
exports.moveSoundFile = moveSoundFile;
