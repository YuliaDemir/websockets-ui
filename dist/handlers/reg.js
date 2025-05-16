import { db } from '../db.js';
export function handleReg(ws, data, id) {
    const { name, password } = data;
    const exists = db.players.has(name);
    if (!exists) {
        db.players.set(name, { password, wins: 0 });
        db.connections.set(ws, name);
        ws.send(JSON.stringify({
            type: 'reg',
            data: { name, index: name, error: false, errorText: '' },
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
                data: { name, index: name, error: false, errorText: '' },
                id,
            }));
            updateWinners(ws);
        }
        else {
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({ name, index: name, error: true, errorText: 'Wrong Password!' }),
                id,
            }));
        }
        ;
    }
    ;
}
;
export function updateWinners(ws) {
    console.log('update winners');
    // const rooms = [...db.rooms.entries()];
    // const data = rooms.map(([ roomId, userName ]) => {
    //     return {
    //         roomId,
    //         roomUsers: [
    //             {
    //                 name: userName,
    //                 index: userName,
    //             }
    //         ],
    //     }
    // });
    // const jsonData = JSON.stringify(data);
    // const connections = [...db.connections.keys()];
    // connections.forEach(
    //     ws => ws.send(JSON.stringify({
    //         type: "update_room",
    //         data,
    //         id: 0,
    //     }))
    // );
}
