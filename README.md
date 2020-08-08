#  NodePushToRTMPServer

> 介绍
>
> 本服务通过获取来自Web客户端采集的实时原始音/视频数据，再将这些数据进行处理后持续推流到RTMP服务器上。实现H5直播推流到RTMP服务器，不再让页面依赖Flash 

## 备注

> 默认启动端口为8090，如需修改请在index.js中，更改server.listen方法中的参数。



## CentOS 7+ 环境 部署流程 🎃

### 安装

1. 运行环境需要具备 Node.js V8及以上版本 和 NPM V6及以上版本

   ```shell
   1. 获取Nodejs资源
   curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
   
   2. 安装Node.js
   yum install -y nodejs
   ```

2. NPM使用cnpm淘宝镜像

   ```shell
   1. 安装cnpm
   npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```

3. 安装Node服务进程管理工具

   ```shell
   cnpm install pm2 -g
   ```

4. 安装git

   ```shell
   yum -y install git
   ```

5. 安装FFmpeg应用

   ```shell
   1. 安装镜像
   yum install epel-release
   
   2. 安装nux存储库
   rpm -v --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro
   
   rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm
   
   3. 安装ffmpeg
   yum install ffmpeg ffmpeg-devel
   
   4. 检查版本
   ffmpeg -version
   ```

### 运行

1. 将项目clone到本地中

   ```shell
   git clone https://gitee.com/JackyM06/NodePushToRTMPServer.git
   ```

2. 进入`NodePushToRTMPServer`文件夹下

   ```shell
   cd NodePushToRTMPServer
   ```

3. 安装依赖

   ```shell
   cnpm install
   ```

4. PM2 启动守护进程，并命名进程为`NodePush`

      ```shell
   - 启动服务 (正常部署时仅启动服务即可，下面的命令可作为维护使用)
   	pm2 start index.js --name NodePush
   	
   ## PM2 更多维护命令：
   - 查看服务状态
   	pm2 status NodePush
   - 查看服务日志
   	pm2 log NodePush
   - 重启服务
   	pm2 restart NodePush
   - 停止服务
   	pm2 stop NodePush
   - 停止并删除服务
   	pm2 delete NodePush
   ```



## Windows 环境部署流程🥁

### 安装

1. 运行环境需要具备 Node.js V8及以上版本 和 NPM V6及以上版本

   [下载地址](http://nodejs.cn/download/)

2. NPM使用cnpm淘宝镜像

   ```shell
   1. 安装cnpm
   npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```

3. 安装Node服务前台进程守护工具

   ```shell
   cnpm install nodemon -g
   ```

4. 安装git客户端

   [下载地址](https://git-scm.com/download/win)

5. 安装FFmpeg应用
   
      [下载地址](https://ffmpeg.zeranoe.com/builds/)
      
      ```shell
      - 去到ffmpeg官网 ，将安装包下载后解压
      - 将解压后的文件夹下的bin目录添加到系统环境变量Path中
      - 终端命令行中输入`ffmpeg -version `检测是否安装成功
      ```

### 运行
1. 将项目clone到本地中

   ```shell
   git clone https://gitee.com/JackyM06/NodePushToRTMPServer.git
   ```

2. 进入`NodePushToRTMPServer`文件夹下

   ```shell
   cd NodePushToRTMPServer
   ```

3. 安装依赖

   ```shell
   cnpm install
   ```
   
4. `Nodemon`前台运行

   ```shell
   nodemon index.js
   ```



## Ubuntu 环境部署流程🎈

1. 运行环境需要具备 Node.js V8及以上版本 和 NPM V6及以上版本

   ```shell
   1. 更新软件源
   	# Ubuntu 16.04 TLS，执行以下命令：
   	sudo apt-get update
   	sudo apt-get install -y python-software-properties software-properties-common
   	sudo add-apt-repository ppa:chris-lea/node.js
   	sudo apt-get update
   
   	# Ubuntu 18.04 TLS，执行以下命令：
   	sudo apt-get update
   	sudo apt-get install -y software-properties-common
   	sudo add-apt-repository ppa:chris-lea/node.js
   	sudo apt-get update
   
   2. 安装NodeJS和NPM
   	# Ubuntu 16.04 TLS，执行以下命令：
   	sudo apt-get install nodejs
   	sudo apt install nodejs-legacy
   	sudo apt install npm
   
   	# Ubuntu 18.04 TLS，执行以下命令：
   	sudo apt-get install nodejs
   	sudo apt install libssl1.0-dev nodejs-dev node-gyp npm
   
   3. 安装n管理器(用于管理nodejs版本）
   	sudo npm install n -g
   	# 安装最新的nodejs（stable版本）
   	sudo n stable
   	
   4. 验证安装
   	sudo node -v
   	sudo npm -v
   ```

2. NPM使用cnpm淘宝镜像

   ```shell
   1. 安装cnpm
   npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```

3. 安装Node服务进程管理工具

   ```shell
   cnpm install pm2 -g
   ```

4. 安装git

   ```shell
   yum -y install git
   ```

5. 安装FFmpeg应用

   ```shell
   - 依次执行一下命令以完成安装
   sudo add-apt-repository ppa:kirillshkrogalev/ffmpeg-next 
   sudo apt-get update 
   sudo apt-get install ffmpeg
   
   - 执行 ffmpeg -version 检测是否安装成功
   ```

### 运行

1. 将项目clone到本地中

   ```shell
   git clone https://gitee.com/JackyM06/NodePushToRTMPServer.git
   ```

2. 进入`NodePushToRTMPServer`文件夹下

   ```shell
   cd NodePushToRTMPServer
   ```

3. 安装依赖

   ```shell
   cnpm install
   ```

4. PM2 启动守护进程，并命名进程为`NodePush`

      ```shell
   - 启动服务 (正常部署时仅使用该命令启动服务即可)
   	pm2 start index.js --name NodePush
   	
   # PM2 其他更多日常维护命令：
   - 查看服务状态
   	pm2 status NodePush
   - 查看服务日志
   	pm2 log NodePush
   - 重启服务
   	pm2 restart NodePush
   - 停止服务
   	pm2 stop NodePush
   - 停止并删除服务
   	pm2 delete NodePush
   ```



## 通信接口说明 【便于二次开发】

| 服务端接受的接口                                 | 服务端响应接口                                               |
| ------------------------------------------------ | ------------------------------------------------------------ |
| 客户端与服务端连接后                             | socket.emit('connected') //websocket连接成功                 |
| socket.on("start", url） url:推流地址            | socket.emit('started') //ffmpeg指令发送成功 socket.emit('startError',message)ffmpeg出错 |
| socket.on("sendBlob", blob） blob:音视频blob对象 | socket.emit('sent') //blob对象推流成功                       |
| socket.on('end'）                                | socket.emit('ended') //推流结束成功                          |




## 前端部分DEMO

提供一个与该Node服务衔接的前端部分为你提供测试与参考[WebPushMedia]( https://gitee.com/JackyM06/WebPushMedia)

## 注意

- 本项目需要与前端页面建立websocket连接，由于本服务端中使用了socket.io。所以希望你在客户端中使用socket.io-client来进行开发。

## 鸣谢

该项目与另一位小伙伴协同开发，感谢在困境时提供的帮助。