import { WebSocketServer } from "ws";
import { handleReg } from "./handlers/reg.js";
import { createRoom, addToTheRoom, getRooms } from "./handlers/room.js";
import { addShips } from "./handlers/ships.js";
export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            console.log(typeof message);
            console.log(message);
            try {
                const { type, data, id } = JSON.parse(message.toString("utf8"));
                const handledData = data ? JSON.parse(data) : data;
                handleMessage(ws, type, handledData, id);
            }
            catch (err) {
                console.error('Invalid message:', message);
            }
            ;
        });
        ws.on('close', () => {
            console.log('Disconnected!');
            // ДОПИСАТЬ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        default: {
        }
    }
    ;
}
