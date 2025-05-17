import { db } from '../db.js';
import { WebSocket } from 'ws';
import { generateId } from '../helpers/id.js';

enum TypeOfShip {
    "small" = 1,
    "medium",
    "large",
    "huge"
};

type Ships = {                                              
        userId: string,                         
        ships: {
                    position: {
                        x: number,
                        y: number,
                    },
                    direction: boolean,
                    length: number,
                    type: "small"|"medium"|"large"|"huge",
                }[],
    };

    //true - вертикаль
    //х у с нуля
export function addShips (ws: WebSocket, data: any, id: number) {
    console.log("addShips");
    const userName = db.connections.get(ws) || "";
    const { gameId, ships } = data;

    let shipsPositions: (1|0)[][] = Array.from({length: 10}, () => Array(10).fill(0));

    ships.forEach(({ position: {x, y}, direction, length}: { position: {x : number, y: number}, direction: boolean, length: number}) => {
        if (direction) {
            for (let i = 0; i < length; i++) {
                shipsPositions[x][y + i] = 1;
            };
        }
        else {
            for (let i = 0; i < length; i++) {
                shipsPositions[x + i][y] = 1;
            };
        };
    });

    const users = db.games.get(gameId) || [];
    const secondUser = users[0] === userName ? users [1] : users[0];
    db.myBoard.set(userName, shipsPositions);
    if (db.myBoard.has(secondUser!)) {
        startGame();
    };
};

export function startGame () {
    console.log("stsart the game");
}
