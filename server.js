const express = require("express")
const fs = require('fs')
const app = new express()

app.use(require("cors")())

app.get('/',async(req,res)=>{
  res.send("test is ok")
})

var multer  = require('multer')
const mediaStream = multer({ dest: 'mediaCache/' })

const ffmpeg = require('fluent-ffmpeg')
// const outputPath = 'rtmp://localhost:1935/live/home'
const outputPath = 'rtmp://39.106.198.9:1935/live/home'

// const fs = require('fs')
let PIPEW = fs.createWriteStream('mediaCache/cacheMedia')

let inputPath = fs.createReadStream('mediaCache/cacheMedia')



      
// 
// res.send(req.file.path)
let isFirst = true
app.post('/stream',mediaStream.single('media'),async(req,res)=>{
  let inputPath = req.file.path
  let command = 
  ffmpeg(inputPath)
  .addOptions([
    '-codec:a aac',
    '-ac 2',
    '-ar 44100'
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
  command
  .output(outputPath)
  .run()
      
      res.send(req.file)
})

app.listen(3000,()=>{
  console.log("http://localhost:3000")
})