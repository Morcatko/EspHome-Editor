import { c } from "@/server/config";

export type StreamEvent = {
    event: "line" | "exit";
    data: string;
    code: number;
};

export const esphome_stream = (
    path: string,
    spawnParams: Record<string, any>,
    onEvent: (event: StreamEvent) => void,
    onClose: (code: number) => void,
    onError: (data: any) => void,
): WebSocket => {
    const url = new URL(`${c.espHomeApiUrl}/${path}`);
    url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
    const socket = new WebSocket(url.toString());

    socket.addEventListener("message", (message) => {
        const event = <StreamEvent> JSON.parse(message.data);

        if (event.event === "line") {
            onEvent(event);
            return;
        }

        if (event.event === "exit") {
            onClose(event.code);
        }

        onError(message.data);
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
        onError(new Error("Unexpected socket closure"));
    });
    
    return socket;
};
