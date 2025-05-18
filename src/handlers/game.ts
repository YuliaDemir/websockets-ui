import { WebSocket } from 'ws';

import { db } from '../db.js';

export function attack (ws: WebSocket, data: any) {
    console.log("attack");
    const { gameId, x, y, indexPlayer } = data;

    const users = db.games.get(gameId);
    const myEnemy = users![0] === indexPlayer ? users![1] : users![0];
    const enemyBoard = db.myBoard2.get(myEnemy);
    const status = getStatus( enemyBoard!, x, y );

    const responseData = {
        position:
            {
                x,
                y,
            },
        currentPlayer: indexPlayer,
        status,
    };
    
    const jsonData = JSON.stringify(responseData);
    
    ws.send(JSON.stringify(
        {
            type: "attack",
            data: jsonData,
            id: 0,
        }
    ));
};

//true - вертикаль
    //х у с нуля
    // попал = тогда true
function getStatus(enemyBoard: {x: number, y: number, length: number, direction: boolean, shoots: boolean[]}[], x: number, y: number) : ("miss" | "killed" |"shot") {
    for (let ship of enemyBoard) {
        if (ship.direction) {
            if (ship.x === x && ship.y + ship.length > y && ship.y <= y) {
                console.log("---------------------- вертикальный --------------------------------");
                console.log(ship.x, ship.y, ship.length);
                console.log(x, y);
                ship.shoots[y - ship.y] = true;
                console.log("вошли 1")
                const killed = ship.shoots.reduce((acc, cur) => acc && cur, true);
                if (killed) {
                    console.log("killed")
                    return "killed";
                }
                else {
                    console.log("shot")
                    return "shot";
                };
            }
        }
        else  {
            if (ship.y === y && ship.x + ship.length > x && ship.x <= x) {
                console.log("---------------------- горизонтальный --------------------------------");
                console.log(ship.x, ship.y, ship.length);
                 console.log(x, y);
                ship.shoots[x - ship.x] = true;
                const killed = ship.shoots.reduce((acc, cur) => acc && cur, true);
                if (killed) {
                    console.log("killed")
                    return "killed";
                }
                else {
                    console.log("shot")
                    return "shot";
                }
            }
        }
    };
    return "miss";    
};
