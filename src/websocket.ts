import { WebSocketServer, WebSocket } from "ws";
import { Server as HTTPServer} from "http";

import { handleReg } from "./handlers/reg.js";
import { handleCreateRoom, addToTheRoom, getRooms } from "./handlers/room.js";
import { addShips } from "./handlers/ships.js";

export function startWebSocketServer(server: HTTPServer) {
    const wss = new WebSocketServer({ server }); 

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const { type, data, id } = JSON.parse(message.toString("utf8"));
                handleMessage(ws, type, data, id);
            }
            catch (err) {
                console.error('Invalid message:', message);
            };
        });

        ws.on('close', () => {
            console.log('Disconnected!');
            // ДОПИСАТЬ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        });
    });
};

function handleMessage(ws: WebSocket, type: string, data: any, id: number) {
    switch (type) {
        case 'reg': {
            handleReg(ws, data, id);
            return getRooms(ws);
        };
        case 'create_room': {
            return handleCreateRoom(ws);
        };
        case 'add_user_to_room': {
            const { indexRoom: roomId } = data;
            return addToTheRoom(ws, roomId);
        };
        case 'add_ships': {
            return addShips(ws, data, id);
        };
        default: {

        }
    };
}
