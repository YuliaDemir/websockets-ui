import { WebSocketServer } from "ws";
import { handleReg } from "./handlers/reg.js";
import { handleCreateRoom, addToTheRoom, getRooms } from "./handlers/room.js";
export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const { type, data, id } = JSON.parse(message.toString("utf8"));
                handleMessage(ws, type, data, id);
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
    switch (type) {
        case 'reg':
            {
                handleReg(ws, data, id);
                return getRooms(ws);
            }
            ;
        case 'create_room':
            {
                return handleCreateRoom(ws);
            }
            ;
        case 'add_user_to_room':
            {
                const { indexRoom: roomId } = data;
                return addToTheRoom(ws, roomId);
            }
            ;
        default: {
        }
    }
    ;
}
