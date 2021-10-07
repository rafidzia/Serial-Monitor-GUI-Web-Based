const express = require('express')
const opener = require("opener")
const SerialPort = require('serialport')
const { EventEmitter } = require('events')
const ee = new EventEmitter();
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

var port;
var listports = [];
var listingdone = false;
var choosedport = "";
var listingport = () => {
    listingdone = false
    listports = [];
    SerialPort.list().then((ports, err) => {
        if (err) console.error(err);
        ports.forEach((ea) => {
            listports.push(ea.path);
        })
        listingdone = true;

    })
}
listingport();
setInterval(async () => {
    listingport();
}, 1000)

var sendportslist = (socket) => {
    if (listingdone) {
        socket.emit("listports", listports)
        setInterval(async () => {
            socket.emit("listports", listports)
        }, 1000)
    } else {
        sendportslist(socket);
    }
}

var startportconn = (portpath, socket) => {
    choosedport = portpath;
    port = new SerialPort(portpath, {
        baudRate: 9600
    })
    port.on("open", () => {
        console.log('port opened')
        socket.emit("portopened", choosedport)
        ee.on("datasoal1-4", (data) => {
            port.write(data)
        })
        ee.on("datasoal5", (data) => {
            port.write(data);
        })
    })
    port.on('data', (data) => {
        io.emit("datain", data.toString())
    })
    port.on('error', (err) => {
        console.log('Error: ', err.message)
    })
    port.on("close", () => {
        socket.emit("portclosed")
    })
}

io.on('connection', function (socket) {
    sendportslist(socket)
    if (port) {
        if (port.isOpen) {
            socket.emit("portopened", choosedport);
        }
    }
    socket.on("openport", (data) => {
        startportconn(data, socket)
    })
    socket.on("closeport", (data) => {
        if (port) {
            if (port.isOpen) {
                port.close((err) => {
                    if (err) console.error(err)
                    console.log('port closed')
                    socket.emit("portclosed")
                });
                ee.removeAllListeners("datasoal1-4")
                ee.removeAllListeners("datasoal5")
            }
        }
    })
    socket.on("datasoal1-4", (data) => {
        ee.emit("datasoal1-4", data);
    })
    socket.on("datasoal5", (data) => {
        ee.emit("datasoal5", data);
    })
})


opener("http://localhost:8001")
console.log("opening your browser")

server.listen(process.env.PORT || 8001);