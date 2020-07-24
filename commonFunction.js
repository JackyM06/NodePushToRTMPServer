const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

function ffmpegRun(input,output,socket,type='audio'){
  let command = 
  ffmpeg(input)
    .on('start', (commandLine) => {
      console.log('[' + new Date() + '] Stream is Pushing !');
      console.log('commandLine: ' + commandLine);
    })
    .on('error', (err, stdout, stderr) => {
      if(!err.message.includes('ffmpeg was killed')){
        console.log('error: ' + err.message);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        socket.emit('startError',err.message) //socket向客户端返回错误信息
      }
    })
    .on('end', () => {
      console.log('[' + new Date() + '] Stream Pushing is Finished !');
      socket.emit('ended')
    })
    .native()
    .format('flv')
    .output(output)
  if(type === 'audio'){
    command.addOptions([
      '-codec:a aac',
      '-ac 2',
      '-ar 44100',
    ])
  }else if(type === 'video'){
    command.addOptions([
      'c:v libx264',
      '-codec:a aac',
      'ac 2',
      'ar 44100',
      'b:a 96k'
    ])
  }else{
    return socket.emit('startError','暂不支持该类型推流！')
  }
  command.run()
  try{
    fs.mkdirSync('mediaCache')
  }catch(err){
    console.log('mediaCache已创建')
  }
  return command
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