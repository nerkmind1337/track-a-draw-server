import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { ConnectedClient, LocationData } from "./interfaces";

const app = express();

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3001']
};

app.use(cors(corsOptions));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

const connectedClients: ConnectedClient[] = [];

io.on("connection", (socket) => {
  console.log('connected client', socket.id);
  // Add the new connection to the connectedClients list
  connectedClients.push({ playerId: socket.id, position: { x: 0, y: 0 } });

  // Emit the new connection data to all connected clients
  io.sockets.emit("newPlayerConnected", { newConnectionId: socket.id, connectionList: connectedClients });

  // Notify the newly connected client of the other connected clients
  socket.emit('previousConnectionData', { newConnectionId: socket.id, connectionList: connectedClients });

  // Handle receiving location updates from clients
  socket.on("broadcastMyLocation", (position: LocationData) => {
    // Find the client in the connectedClients array
    const client = connectedClients.find(client => client.playerId === socket.id);

    // Update the client's position if they exist
    if (client) {
      client.position = position;
    }
    //console.log(socket.id, ' has updated their position to ', position);
    // Broadcast the updated position to all clients
    io.sockets.emit("playerHasBroadCastedTheirLocation", { playerId: socket.id, ...position });
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    // Find the index of the disconnected client in the connectedClients list
    const index = connectedClients.findIndex(client => client.playerId === socket.id);

    // Remove the disconnected client from the list
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }

    // Notify other clients that a player has disconnected
    io.sockets.emit("playerDisconnected", { newConnectionId: socket.id, connectionList: connectedClients });
  });

});

httpServer.listen(3003, () => {
  console.log('HTTP server listening on port 3003');
});

io.listen(3002);
