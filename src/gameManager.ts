interface Player {
    id: string;
    username: string[];
}

class gameManager {
    private players: Map<string, Player> = new Map();
}

export default gameManager;
