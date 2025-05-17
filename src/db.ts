import { WebSocket } from "ws";

export const db = {
    players: new Map<string, { password: string, wins: number}>(),              //userName
    rooms: new Map<number, string>(),          //roomID, user
    games: new Map<number, [string, string]>(),                                 //gameId, [userName1, userName2]
    connections: new Map<WebSocket, string>(),                                  //connection, userName
    myBoard: new Map<string, (1|0)[][]>(),                                                //userName   
    myShoots: new Map<string, (1|0)[][]>(), 
    winners: new Map<string, number>(),                                         //userName, countWins
};
