import { WebSocketServer } from "ws";
import { handleReg, updateWinners } from "./handlers/reg.js";
import { createRoom, addToTheRoom, getRooms } from "./handlers/room.js";
import { addShips } from "./handlers/ships.js";
import { attack, sendWin, userTurn } from "./handlers/game.js";
//import { single_play } from "./handlers/room.js"
import { db } from "./db.js";
export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const { type, data, id } = JSON.parse(message.toString("utf8"));
                const handledData = data ? JSON.parse(data) : data;
                handleMessage(ws, type, handledData, id);
            }
            catch (err) {
                console.error('Invalid message:', err);
            }
            ;
        });
        ws.on('close', () => {
            const user = db.connections.get(ws);
            const rooms = [...db.rooms].filter(([roomId, userName]) => userName === user);
            const game = [...db.games].filter(([gameId, userName]) => userName[0] === user || userName[1] === user)?.[0];
            const gameId = game?.[0];
            const enemyName = game?.[1]?.[0] === user ? game?.[1]?.[1] : game?.[1]?.[0];
            const enemyWs = [...db.connections].filter(([con, us]) => us === enemyName)?.[0]?.[0];
            console.log(`${user} disconnected!`);
            sendWin(enemyName, ws, enemyWs);
            updateWinners(enemyWs, true);
            db.connections.delete(ws);
            rooms.forEach((room) => db.rooms.delete(room?.[0]));
            db.myBoard2.delete(user);
            db.myBoard2.delete(enemyName);
            db.games.delete(gameId);
        });
    });
}
;
function handleMessage(ws, type, data, id) {
    console.log("---------- handler -----------------");
    switch (type) {
        case 'reg':
            {
                handleReg(ws, data, id);
                return getRooms(ws);
            }
            ;
        case 'create_room':
            {
                return createRoom(ws);
            }
            ;
        case 'add_user_to_room':
            {
                const { indexRoom: roomId } = data;
                return addToTheRoom(ws, roomId);
            }
            ;
        case 'add_ships':
            {
                return addShips(ws, data, id);
            }
            ;
        case 'attack':
            {
                if (userTurn === db.connections.get(ws)) {
                    return attack(ws, data);
                }
            }
            ;
        case 'randomAttack':
            {
                if (userTurn === db.connections.get(ws)) {
                    return attack(ws, data);
                }
            }
            ;
        case 'single_play':
            {
                return; //single_play(ws);
            }
            ;
    }
    ;
}
;
