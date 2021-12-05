const { exec } = require('child_process');
const fs = require('fs')

interface Result {
  result                 : number,
  hit_probability        : number
}

export const execPythonNN = (NNFile: 'OjosNN' | 'VozNN' | 'BPMNN' | 'FinalNN', data: any, inputFile: string, outputFile: string) => {
    if (data) fs.writeFileSync(`./uploads/${inputFile}`, data);

    console.log(`PYTHON ${NNFile} STARTED`)
    return new Promise<Result>((resolve, reject) => {
        const command = `source ~/tensorflow-metal/bin/activate && python3 ./python/${NNFile}.py ./uploads/${inputFile} ./results/${outputFile}`;
        exec(command, (err: any, stdout: any, stderr: any) => {
          if (err) {
            reject(err);
            //some err occurred
            console.error(err)
          } else {
            fs.readFile(`./results/${outputFile}`, 'utf8' , (err: any, data: any) => {
              if (err) {
                console.error(err)
                return
              }
              const result = JSON.parse(data)
              console.log(`PYTHON ${NNFile} FINISHED WITH RESULT: `, result);
              resolve(result);
            })

            // the *entire* stdout and stderr (buffered)
            // console.log(`stdout: ${stdout}`);
            // console.log(`stderr: ${stderr}`);
          }
        });
    });
}

export const writeTrainingFile = (mode: 'trainingTruth' | 'trainingLie', data: any, inputFile: string) => {
  if (mode === 'trainingTruth') {
    if (data) fs.writeFileSync(`./training/truths/${inputFile}`, data);
  } else if (mode === 'trainingLie') {
    if (data) fs.writeFileSync(`./training/lies/${inputFile}`, data);
  }
}

export const moveSoundFile = (mode: 'trainingTruth' | 'trainingLie', audioFile: string, inputFile: string) => {
  if (mode === 'trainingTruth') {
    fs.renameSync(`./uploads/${audioFile}`, `./training/truths/${inputFile}`)
  } else if (mode === 'trainingLie') {
    fs.renameSync(`./uploads/${audioFile}`, `./training/lies/${inputFile}`)
  }

}