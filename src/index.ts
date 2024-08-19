import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import LobbyManager from "./lobbyManager"; // Import the lobby manager

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

// Create an instance of the LobbyManager
const lobbyManager = new LobbyManager();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on('test', ()=>{
    console.log('test event')
  })

  // Handle player joining a lobby
  socket.on('joinLobby', (lobbyId: string) => {
    const lobby = lobbyManager.getLobby(lobbyId);
    if (!lobby) {
      lobbyManager.createLobby(lobbyId); // Create a new lobby if it doesn't exist
    }

    const success = lobbyManager.joinLobby(lobbyId, socket.id);
    if (success) {
      socket.join(lobbyId);
      io.to(lobbyId).emit('playerJoined', socket.id);
      console.log(`Player ${socket.id} joined lobby ${lobbyId}`);
    } else {
      socket.emit('error', `Lobby ${lobbyId} is full or does not exist`);
    }
  });

  socket.on('createLobby', (lobbyId: string) => {
    const lobby = lobbyManager.getLobby(lobbyId);
    if (!lobby) {
      lobbyManager.createLobby(lobbyId); // Create a new lobby if it doesn't exist
    }

    const success = lobbyManager.joinLobby(lobbyId, socket.id);
    if (success) {
      socket.join(lobbyId);
      io.to(lobbyId).emit('playerJoined', socket.id);
      console.log(`Player ${socket.id} joined lobby ${lobbyId}`);
    } else {
      socket.emit('error', `Lobby ${lobbyId} is full or does not exist`);
    }
  });

  // Handle player leaving a lobby
  socket.on('leaveLobby', (lobbyId: string) => {
    const success = lobbyManager.leaveLobby(lobbyId, socket.id);
    if (success) {
      socket.leave(lobbyId);
      io.to(lobbyId).emit('playerLeft', socket.id);
      console.log(`Player ${socket.id} left lobby ${lobbyId}`);
    } else {
      socket.emit('error', `Lobby ${lobbyId} does not exist or you are not part of it`);
    }
  });

  // Handle starting the game in a lobby
  socket.on('startGame', (lobbyId: string) => {
    const lobby = lobbyManager.getLobby(lobbyId);
    if (lobby) {
      io.to(lobbyId).emit('gameStarted', lobby.players);
      console.log(`Game started in lobby ${lobbyId} with players: ${lobby.players}`);
    } else {
      socket.emit('error', `Lobby ${lobbyId} does not exist`);
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Ensure player is removed from any lobby they were in
    lobbyManager.getLobbies().forEach(lobby => {
      lobbyManager.leaveLobby(lobby.id, socket.id);
      socket.leave(lobby.id);
    });
  });
});


app.get('/lobbies', (req, res) => {
  const lobbies = lobbyManager.getLobbies().map(lobby => ({
    id: lobby.id,
    players: lobby.players.length
  }));
  res.json(lobbies);
});

httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});

io.listen(3002);
