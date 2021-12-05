"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveSoundFile = exports.writeTrainingFile = exports.execPythonNN = void 0;
const { exec } = require('child_process');
const fs = require('fs');
const execPythonNN = (NNFile, data, inputFile, outputFile) => {
    if (data)
        fs.writeFileSync(`./uploads/${inputFile}`, data);
    console.log(`PYTHON ${NNFile} STARTED`);
    return new Promise((resolve, reject) => {
        const command = `source ~/tensorflow-metal/bin/activate && python3 ./python/${NNFile}.py ./uploads/${inputFile} ./results/${outputFile}`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                console.error(err);
            }
            else {
                fs.readFile(`./results/${outputFile}`, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const result = JSON.parse(data);
                    console.log(`PYTHON ${NNFile} FINISHED WITH RESULT: `, result);
                    resolve(result);
                });
            }
        });
    });
};
exports.execPythonNN = execPythonNN;
const writeTrainingFile = (mode, data, inputFile) => {
    if (mode === 'trainingTruth') {
        if (data)
            fs.writeFileSync(`./training/truths/${inputFile}`, data);
    }
    else if (mode === 'trainingLie') {
        if (data)
            fs.writeFileSync(`./training/lies/${inputFile}`, data);
    }
};
exports.writeTrainingFile = writeTrainingFile;
const moveSoundFile = (mode, audioFile, inputFile) => {
    if (mode === 'trainingTruth') {
        fs.renameSync(`./uploads/${audioFile}`, `./training/truths/${inputFile}`);
    }
    else if (mode === 'trainingLie') {
        fs.renameSync(`./uploads/${audioFile}`, `./training/lies/${inputFile}`);
    }
};
exports.moveSoundFile = moveSoundFile;
