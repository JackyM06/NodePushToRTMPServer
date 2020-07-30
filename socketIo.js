module.exports = io =>{
  const transformStream = require('./transform')
  const fnv = require('fnv-plus');
  const fs = require('fs')
  const {ffmpegRun,pushStream,pushFile} = require('./commonFunction')
  const stream = require('stream')

  function msgFormat(url,msg){
    let date = new Date().toLocaleString()
    console.log(`[${date}][${url}]:${msg}`)
    return true
  }
  // 定义websocket连接池
  io.on('connection', socket => {
    // 连接后创建一个传输流
    msgFormat("","成功创建一个连接")
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
      msgFormat(urlSymbol,"开始RTMP推流,等待数据流中")
      command = ffmpegRun(rs,url,socket,type)
      isEnd = false
      socket.emit('started') //向客户端发送消息，成功开始
    })
    // 接收blob，进行推流
    socket.on("sendBlob", blob => {
      if(!isEnd){
        msgFormat(urlSymbol,"正在持续推流")
        let bufferStream = stream.PassThrough()
        bufferStream.end(blob)
        pushStream(bufferStream,rs,`mediaCache/${urlHash}.ts`)
        socket.emit('sent') //向客户端发送消息，blob包发送成功
      }
    })
    // 断开连接，停止推流
    socket.on('end',()=>{
      msgFormat(urlSymbol,"结束推流")
      if(command) command.kill()
      rs.end() //关闭转换流也会联动关闭rtmp连接
      if(urlHash && !isEnd){
        try{
          fs.unlinkSync(`./mediaCache/${urlHash}.ts`)
          msgFormat(urlSymbol,"缓存已清除")
        }catch(err){
          msgFormat(urlSymbol,"暂无缓存")
        }
      }
      isEnd = true
      socket.emit('ended') //向客户端发送消息，停止成功
    })

    // 客户端强制断开连接后
    socket.on('disconnect',()=>{
      msgFormat(urlSymbol,"断开连接")
      if(command) command.kill()
      if(rs)rs.end() //关闭转换流也会联动关闭rtmp连接
      if(urlHash && !isEnd){
        try{
          fs.unlinkSync(`./mediaCache/${urlHash}.ts`)
          msgFormat(urlSymbol,"缓存已清除")
        }catch(err){
          msgFormat(urlSymbol,"暂无缓存")
        }
      }
    })

    //  ? ---------  实验部分 -----------// 
    // 接受文件
    socket.on("sendFileBlob", blob => {
      if(!isEnd){
        msgFormat(urlSymbol,"文件上传完成，开始推流中")
        pushFile(blob,rs)
        socket.emit('sent') //向客户端发送消息，blob包发送成功
      }
    })
    // 接受FileUrl
    socket.on("sendFileUrl", (FileUrl,url) => {
      msgFormat(url,"文件URL推流开始")
      urlSymbol = url
      urlHash = fnv.hash(url,64).str()
      command = ffmpegRun(FileUrl,url,socket,"video") //默认位按video模式推流
      socket.emit('sent') //向客户端发送消息，blob包发送成功
    })
  })
}