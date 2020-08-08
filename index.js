const express = require("express")

const app = new express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(require("cors")())

require('./socketIo')(io)

server.listen(8090)