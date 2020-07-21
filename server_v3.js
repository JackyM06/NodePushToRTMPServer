const express = require("express")
const fs = require('fs')
const app = new express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const stream = require('stream')
app.use(require("cors")())

const {ffmpegRun,pushStream} = require('./commonFunction')

const transformStream = require('./transform')
const fnv = require('fnv-plus');

// 定义websocket连接池
io.on('connection', socket => {
  // 连接后创建一个传输流
  console.log('成功创建一个连接');
  const rs = new transformStream()
  let isEnd = true
  let urlSymbol // 连接池中的url缓存
  let urlHash // 连接池中url对应的hash
  // 创建推流 url => 推流地址
  socket.on("start", url => {
    urlSymbol = url 
    urlHash = fnv.hash(url,64).str()
    console.log(urlSymbol+':开始RTMP推流,等待数据流中')
    ffmpegRun(rs,url)
    isEnd = false
  })
  // 接收blob，进行推流
  socket.on("sendBlob", blob => {
    if(!isEnd){
      console.log(urlSymbol+':持续推流中')
      let bufferStream = stream.PassThrough()
      bufferStream.end(blob)
      pushStream(bufferStream,rs,`mediaCache/${urlHash}.ts`)
    }
  })
  // 断开连接，停止推流
  socket.on('end',()=>{
    console.log(urlSymbol+":结束推流")
    if(urlHash)fs.unlinkSync(`mediaCache/${urlHash}.ts`)
    rs.end()
    isEnd = true
  })
})
server.listen(3000)