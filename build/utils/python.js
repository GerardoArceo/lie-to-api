"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execPythonNN = void 0;
const constants_1 = require("./../config/constants");
const { exec } = require('child_process');
const fs = require('fs');
const execPythonNN = (NNFile, uid, data) => {
    let inputPath;
    let outputPath;
    switch (NNFile) {
        case 'ojosNN':
            inputPath = `data/gadget/${uid}-ojos.txt`;
            outputPath = `data/results/${uid}-ojos.txt`;
            break;
        case 'bpmNN':
            inputPath = `data/gadget/${uid}-bpm.txt`;
            outputPath = `data/results/${uid}-bpm.txt`;
            break;
        case 'vozNN':
            inputPath = `data/gadget/${uid}-voz.wav`;
            outputPath = `data/results/${uid}-voz.txt`;
            break;
        case 'finalNN':
            inputPath = `data/results/${uid}-ojos.txt data/results/${uid}-bpm.txt data/results/${uid}-voz.txt`;
            outputPath = `data/results/${uid}-final.txt`;
            break;
    }
    if (data)
        fs.writeFileSync(inputPath, data);
    const env = constants_1.OSX_ENV ? 'source ~/tensorflow-metal/bin/activate &&' : '';
    return new Promise((resolve, reject) => {
        let command = `${env} python3 python/${NNFile}.py ${inputPath} ${outputPath}`;
        console.log('🐍 START:', command);
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                console.error(err);
            }
            else {
                fs.readFile(outputPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('🐍 ERROR' + err);
                        return;
                    }
                    const res = parseFloat(data) * 100;
                    let hit_probability = res < 50 ? 100 - res : res;
                    hit_probability = Number(hit_probability.toFixed(2));
                    console.log('🐍 RESPONSE: ' + res);
                    resolve({ result: res > 50, hit_probability });
                });
            }
        });
    });
};
exports.execPythonNN = execPythonNN;
