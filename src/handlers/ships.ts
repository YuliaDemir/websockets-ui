import { db } from '../db.js';
import { WebSocket } from 'ws';
import { generateId } from '../helpers/id.js';

enum TypeOfShip {
    "small" = 1,
    "medium",
    "large",
    "huge"
};

type Ship = {   
                    position: {
                        x: number,
                        y: number,
                    },
                    direction: boolean,
                    length: number,
                    type: "small"|"medium"|"large"|"huge",
                };

    //true - вертикаль
    //х у с нуля
    // попал = тогда true
export function addShips (ws: WebSocket, data: any, id: number) {
    console.log("addShips");
    const userName = db.connections.get(ws) || "";
    const { gameId, ships } = data;
    let shipsPositions: {x: number, y: number, length: number, direction: boolean, shoots: boolean[]}[];

    shipsPositions = ships.map((ship: Ship) => {
        const {position, direction, length} = ship;
        return {
            x: position.x, 
            y: position.y, 
            length, 
            direction, 
            shoots: Array(length).fill(false),
        };
    });

    const users = db.games.get(gameId) || [];
    const secondUser = users[0] === userName ? users [1] : users[0];
    const wsSecondUser = [...db.connections.entries()]
        .filter(([ws, userName]) => userName === secondUser)[0][0];

    db.myBoard2.set(userName, shipsPositions);

    if (db.myBoard2.has(secondUser!)) {
        startGame(ws, ships, userName);
        startGame(wsSecondUser, ships, secondUser!);
    };
};

export function startGame (ws: WebSocket, ships: any, currentPlayerIndex: string) {
    console.log("start game");
    const jsonData = JSON.stringify({
                ships,
                currentPlayerIndex
            });
    ws.send(JSON.stringify(
        {
            type: "start_game",
            data: jsonData,
            id: 0,
        }
    ));
};

