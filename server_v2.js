const express = require("express")
const fs = require('fs')
const app = new express()

app.use(require("cors")())


var multer  = require('multer')
const mediaStream = multer({ dest: 'mediaCache/' })

const ffmpeg = require('fluent-ffmpeg')
const outputPath = 'rtmp://localhost:1935/live/home'
// const outputPath = 'rtmp://39.106.198.9:1935/live/home'

const transformStream = require('./transform')
const rs = new transformStream()
rs.on('data',chunk=>{
  console.log("data is transfrom!")
})
rs.on('end',()=>{
  console.log("end")
})

let command = 
ffmpeg(rs)
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
.on('data',()=>{console.log("chunking")})
.format('flv')
.output(outputPath)
.run()

// setTimeout(()=>{
//   rs.end()
// },1000*10)

app.post('/stream',mediaStream.single('media'),async(req,res)=>{
  ffmpeg(req.file.path).save('audio.ts').run()
  let readFile =  fs.readFileSync('audio.ts')
  rs.write(readFile)
  res.send('ok')
})

app.listen(3000,()=>{
  console.log("http://localhost:3000")
})