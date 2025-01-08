import { WebSocket } from "ws";
import { espHome } from "@/server/devices/esphome";

export type TWsMessage = {
  event: "message" | "completed" | "error";
  data: string;
}

export async function streamToWs(
  requestUrl: string,
  client: WebSocket,
  path: string,
  spawnParams: Record<string, any> | null = null
) {
  const match = requestUrl.match(/\/device\/([^\/]+)\/esphome/);
  const device_id = match ? match[1] : null;

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
  

