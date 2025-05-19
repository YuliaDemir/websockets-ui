import { db } from '../db.js';
import { generateId } from '../helpers/id.js';
export function createRoom(ws) {
    console.log("create room");
    if (db.connections.has(ws)) {
        const roomId = generateId('room');
        const userName = db.connections.get(ws) || '';
        db.rooms.set(roomId, userName);
        getRooms(ws);
    }
}
;
export function addToTheRoom(ws, roomId) {
    console.log("add to the room");
    if (db.connections.has(ws)) {
        const currentUserName = db.connections.get(ws) || '';
        const waitingUserName = db.rooms.get(roomId) || '';
        db.rooms.delete(roomId);
        getRooms(ws);
        createNewGame(currentUserName, waitingUserName);
    }
}
;
export function getRooms(ws) {
    console.log("update room = get rooms");
    const rooms = [...db.rooms.entries()];
    const data = rooms.map(([roomId, userName]) => {
        return {
            roomId,
            roomUsers: [
                {
                    name: userName,
                    index: userName,
                }
            ],
        };
    });
    const jsonData = JSON.stringify(data);
    const connections = [...db.connections.keys()];
    connections.forEach(ws => ws.send(JSON.stringify({
        type: "update_room",
        data: jsonData,
        id: 0,
    })));
}
;
export function createNewGame(user1, user2) {
    console.log("create new game");
    const idGame = generateId('game');
    db.games.set(idGame, [user1, user2]);
    const connections = [...db.connections.entries()].filter(([ws, userId]) => userId === user1 || userId === user2);
    connections.forEach(([ws, userId]) => {
        ws.send(JSON.stringify({
            type: "create_game",
            data: JSON.stringify({
                idGame,
                idPlayer: userId,
            }),
            id: 0,
        }));
    });
}
;
/*
export function single_play (ws: WebSocket) {
    console.log("create new game");
    const idGame = generateId('game');
    const user = db.connections.get(ws)!;
    db.games.set(idGame, [user, user]);

    ws.send(JSON.stringify(
        {
            type: "create_game",
            data: JSON.stringify(
                {
                    idGame,
                    idPlayer: user,
                }
            ),
            id: 0,
        }
    ));
}*/
