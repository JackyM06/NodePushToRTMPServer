const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

function ffmpegRun(input,output,socket){
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
      socket.emit('startError',err.message) //socket向客户端返回错误信息
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
// 趣味实验
//  推送文件
async function pushFile(input,rs,filename){
  ffmpeg(input).save(filename).on('end',()=>{
    try{
      let readFile = fs.readFileSync(filename)
      rs.write(readFile)
    }catch(err){
      console.log('缓存文件正在生成中')
    }
  }).run()
  
}

module.exports = {ffmpegRun,pushStream,pushFile}