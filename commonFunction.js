const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

function ffmpegRun(input,output){
  ffmpeg(input)
    .addOptions([
      '-codec:a aac',
      '-ac 2',
      '-ar 44100',
    ])
    .on('start', function (commandLine) {
      console.log('[' + new Date() + '] Stream is Pushing !');
      console.log('commandLine: ' + commandLine);
    })
    .on('error', function (err, stdout, stderr) {
      console.log('error: ' + err.message);
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    })
    .on('end', function () {
      console.log('[' + new Date() + '] Stream Pushing is Finished !');
    })
    .format('flv')
    .output(output)
    .run()
  try{
    fs.mkdirSync('mediaCache')
  }catch(err){
    console.log('mediaCache已创建')
  }
}

async function pushStream(input,rs,filename){
  ffmpeg(input).save(filename).run()
  try{
    let readFile = fs.readFileSync(filename)
    rs.write(readFile)
  }catch(err){
    console.log('缓存文件正在生成中')
  }
}

module.exports = {ffmpegRun,pushStream}