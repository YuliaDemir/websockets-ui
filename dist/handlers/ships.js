import { db } from '../db.js';
var TypeOfShip;
(function (TypeOfShip) {
    TypeOfShip[TypeOfShip["small"] = 1] = "small";
    TypeOfShip[TypeOfShip["medium"] = 2] = "medium";
    TypeOfShip[TypeOfShip["large"] = 3] = "large";
    TypeOfShip[TypeOfShip["huge"] = 4] = "huge";
})(TypeOfShip || (TypeOfShip = {}));
;
//true - вертикаль
//х у с нуля
export function addShips(ws, data, id) {
    console.log("addShips");
    const userName = db.connections.get(ws) || "";
    const { gameId, ships } = data;
    let shipsPositions = Array.from({ length: 10 }, () => Array(10).fill(0));
    ships.forEach(({ position: { x, y }, direction, length }) => {
        if (direction) {
            for (let i = 0; i < length; i++) {
                shipsPositions[x][y + i] = 1;
            }
            ;
        }
        else {
            for (let i = 0; i < length; i++) {
                shipsPositions[x + i][y] = 1;
            }
            ;
        }
        ;
    });
    const users = db.games.get(gameId) || [];
    const secondUser = users[0] === userName ? users[1] : users[0];
    const wsSecondUser = [...db.connections.entries()]
        .filter(([ws, userName]) => userName === secondUser)[0][0];
    db.myBoard.set(userName, shipsPositions);
    if (db.myBoard.has(secondUser)) {
        startGame(ws, ships, userName);
        startGame(wsSecondUser, ships, secondUser);
    }
    ;
}
;
export function startGame(ws, ships, currentPlayerIndex) {
    console.log("start game");
    ws.send(JSON.stringify({
        type: "start_game",
        data: {
            ships,
            currentPlayerIndex
        },
        id: 0,
    }));
}
;
