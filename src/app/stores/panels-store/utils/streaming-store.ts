import { log } from "@/shared/log";
import Convert from "ansi-to-html";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const convert = new Convert({
    stream: true,
});

export const useStreamingStore = (url: string) => {
    const [data, setData] = useState<string[]>([]);

    /*
const finalUrl = new URL(fixUrl(url), location.href);
        finalUrl.protocol = finalUrl.protocol === "http:" ? "ws:" : "wss:";

        const ws = new WebSocket(finalUrl.toString());
        ws.onmessage = (ev) => {
            const msg = JSON.parse(ev.data);
            switch (msg.event) {
                case "completed":
                    log.verbose("Stream completed");
                    ws.close();;
                    break;
                case "error":
                    log.error("Stream error", msg.data);
                    ws.close();
                    break;
                case "message":
                    onMessage(msg.data as string);
                    break;
                default:
                    log.warn("Unknown event", msg);
                    break;
            }
        };
        */
    const ws = useWebSocket<{
        event: string;
        data: string;
    }>(url, {
        share: true
    });

    useEffect(() => {
        if (!ws.lastJsonMessage?.event) return;
        switch (ws.lastJsonMessage.event) {
            case "completed":
                log.verbose("Stream completed");
                //ws.getWebSocket()!.close();
                break;
            case "error":
                log.error("Stream error", ws.lastJsonMessage?.data);
                //ws.getWebSocket()!.close();
                break;
            case "message":
                if (ws.lastJsonMessage?.data) {
                    const html = convert.toHtml(
                        ws.lastJsonMessage?.data.replaceAll("\\033", "\x1b"),
                    );
                    setData(val => [...val, html]);
                }
                break;
            default:
                log.warn("Unknown event", ws.lastJsonMessage);
                break
        }
    }, [ws.lastJsonMessage]);

    useEffect(() => setData([]), [url]);

    return data;
}
