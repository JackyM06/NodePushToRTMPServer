module.exports = io =>{
  const transformStream = require('./transform')
  const fnv = require('fnv-plus');
  const fs = require('fs')
  const {ffmpegRun,pushStream,pushFile} = require('./commonFunction')
  const stream = require('stream')
  // 定义websocket连接池
  io.on('connection', socket => {
    // 连接后创建一个传输流
    console.log('成功创建一个连接');
    const rs = new transformStream()
    let isEnd = true
    let urlSymbol // 连接池中的url缓存
    let urlHash // 连接池中url对应的hash
    let command
    socket.emit('connected') //向客户端发送消息，连接成功

    // 创建推流 url => 推流地址
    socket.on("start", (url,type)=> {
      urlSymbol = url 
      urlHash = fnv.hash(url,64).str()
      console.log(urlSymbol+':开始RTMP推流,等待数据流中')
      command = ffmpegRun(rs,url,socket,type)
      isEnd = false
      socket.emit('started') //向客户端发送消息，成功开始
    })
    // 接收blob，进行推流
    socket.on("sendBlob", blob => {
      if(!isEnd){
        console.log(urlSymbol+':持续推流中')
        let bufferStream = stream.PassThrough()
        bufferStream.end(blob)
        pushStream(bufferStream,rs,`mediaCache/${urlHash}.ts`)
        socket.emit('sent') //向客户端发送消息，blob包发送成功
      }
    })
    // 断开连接，停止推流
    socket.on('end',()=>{
      console.log(urlSymbol+":结束推流")
      if(command) command.kill()
      rs.end() //关闭转换流也会联动关闭rtmp连接
      if(urlHash && !isEnd){
        try{
          fs.unlinkSync(`./mediaCache/${urlHash}.ts`)
          console.log(urlSymbol+":缓存已清除")
        }catch(err){
          console.log('暂无缓存')
        }
      }
      isEnd = true
      socket.emit('ended') //向客户端发送消息，停止成功
    })

    // 客户端强制断开连接后
    socket.on('disconnect',()=>{
      console.log(urlSymbol+":断开连接")
      if(command) command.kill()
      if(rs)rs.end() //关闭转换流也会联动关闭rtmp连接
      if(urlHash && !isEnd){
        try{
          fs.unlinkSync(`./mediaCache/${urlHash}.ts`)
          console.log(urlSymbol+":缓存已清除")
        }catch(err){
          console.log('暂无缓存')
        }
      }
    })

    //  ? ---------  趣味实验 -----------// 
    // 接受文件
    socket.on("sendFileBlob", blob => {
      if(!isEnd){
        console.log(urlSymbol+':持续推流中')
        let bufferStream = stream.PassThrough()
        bufferStream.end(blob)
        pushFile(bufferStream,rs,`mediaCache/${urlHash}.ts`)
        socket.emit('sent') //向客户端发送消息，blob包发送成功
      }
    })
    // 接受FileUrl
    socket.on("sendFileUrl", (FileUrl,url) => {
      console.log('FileUrl,url: ', FileUrl,url);
      console.log("文件URL推流开始")
      urlSymbol = url
      urlHash = fnv.hash(url,64).str()
      command = ffmpegRun(FileUrl,url,socket,"video")
      socket.emit('sent') //向客户端发送消息，blob包发送成功
    })
  })
}