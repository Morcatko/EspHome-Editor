import { espHomeUrl } from "@/server/config";

export type StreamEvent = {
    event: "line" | "exit";
    data: string;
    code: number;
};

export const esphome_stream = async (
    path: string,
    spawnParams: Record<string, any>,
    onEvent: (event: StreamEvent) => void,
): Promise<number> => {
    const url = new URL(`${espHomeUrl}/${path}`);
    url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
    const socket = new WebSocket(url.toString());

    return new Promise((resolve, reject) => {
        socket.addEventListener("message", (message) => {
            const event = <StreamEvent> JSON.parse(message.data);

            if (event.event === "line") {
                onEvent(event);
                return;
            }

            if (event.event === "exit") {
                resolve(event.code);
            }

            reject(message.data);
        });

        socket.addEventListener("open", () => {
            socket.send(
                JSON.stringify({
                    type: "spawn",
                    ...spawnParams,
                }),
            );
        });

        socket.addEventListener("close", () => {
            reject(new Error("Unexpected socket closure"));
        });
    });
};
