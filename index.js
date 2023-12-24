import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

const port = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);

    if (msg.includes("e")) {
      console.log("YES IT HAS IT!");
      // send websocket thingy to explode!
    }
  });
});

server.listen(port, () => {
  console.log("App running on port " + port);
});
