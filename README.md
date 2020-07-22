#  NodePushToRTMPServer

> 介绍
>
> Node服务通过获取来自Web客户端采集的实时原始音频数据，在将这些数据进行处理后持续推流到RTMP服务器上。实现H5直播推流到RTMP服务器上，不再让页面依赖Flash :)

## 运行步骤

- 首先要求你Node服务所部署的环境中需要安装**ffmpeg**：以下仅仅介绍Windows端安装步骤
  - 去到**ffmpeg**官网 ，将安装包下载后**解压**
  - 将解压后的文件夹下的**bin**目录添加到系统环境变量**Path**
  - 终端命令行中输入`ffmpeg -version `检测是否安装成功
- **clone**项目
- 下载依赖
  - `npm i`
- 运行
  - `npm run dev`



## 通信接口

| 服务端接受的接口                                 | 服务端响应接口                                               |
| ------------------------------------------------ | ------------------------------------------------------------ |
| 客户端与服务端连接后                             | socket.emit('connected') //websocket连接成功                 |
| socket.on("start", url） url:推流地址            | socket.emit('started') //推流指令发送成功 socket.emit('startError',message) |
| socket.on("sendBlob", blob） blob:音视频blob对象 | socket.emit('sent') //blob对象推流成功                       |
| socket.on('end'）                                | socket.emit('ended') //推流结束成功                          |




## 前端部分DEMO

提供一个与该Node服务衔接的前端部分为你提供测试与参考[Demo]( https://gitee.com/JackyM06/WebPushMedia)

## 注意

- 本项目需要与前端页面建立websocket连接，由于本服务端中使用了socket.io。所以希望你在客户端中使用socket.io-client来进行开发。

## 鸣谢

该项目与另一位小伙伴协同开发，感谢在困境时提供的帮助。