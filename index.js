import { httpServer } from "./src/http_server/index.js";
import { startWebSocketServer } from "./dist/websocket.js";

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
    startWebSocketServer(httpServer);
    console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
