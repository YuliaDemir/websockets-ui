import { WebSocket } from "ws";

export const db = {
    players: new Map<string, { password: string, wins: number}>(),              //userName
    rooms: new Map<number, string>(),          //roomID, user
    games: new Map<number, any>(),                                              //gameId, connection
    connections: new Map<WebSocket, string>(),                                  //connection, userName
};
