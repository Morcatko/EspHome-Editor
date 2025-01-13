import * as ws from "ws";
import * as http from "node:http";
import { streamToWs } from "../utils";
import { TDeviceId, TParams } from "@/app/api/api-types";

export function GET() {}

export async function SOCKET(
    client: ws.WebSocket,
    request: http.IncomingMessage,
    server: ws.WebSocketServer,
    params: TParams<TDeviceId>
) {
    console.log(await params);
    await streamToWs(params, client, "compile");
}