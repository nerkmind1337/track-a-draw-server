interface Lobby {
    id: string;
    players: string[];
}

class LobbyManager {
    private lobbies: Map<string, Lobby> = new Map();

    createLobby(lobbyId: string): Lobby {
        const lobby: Lobby = { id: lobbyId, players: [] };
        this.lobbies.set(lobbyId, lobby);
        console.log('lobby created');
        return lobby;
    }

    joinLobby(lobbyId: string, playerId: string): boolean {
        const lobby = this.lobbies.get(lobbyId);
        if (lobby) {
            if (lobby.players.length < 2) {  // Enforce 2-player limit
                lobby.players.push(playerId);
                return true;
            } else {
                return false; // Lobby is full
            }
        }
        return false;
    }

    leaveLobby(lobbyId: string, playerId: string): boolean {
        const lobby = this.lobbies.get(lobbyId);
        if (lobby) {
            lobby.players = lobby.players.filter(p => p !== playerId);
            if (lobby.players.length === 0) {
                this.lobbies.delete(lobbyId); // Delete the lobby if it's empty
            }
            return true;
        }
        return false;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        return this.lobbies.get(lobbyId);
    }

    getLobbies(): Lobby[] {
        return Array.from(this.lobbies.values());
    }
}

export default LobbyManager;
