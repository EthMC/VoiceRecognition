var socket = io();

console.log("TEST");

socket.emit("message", "test");
