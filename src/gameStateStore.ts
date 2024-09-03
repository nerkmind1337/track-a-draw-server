import { GAME_OBJECT_TYPE, GAME_TREAT_TYPE, GameState, POOP_AFFLICTION } from "./interfaces";

export let gameState: GameState = {
    clientPlayer: {
        playerId: "",
        pug: {
            objectId: 0,
            position: { x: 0, y: 0 },
            objectType: GAME_OBJECT_TYPE.PUG,
            playerId: "",
            dir: 0,
            speed: 0
        },
        hand: {
            objectId: 0,
            position: { x: 0, y: 0 },
            objectType: GAME_OBJECT_TYPE.HAND,
            playerId: "",
        }
    },
    otherPlayers: [

    ],
    treats: [
        {
            treatDesirabilityValue: 0,
            treatType: GAME_TREAT_TYPE.CHICKEN,
            objectId: 0,
            position: {
                x: 0,
                y: 0
            },
            objectType: GAME_OBJECT_TYPE.TREAT
        },
    ],
    poop: [
        {
        affliction: POOP_AFFLICTION.POOMIES,
        objectId: 0,
        position: {
            x: 200,
            y: 286,
        },
        objectType: GAME_OBJECT_TYPE.POOP
    },
    {
        affliction: POOP_AFFLICTION.POOMIES,
        objectId: 0,
        position: {
            x: 300,
            y: 286,
        },
        objectType: GAME_OBJECT_TYPE.POOP
    }
]
};