import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { gameState } from "./gameStateStore";
import { IMovePlayerPugPosition } from "./action-types/pug";
import { GAME_OBJECT_TYPE } from "./interfaces";
const app = express();

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3006']
};

app.use(cors(corsOptions));

const httpServer = createServer(app);


app.get('/getInitialGameState', (req, res) => {
  console.log('fetch game state called');
  res.json(gameState);
});



const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});




io.on("connection", (socket) => {
 socket.on("clientBroadcastPugLocation", (actionData: IMovePlayerPugPosition)=>{
  //probs do some checks here to make sure that the action is ok and the player is not cheating

  io.sockets.emit("confirmedUpdateToGameState", gameState)
 })

});

httpServer.listen(3003, () => {
  console.log('HTTP server listening on port 3003');
});

io.listen(3002);
