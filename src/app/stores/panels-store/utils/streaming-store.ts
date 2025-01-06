import { TWsMessage } from "@/app/api/device/[device_id]/esphome/utils";
import { api } from "@/app/utils/api-client";
import { log } from "@/shared/log";
import Convert from "ansi-to-html";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const convert = new Convert({
    stream: true,
});

export const useStreamingStore = (url: string) => {
    const [data, setData] = useState<string[]>([]);

    const ws = useWebSocket<TWsMessage>(
        api.getWsUrl(url), {
        share: true
    });

    useEffect(() => setData([]), [url]);

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

    return data
}


