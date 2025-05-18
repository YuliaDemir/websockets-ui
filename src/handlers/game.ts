import { WebSocket } from 'ws';
import { db } from '../db.js';

export function attack (ws: WebSocket, data: any) {
    console.log("attack");
    const { gameId, x, y, indexPlayer } = data;

    const users = db.games.get(gameId);
    const myEnemy = users![0] === indexPlayer ? users![1] : users![0];
    const enemyBoard = db.myBoard2.get(myEnemy);
    const status = getStatus( enemyBoard!, x, y, ws);

    sendShoot(x, y, indexPlayer, status, ws);
};

//true - вертикаль
    //х у с нуля
    // попал = тогда true
function getStatus(enemyBoard: {x: number, y: number, length: number, direction: boolean, shoots: boolean[]}[], x: number, y: number, ws:WebSocket) : ("miss" | "killed" |"shot") {
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
                    killedFrame(ship, ws);
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
                    console.log("killed");
                    killedFrame(ship, ws);
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

function killedFrame(ship: {x: number, y: number, length: number, direction: boolean, shoots: boolean[]}, ws:WebSocket) {
    const currentPlayer = db.connections.get(ws);
    if (ship.direction) {
        if (ship.x > 0) {
            for (let i = -1; i <= ship.length; i++) {
                if (ship.y + i >= 0 && ship.y + i <= 9) {
                    sendShoot(ship.x - 1, ship.y + i, currentPlayer, "miss", ws);
                }
            };
        };
        if (ship.x < 9) {
            for (let i = -1; i <= ship.length; i++) {
                if (ship.y + i >= 0 && ship.y + i <= 9) {
                    sendShoot(ship.x + 1, ship.y + i, currentPlayer, "miss", ws);
                };
            };
        };
        if (ship.y > 0) {
            sendShoot(ship.x, ship.y - 1, currentPlayer, "miss", ws);
        };
        if (ship.y < 9) {
            sendShoot(ship.x, ship.y + ship.length, currentPlayer, "miss", ws);
        };
    }
    else {
        if (ship.y > 0) {
            for (let i = -1; i <= ship.length; i++) {
                if (ship.x + i >= 0 && ship.x + i <= 9) {
                    sendShoot(ship.x + i, ship.y - 1, currentPlayer, "miss", ws);
                }
            };
        };
        if (ship.y < 9) {
            for (let i = -1; i <= ship.length; i++) {
                if (ship.x + i >= 0 && ship.x + i <= 9) {
                    sendShoot(ship.x + i, ship.y + 1, currentPlayer, "miss", ws);
                }
            };
        };
        if (ship.x > 0) {
            sendShoot(ship.x - 1, ship.y, currentPlayer, "miss", ws);
        };
        if (ship.x < 9) {
            sendShoot(ship.x + ship.length, ship.y, currentPlayer, "miss", ws);
        };
    }
    
};

function sendShoot (x: number, y: number, currentPlayer: string | undefined, status: "miss" | "killed" | "shot", ws: WebSocket) {
   const responseData = {
        position:
            {
                x,
                y,
            },
        currentPlayer,
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
}