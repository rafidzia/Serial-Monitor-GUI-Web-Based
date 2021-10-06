const express = require('express')

const SerialPort = require('serialport')
const { EventEmitter } = require('events')
const ee = new EventEmitter();
const port = new SerialPort('COM4', {
    baudRate: 9600
})
const app = express()
const server = require("http").Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
app.use(express.static('public'))
console.log('Socket-io server running on 8001.');


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

io.on('connection', function (socket) {
    socket.on("datasoal1-4", (data) => {
        ee.emit("datasoal1-4", data);
    })
    socket.on("datasoal5", (data) => {
        ee.emit("datasoal5", data);
    })
})

port.on("open", () => {
    console.log("asd")
    ee.on("datasoal1-4", (data) => {
        port.write(data)
    })
    ee.on("datasoal5", (data) => {
        port.write(data);
    })
})
port.on('data', function (data) {
    io.emit("datain", data.toString())
})

server.listen(process.env.PORT || 8001);