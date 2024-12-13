import { espHome } from "@/server/devices/esphome";

export function getStreamResponse(
  device_id: string,
  path: string,
  spawnParams: Record<string, any> | null = null,
) {
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (event: string, data: string) => {
        if (!cancelled) {
          controller.enqueue(`event: ${event}\ndata: ${data}\n\n`);
        }
      };
      
      espHome
        .stream(
          device_id, 
          path, 
          spawnParams,
          (e) => enqueue("message", "abcdef".repeat(1000)),
        )
        .then((r) => enqueue("completed", ""))
        .catch((e) => enqueue("error", e.toString()));
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
