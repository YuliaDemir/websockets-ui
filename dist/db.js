export const db = {
    players: new Map(), //userName
    rooms: new Map(), //roomID, user
    games: new Map(), //gameId, connection
    connections: new Map(), //connection, userName
};
