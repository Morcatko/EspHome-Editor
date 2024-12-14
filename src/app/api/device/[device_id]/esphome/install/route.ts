import { NextRequest } from "next/server";
import * as ws from "ws";
import * as http from "node:http";
import { getStreamResponse, streamToWs } from "../utils";
import type { TDeviceId, TParams } from "@/app/api/api-types";

export async function PUT(
    request: NextRequest,
    { params }: TParams<TDeviceId>) {

    const { device_id } = await params;
    return getStreamResponse(device_id, "run", { port: "OTA"});
}

export async function SOCKET(
    client: ws.WebSocket,
    request: http.IncomingMessage,
    server: ws.WebSocketServer
) {
    await streamToWs(request.url!, client, "run", { port: "OTA"});
}