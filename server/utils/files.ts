const fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const deleteAllData = () => {
  fs.rmSync('data', { recursive: true, force: true });
}

export const createRequiredFolders = () => {
    if (!fs.existsSync('data')) fs.mkdirSync('data');
    if (!fs.existsSync('data/gadget')) fs.mkdirSync('data/gadget');
    if (!fs.existsSync('data/results')) fs.mkdirSync('data/results');
    if (!fs.existsSync('data/training')) fs.mkdirSync('data/training');
    if (!fs.existsSync('data/training/truths')) fs.mkdirSync('data/training/truths');
    if (!fs.existsSync('data/training/lies')) fs.mkdirSync('data/training/lies');
}

export const writeTrainingFile = (mode: 'trainingTruth' | 'trainingLie', data: any, inputFile: string) => {  
    if (mode === 'trainingTruth') {
      if (data) fs.writeFileSync(`data/training/truths/${inputFile}`, data);
    } else if (mode === 'trainingLie') {
      if (data) fs.writeFileSync(`data/training/lies/${inputFile}`, data);
    }
  }
  
  export const transformAudioToWav = (soundFile: string, outputFile: string) => {
    return new Promise((resolve,reject) => {
      ffmpeg()
        .input(`data/gadget/${soundFile}`)
        .inputFormat('mp4')
        .output(`data/gadget/${soundFile.split('.')[0]}.wav`)
        .outputFormat('wav')
        .on('end', () => {
          resolve('ok')
          fs.unlinkSync(`data/gadget/${soundFile}`)
        })
        .on('error',(err: string)=>{
          return reject(new Error(err))
        })
        .run();
   })
  }
  
  export const moveSoundFile = (mode: 'trainingTruth' | 'trainingLie', audioFile: string, inputFile: string) => {
    if (mode === 'trainingTruth') {
      fs.renameSync(`data/gadget/${audioFile}`, `data/training/truths/${inputFile}`)
    } else if (mode === 'trainingLie') {
      fs.renameSync(`data/gadget/${audioFile}`, `data/training/lies/${inputFile}`)
    }
  }