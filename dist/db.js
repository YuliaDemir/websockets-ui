export const db = {
    players: new Map(), //userName
    rooms: new Map(), //roomID, user
    games: new Map(), //gameId, [userName1, userName2]
    connections: new Map(), //connection, userName
    myBoard: new Map(), //userName   
    myShoots: new Map(),
    winners: new Map(), //userName, countWins
};
