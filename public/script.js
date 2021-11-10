var socket = io.connect();

document.getElementsByTagName("form")[0].onsubmit = function (e) {
    e.preventDefault();
}
var semo = document.getElementById("serialmonitor");
var data1 = document.getElementById("datainput1");
var data2 = document.getElementById("datainput2");
var data3 = document.getElementById("datainput3");
var dataoption = document.getElementById("dataoption");
var send = document.getElementById("send");
var send1 = document.getElementById("send1");
var send2 = document.getElementById("send2");
var clear = document.getElementById("clearmonit");
var listports = document.getElementById("listports");
var open = document.getElementById("open");
var close = document.getElementById("close");
var statport = document.getElementById("statport");
var type = 1;
var choport = "";

socket.on("listports", (data) => {
    listports.innerHTML = "";
    data.forEach(ea => {
        let newel = document.createElement("option");
        newel.innerText = ea;
        listports.appendChild(newel);
    });
    if (choport != "") {
        listports.value = choport;
    }
})

open.onclick = function (e) {
    socket.emit("openport", listports.value);
}

close.onclick = function (e) {
    socket.emit("closeport");
}
socket.on("portopened", (choosedport) => {
    statport.style.backgroundColor = "lime";
    listports.value = choosedport;
})

socket.on("portclosed", () => {
    statport.style.backgroundColor = "crimson";
})

socket.on("datain", (data) => {
    semo.value += data;
    semo.scrollTop = semo.scrollHeight;
})

send.onclick = function (e) {
    let buff;
    if (type == 1) {
        buff = new Uint8Array(new ArrayBuffer(4));
        buff[0] = Number(data1.value);
        buff[1] = Number(data2.value);
        buff[2] = Number(data3.value);
        buff[3] = "\x0D".charCodeAt(0);
    }
    if (type == 2) {
        buff = new Uint8Array(new ArrayBuffer(4));
        buff[0] = 255;
        buff[1] = Number(data1.value);
        buff[2] = Number(data2.value);
        buff[3] = Number(data3.value);
    }
    if (type == 3) {
        buff = "#" + data1.value + data2.value + data3.value;
    }
    if (type == 4) {
        buff = data1.value + "," + data2.value + "," + data3.value + "\x0D";
    }
    socket.emit("datasoal1-4", buff);
}

send1.onclick = function (e) {
    console.log("asd");
    socket.emit("datasoal5", "Data1?");
}
send2.onclick = function (e) {
    console.log("dsa");
    socket.emit("datasoal5", "Data2?");
}

clearmonit.onclick = function (e) {
    semo.value = "";
}

function checkOnchange(asd) {
    if (!isNaN(asd.value)) {
        if (type == 1) {
            if (asd == data1) {
                if (Number(data1.value) < 51) data1.value = "51";
                if (Number(data1.value) > 100) data1.value = "100";
            }
            if (asd == data2) {
                if (Number(data2.value) < 101) data2.value = "101";
                if (Number(data2.value) > 150) data2.value = "150";
            }
            if (asd == data3) {
                if (Number(data3.value) < 151) data3.value = "151";
                if (Number(data3.value) > 200) data3.value = "200";
            }
            asd.value = "" + Number(asd.value);
        }
        if (type == 2) {
            if (Number(asd.value) > 254) asd.value = "254";
            if (Number(asd.value) < 0) asd.value = "0";
            asd.value = "" + Number(asd.value);
        }
        if (type == 3) {
            if (Number(asd.value) > 999) asd.value = "999";
            if (Number(asd.value) < 0) asd.value = "000";
            if (asd.value.length == 2) asd.value = "0" + asd.value;
            if (asd.value.length == 1) asd.value = "00" + asd.value;
        }
        if (type == 4) {
            if (Number(asd.value) > 100) asd.value = "100";
            if (Number(asd.value) < 0) asd.value = "0";
            asd.value = "" + Number(asd.value);
        }
    } else {
        asd.value = "";
    }
}

data1.onkeyup = function (e) {
    if (data1.value.length > 3) {
        data1.value = data1.value.slice(data1.value.length - 3, data1.value.length);
    }
}
data1.onchange = function (e) {
    checkOnchange(data1);
}
data2.onkeyup = function (e) {
    if (data2.value.length > 3) {
        data2.value = data2.value.slice(data2.value.length - 3, data2.value.length);
    }
}
data2.onchange = function (e) {
    checkOnchange(data2);
}
data3.onkeyup = function (e) {
    if (data3.value.length > 3) {
        data3.value = data3.value.slice(data3.value.length - 3, data3.value.length);
    }
}
data3.onchange = function (e) {
    checkOnchange(data3);
}

dataoption.onchange = function (e) {
    if (dataoption.value != "Soal5") {
        for (let i = 0; i < 3; i++) {
            document.getElementsByTagName("input")[i].disabled = false;
        }
        send.parentElement.classList.remove("d-none");
        send1.parentElement.classList.add("d-none");
        send2.parentElement.classList.add("d-none");
    }
    switch (dataoption.value) {
        case "Soal1":
            type = 1;
            break;
        case "Soal2":
            type = 2;
            break;
        case "Soal3":
            type = 3;
            break;
        case "Soal4":
            type = 4;
            break;
        case "Soal5":
            type = 5;
            for (let i = 0; i < 3; i++) {
                document.getElementsByTagName("input")[i].disabled = true;
            }
            send.parentElement.classList.add("d-none");
            send1.parentElement.classList.remove("d-none");
            send2.parentElement.classList.remove("d-none");
            break;
    }
    data1.value = "";
    data2.value = "";
    data3.value = "";
}

listports.onchange = function (e) {
    choport = listports.value;
}