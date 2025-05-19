import { db } from '../db.js';
import { turn } from './game.js';
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
// попал = тогда true
export function addShips(ws, data, id) {
    console.log("addShips");
    const userName = db.connections.get(ws);
    const { gameId, ships } = data;
    let shipsPositions;
    shipsPositions = ships.map((ship) => {
        const { position, direction, length } = ship;
        return {
            x: position.x,
            y: position.y,
            length,
            direction,
            shoots: Array(length).fill(false),
        };
    });
    const users = db.games.get(gameId);
    const secondUser = users[0] === userName ? users[1] : users[0];
    const wsSecondUser = [...db.connections.entries()]
        .filter(([ws, userName]) => userName === secondUser)[0][0];
    db.myBoard2.set(userName, shipsPositions);
    if (db.myBoard2.has(secondUser)) {
        startGame(ws, ships, userName);
        startGame(wsSecondUser, ships, secondUser);
        turn(userName, ws, wsSecondUser);
    }
    ;
}
;
export function startGame(ws, ships, currentPlayerIndex) {
    console.log("start game");
    const jsonData = JSON.stringify({
        ships,
        currentPlayerIndex
    });
    ws.send(JSON.stringify({
        type: "start_game",
        data: jsonData,
        id: 0,
    }));
}
;
