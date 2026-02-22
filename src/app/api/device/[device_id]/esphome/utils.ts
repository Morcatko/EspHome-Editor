import * as ws from "ws";
import { type TStreamEvents } from "@/server/devices/esphome";
import { TDeviceId, TParams } from "@/app/api/api-types";
import { log } from "@/shared/log";

export type TWsMessage = {
  event: "message" | "completed" | "error";
  data: string;
}

export async function streamToWs(
  { params }: TParams<TDeviceId>,
  client: ws.WebSocket,
  streamFunc: (device_id: string, streamEvents: TStreamEvents) => Promise<WebSocket>,
  
) {
  const { device_id } = await params;

  const send = (event: string, data: string) => {
    client.send(JSON.stringify(<TWsMessage>{ event, data: data.trim() }));
  }

  return new Promise(async (res, rej) => {
    const socket = await streamFunc(device_id!, {
        onEvent: (e) => send("message", e.data),
        onClose: (c) => res(c),
        onError: (e) => rej(e)
      });
    client.on("close", () => {
      log.debug("Client closed connection");
      socket.close();
    });
  })
    .then(() => { send("completed", ""); client.close(); })
    .catch((e) => { send("error", e.toString()); client.close(); });
}


