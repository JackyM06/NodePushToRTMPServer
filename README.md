#  NodePushToRTMPServer

> 介绍
>
> Node服务通过获取来自Web客户端采集的实时原始音频数据，在将这些数据进行处理后持续推流到RTMP服务器上。实现H5直播推流到RTMP服务器上，不再让页面依赖Flash :)

## 安装步骤

1. 运行环境需要具备 Node.js V8及以上版本 和 NPM V6及以上版本

2. 使用淘宝镜像

   ```shell
   - 命令行中执行如下命令
   npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```

3. 安装Node服务进程管理工具

   1. [Linux]环境

      ```shell
      npm install pm2 -g
      ```

   2. [Windows]环境

      ```shell
      npm install nodemon -g
      ```

4. 安装FFmpeg应用

   1. Windows下

      ```shell
      - 去到ffmpeg官网 ，将安装包下载后解压
      - 将解压后的文件夹下的bin目录添加到系统环境变量Path中
      - 终端命令行中输入`ffmpeg -version `检测是否安装成功
      ```

   2. Ubuntu下

      ```shell
      - 依次执行一下命令以完成安装
      sudo add-apt-repository ppa:kirillshkrogalev/ffmpeg-next 
      sudo apt-get update 
      sudo apt-get install ffmpeg
      
      - 执行 ffmpeg -version 检测是否安装成功
      ```

## 运行



1. 进入`NodePushToRTMPServer`文件夹下

2. 安装依赖

   ```shell
   cnpm install
   ```

3. 启动服务

   1. [Linux]环境

      ```shell
      pm2 start index.js
      ```

   2. [Windows]环境

      ```shell
      nodemon index.js
      ```



## 备注

> 默认启动端口为8090，如需修改请在index.js中，更改server.listen方法中的参数。



## 通信接口

| 服务端接受的接口                                 | 服务端响应接口                                               |
| ------------------------------------------------ | ------------------------------------------------------------ |
| 客户端与服务端连接后                             | socket.emit('connected') //websocket连接成功                 |
| socket.on("start", url） url:推流地址            | socket.emit('started') //ffmpeg指令发送成功 socket.emit('startError',message)ffmpeg出错 |
| socket.on("sendBlob", blob） blob:音视频blob对象 | socket.emit('sent') //blob对象推流成功                       |
| socket.on('end'）                                | socket.emit('ended') //推流结束成功                          |




## 前端部分DEMO

提供一个与该Node服务衔接的前端部分为你提供测试与参考[Demo]( https://gitee.com/JackyM06/WebPushMedia)

## 注意

- 本项目需要与前端页面建立websocket连接，由于本服务端中使用了socket.io。所以希望你在客户端中使用socket.io-client来进行开发。

## 鸣谢

该项目与另一位小伙伴协同开发，感谢在困境时提供的帮助。