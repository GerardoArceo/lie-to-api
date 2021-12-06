const { exec } = require('child_process');
const fs = require('fs')

interface Result {
  result                 : number,
  hit_probability        : number
}

export const execPythonNN = (NNFile: 'OjosNN' | 'VozNN' | 'BPMNN' | 'FinalNN', data: any, inputFile: string, outputFile: string) => {
    if (data) fs.writeFileSync(`data/gadget/${inputFile}`, data);

    return new Promise<Result>((resolve, reject) => {
        const command = `source ~/tensorflow-metal/bin/activate && python3 python/${NNFile}.py data/gadget/${inputFile} data/results/${outputFile}`;
        exec(command, (err: any, stdout: any, stderr: any) => {
          if (err) {
            reject(err);
            //some err occurred
            console.error(err)
          } else {
            fs.readFile(`data/results/${outputFile}`, 'utf8' , (err: any, data: any) => {
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