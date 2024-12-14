import * as ws from "ws";
import * as http from "node:http";
import { streamToWs } from "../utils";

export function GET() {}

export async function SOCKET(
    client: ws.WebSocket,
    request: http.IncomingMessage,
    server: ws.WebSocketServer
) {
    await streamToWs(request.url!, client, "compile");
}