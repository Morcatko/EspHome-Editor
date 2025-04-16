import { TWsMessage } from "@/app/api/device/[device_id]/esphome/utils";
import { api } from "@/app/utils/api-client";
import { log } from "@/shared/log";
import Convert from "ansi-to-html";
import { atomFamily } from 'jotai/utils';
import { atom,  getDefaultStore,  PrimitiveAtom, useAtom } from "jotai";
import { useMemo } from "react";

const convert = new Convert({
    stream: true,
});

type TLogStoreAtom = {
    data: string[];
    filter: string;
    isOutdated: boolean;
}

const createLogStreamingStore = (url: string, atom: PrimitiveAtom<TLogStoreAtom>) => {
    const socket = new WebSocket(api.getWsUrl(url))
    log.debug("Creating socket", url);

    // Connection opened
    socket.addEventListener("open", event => {
        socket.send("Connection established")
    });

    // Listen for messages
    socket.addEventListener("message", event => {
        if (event?.data) {
            const jsonData = JSON.parse(event.data) as TWsMessage;

            switch (jsonData.event) {
                case "completed":
                    log.verbose("Stream completed");
                    //ws.getWebSocket()!.close();
                    break;
                case "error":
                    log.error("Stream error", jsonData.data);
                    //ws.getWebSocket()!.close();
                    break;
                case "message":
                    const html = convert.toHtml(jsonData.data.replaceAll("\\033", "\x1b"));
                    getDefaultStore().set(atom, val => ({
                        ...val,
                        data: [...val.data, html],
                    }));
                    break;
                default:
                    log.warn("Unknown event", jsonData);
                    break
            }
        }
    });
    return () => {
        log.debug("Closing socket");
        if (socket.readyState === WebSocket.OPEN)
            socket.close();
    }
}



const isOutdated = (lastClick: string | undefined) => {
    if (!lastClick)
        return true;

    const currentTime = new Date();
    const lastClickTime = new Date(lastClick);
    const diff = currentTime.getTime() - lastClickTime.getTime();
    return diff > 1000;
}

type AtomKey = {
    url: string;
    lastClick: string;
}
const storeFamily = atomFamily((key: AtomKey) => {
    const store = atom<TLogStoreAtom>({
        data: [],
        filter: "",
        isOutdated: isOutdated(key.lastClick),
    });
    if (!isOutdated(key.lastClick)) {
        const dispose = createLogStreamingStore(key.url, store);
        store.onMount = () => {
            log.verbose("onMount", key.url);
            return () => {
                log.verbose("onUnmount", key.url);
                dispose();
            }
        }
    }
    return store;
}, (a, b) => a.url === b.url && a.lastClick === b.lastClick);


export const useStreamingStore = (url: string, lastClick: string) => {
    const [store, setStore] = useAtom(storeFamily({ url, lastClick }));

    const filteredData = useMemo(() => 
        store.filter 
            ? store.data.filter((item) => item.toLowerCase().includes(store.filter.toLowerCase())) 
            : store.data, 
        [store.filter, store.data]
    );
    
    return {
        allData: store.data,
        filter: store.filter,
        filteredData,
        setFilter: (filter: string) => setStore({ ...store, filter }),
        isOutdated: store.isOutdated,
        clear: () => setStore({...store, data: [`${(new Date()).toLocaleTimeString()} - Stream cleared`] }),
    }
}


