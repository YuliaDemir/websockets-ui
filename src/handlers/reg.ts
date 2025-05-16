import { db } from '../db.js';
import { WebSocket } from 'ws';

export function handleReg(ws: WebSocket, data: any, id: number) {
    const { name, password } = data;
    const exists = db.players.has(name);
    if (!exists) {
        db.players.set(name, { password, wins: 0});
        db.connections.set(ws, name);
        ws.send(JSON.stringify({
            type: 'reg',
            data: JSON.stringify({ name, index: name, error: false, errorText: ''}),
            id,
        }));
    }
    else {
        const player = db.players.get(name);
        if (player?.password === password) {
            db.connections.set(ws, name);
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({ name, index: name, error: false, errorText: ''}),
                id,
            }));
        }
        else {
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({ name, index: name, error: true, errorText: 'Wrong Password!'}),
                id,
            }));
        };
    };
}