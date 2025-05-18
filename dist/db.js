export const db = {
    players: new Map(), //userName
    rooms: new Map(), //roomID, user
    games: new Map(), //gameId, [userName1, userName2]
    connections: new Map(), //connection, userName
    //myBoard: new Map<string, (1|0|-1|null)[][]>(),                              //userName  
    myBoard2: new Map(),
    winners: new Map(), //userName, countWins
};
