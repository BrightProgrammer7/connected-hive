const express = require("express");
const {SerialPort} = require("serialport");
const {Server} = require("socket.io");
const io = require("socket.io-client");

const app = express();
const SERVER_PORT = 4000;

// List available serial ports
SerialPort.list().then(ports => {
  ports.forEach(port => {
    console.log(port.path);
  });
});

// const path = "/dev/tty.usbmodem";
// const arduinoPort = new SerialPort({
//   path: path,
//   baudRate: 9600,
// });

const server = app.listen(SERVER_PORT, () =>
  console.log(`Listening for requests on port ${SERVER_PORT}.`)
);

const reactSocket = new Server(server, { cors: { origin: "*" } });

reactSocket.on("connection", (clientSocket) => {
  console.log(`React Client connected: ${clientSocket.id}`);

  clientSocket.on("sentData", (message) => {
    arduinoPort.write(`${message}\n`);
  });

  clientSocket.on("disconnect", () => {
    console.log(`React Client disconnected: ${clientSocket.id}`);
  });
});

// arduinoPort.on("open", () => {
//   console.log("Serial Port " + arduinoPort.path + " is opened.");

//   arduinoPort.on("data", (data) => {
//     console.log(`Arduino Data: ${data}`);
//     reactSocket.emit("data", `${data}`);
//   });

//   arduinoPort.on("close", () => {
//     console.log("Serial Port " + arduinoPort.path + " is closed.");
//   });
// });


const socket = io("http://192.168.0.168");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("data", (data) => {
  console.log("Received data from Arduino:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

