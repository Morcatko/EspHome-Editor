import { api } from "@/app/utils/api-client";
import { log } from "@/shared/log";
import Convert from "ansi-to-html";
import { atomFamily } from 'jotai-family';
import { atom, getDefaultStore, useAtom } from "jotai";
import { useMemo } from "react";
import { fixStreamMessage } from "@/shared/string-utils";

const convert = new Convert({
    stream: true,
});

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

type TLogStoreAtom = {
    data: string[];
    filter: string;
    isOutdated: boolean;
}

const storeFamily = atomFamily((key: AtomKey) => {
    const isOutdatedValue = isOutdated(key.lastClick);
    const store = atom<TLogStoreAtom>({
        data: [],
        filter: "",
        isOutdated: isOutdatedValue,
    });
    if (!isOutdatedValue) {
        const dispose = api.stream(key.url, (message) => {
            const html = convert.toHtml(fixStreamMessage(message));
            getDefaultStore().set(store, val => ({
                ...val,
                data: [...val.data, html],
            }));
        });
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
        clear: () => setStore({ ...store, data: [`${(new Date()).toLocaleTimeString()} - Stream cleared`] }),
    }
}