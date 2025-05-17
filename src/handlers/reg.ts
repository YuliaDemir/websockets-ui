import { db } from '../db.js';
import { WebSocket } from 'ws';

export function handleReg(ws: WebSocket, data: any, id: number) {
    console.log('regestration');
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
        updateWinners(ws);
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
        updateWinners(ws);
        }
        else {
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({ name, index: name, error: true, errorText: 'Wrong Password!'}),
                id,
            }));
        };
    };
};

export function updateWinners(ws: WebSocket) {
    console.log('update winners')
    const winners = [...db.winners.entries()];
    const data = winners.map(([ userName, countWins ]) => {
        return {
                    name: userName,
                    wins: countWins,
        };
    });

    const jsonData = JSON.stringify(data);
    const connections = [...db.connections.keys()];

    connections.forEach(
        ws => ws.send(JSON.stringify({
            type: "update_winners",
            data: jsonData,
            id: 0,
        }))
    );
};
