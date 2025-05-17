import { db } from '../db.js';
import { WebSocket } from 'ws';
import { generateId } from '../helpers/id.js';

export function handleCreateRoom (ws: WebSocket) {
    if (db.connections.has(ws)) {
        const roomId = generateId('room');
        const userName =  db.connections.get(ws) || '' ;
        
        db.rooms.set(roomId, userName);
        getRooms(ws);
    }
};

export function addToTheRoom (ws: WebSocket, roomId: number) {
    if (db.connections.has(ws)) {

        const currentUserName =  db.connections.get(ws) || '' ;
        const waitingUserName = db.rooms.get(roomId) || '';
        
        db.rooms.delete(roomId);
        getRooms(ws);
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

    const jsonData = JSON.stringify(data);
    const connections = [...db.connections.keys()];

    connections.forEach(
        ws => ws.send(JSON.stringify({
            type: "update_room",
            data,
            id: 0,
        }))
    );
};

export function createNewGame (user1: string, user2: string) {
    const idGame = generateId('game');
    db.games.set(idGame, [user1, user2]);

    const connections = [...db.connections.entries()].filter(([ws, userId]) => userId === user1 || userId === user2);
    connections.forEach(([ws, userId]) => {
        ws.send(JSON.stringify(
            {
                type: "create_game",
                data:
                    {
                        idGame,  
                        idPlayer: userId,
                    },
                id: 0,
            }
        ))
    });
};
