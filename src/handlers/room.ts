import { db } from '../db.js';
import { WebSocket } from 'ws';
import { generateId } from '../helpers/id.js';
import { createNewGame } from './game.js';

export function handleCreateRoom (ws: WebSocket) {
    if (db.connections.has(ws)) {
        const roomId = generateId('room');
        const userName =  db.connections.get(ws) || '' ;
        
        db.rooms.set(roomId, userName);
        ws.send(JSON.stringify(`The room was generated with number ${roomId}`));
    }
};

export function addToTheRoom (ws: WebSocket, roomId: number) {
    if (db.connections.has(ws)) {
        const currentUserName =  db.connections.get(ws) || '' ;
        const waitingUserName = db.rooms.get(roomId) || '';
        
        db.rooms.delete(roomId);
        createNewGame(currentUserName, waitingUserName);
    }
};

export function getRooms (ws: WebSocket) {
    const rooms = [...db.rooms.entries()];
    const data = rooms.map(([ roomId, userName ]) => {
        return {
            roomId,
            roomUsers: [
                {
                    name: userName,
                    index: userName,
                }
            ],
        }
    });
    ws.send(JSON.stringify({
        type: "update_room",
        data,
        id: 0,
    }));
};
