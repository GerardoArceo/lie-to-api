import { OSX_ENV } from "./../config/constants";
const { exec } = require('child_process');
const fs = require('fs')

interface Result {
  result                 : boolean,
  hit_probability       ?: number
}

export const execPythonNN = (NNFile: 'ojosNN' | 'vozNN' | 'bpmNN' | 'finalNN', uid: string, data?: any) => {
    let inputPath: string
    let outputPath: string
    switch (NNFile) {
      case 'ojosNN':
        inputPath = `data/gadget/${uid}-ojos.txt`
        outputPath = `data/results/${uid}-ojos.txt`
        break
      case 'bpmNN':
        inputPath = `data/gadget/${uid}-bpm.txt`
        outputPath = `data/results/${uid}-bpm.txt`
        break
      case 'vozNN':
        inputPath = `data/gadget/${uid}-voz.wav`
        outputPath = `data/results/${uid}-voz.txt`
        break
      case 'finalNN':
        inputPath = `data/results/${uid}-ojos.txt data/results/${uid}-bpm.txt data/results/${uid}-voz.txt`
        outputPath = `data/results/${uid}-final.txt`
        break
    }

    if (data) fs.writeFileSync(inputPath, data);

    const env = OSX_ENV ? 'source ~/tensorflow-metal/bin/activate &&' : '';

    return new Promise<Result>((resolve, reject) => {
        let command = `${env} python3 python/${NNFile}.py ${inputPath} ${outputPath}`;
        console.log('🐍 START:', command);
        exec(command, (err: any, stdout: any, stderr: any) => {
          if (err) {
            reject(err);
            //some err occurred
            console.error(err)
          } else {
            fs.readFile(outputPath, 'utf8' , (err: any, data: any) => {
              if (err) {
                console.error('🐍 ERROR' + err)
                return
              }
              const res = parseFloat(data) * 100
              let hit_probability = res < 50 ? 100 - res : res
              hit_probability = Number(hit_probability.toFixed(2))
              console.log('🐍 RESPONSE: ' + res);
              resolve({result: res > 50, hit_probability});
            })
          }
        });
    });
}