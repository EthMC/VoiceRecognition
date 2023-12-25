import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

const port = 5986;
const WSport = 8954;

let started = false;

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    if (msg === "explode") {
      if (started) {
        sending("function explosion");
      }
    }
  });
});

server.listen(port, () => {
  console.log(
    "Join a Minecraft World & type /connect localhost:" + WSport + ""
  );
  console.log("Then open http://localhost:" + port + " in a browser & start");
});

//MINECRAFT WEBSOCKET
const wss = new WebSocketServer({
  port: WSport,
});

wss.on("connection", function connection(socket) {
  console.log("WebSocket Connected W/ MINECRAFT!");
  started = true;

  socket.on("message", (packet) => {
    const msg = JSON.parse(packet);
    if (msg.body.message === "!test") {
      sending("function explosion");
    }
  });

  socket.on("close", function close() {
    // When a client disconnects, disable mc websocket commands.
    started = false;
  });

  socket.send(
    JSON.stringify({
      header: {
        version: 1, // Use version 1 message protocol
        requestId: uuidv4(), // A unique ID for the request
        messageType: "commandRequest", // This is a request ...
        messagePurpose: "subscribe", // ... to subscribe to ...
      },
      body: {
        eventName: "PlayerMessage", // ... all player messages.
      },
    })
  );
});

function sending(cmd) {
  // console.log("attempting to send cmd");
  wss.clients.forEach((client) => {
    const msg = JSON.stringify({
      header: {
        version: 1,
        requestId: uuidv4(), // Send unique ID each time
        messagePurpose: "commandRequest",
        messageType: "commandRequest",
      },
      body: {
        version: 1,
        commandLine: cmd, // Define the command
        origin: {
          type: "player", // Message comes from player
        },
      },
    });
    client.send(msg);
  });
}
