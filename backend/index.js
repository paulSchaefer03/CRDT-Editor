// server.js – CRDT WebSocket Server mit Express
const express = require("express");
const { Server } = require("@hocuspocus/server");
const port = 3001;


const hocuspocusServer = Server.configure({
  port: port,
  name: "CRDT-Übergabelisten",
  onConnect: (data) => {
    console.log("Client connected:", data.connection.id);
  },
  onDisconnect: (data) => {
    console.log("Client disconnected:", data.connection.id);
  },
});

// Start the Hocuspocus server
hocuspocusServer.listen();
const path = require('path');
const app = express();

// Editor-Frontend ausliefern
app.use(express.static(path.resolve(__dirname, '../client/build')));
