"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execPythonNN = void 0;
const { exec } = require('child_process');
const fs = require('fs');
const execPythonNN = (NNFile, inputFile, outputFile) => {
    inputFile = 'data_ojos.txt';
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
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        });
    });
};
exports.execPythonNN = execPythonNN;
