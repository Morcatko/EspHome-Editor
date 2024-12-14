import { WebSocket } from "ws";
import { espHome } from "@/server/devices/esphome";

export function getStreamResponse(
  device_id: string,
  path: string,
  spawnParams: Record<string, any> | null = null,
) {
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: string) => {
        if (!cancelled) {
          controller.enqueue(`event: ${event}\ndata: ${data}\n\n`);
        }
      };
      
      espHome
        .stream(
          device_id, 
          path, 
          spawnParams,
          (e) => send("message", e.data),
        )
        .then((r) => send("completed", ""))
        .catch((e) => send("error", e.toString()));
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
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
    client.send(JSON.stringify({ event, data: data.trim() }));
  }

  await espHome
    .stream(
      device_id!, 
      path, 
      spawnParams,
      (e) => send("message", e.data)
    )
    .then((r) => {send("completed", ""); client.close();})
    .catch((e) => send("error", e.toString()));
}
  

