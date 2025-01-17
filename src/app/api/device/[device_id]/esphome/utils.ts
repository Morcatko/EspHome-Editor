import { WebSocket } from "ws";
import { espHome } from "@/server/devices/esphome";
import { TDeviceId, TParams } from "@/app/api/api-types";

export type TWsMessage = {
  event: "message" | "completed" | "error";
  data: string;
}

export async function streamToWs(
  { params }: TParams<TDeviceId>,
  client: WebSocket,
  path: string,
  spawnParams: Record<string, any> | null = null
) {
  const { device_id } = await params;

  const send = (event: string, data: string) => {
    client.send(JSON.stringify(<TWsMessage>{ event, data: data.trim() }));
  }

  await espHome
    .stream(
      device_id!, 
      path, 
      spawnParams,
      (e) => send("message", e.data)
    )
    .then((r) => {send("completed", ""); client.close();})
    .catch((e) => { send("error", e.toString()); client.close(); });
}
  

