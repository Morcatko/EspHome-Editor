import { TDevice } from "@/server/devices/types";
import { IPanelsStore } from "./utils/IPanelsStore";
import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEspHomeLogStore = (device_id: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/log"));

export class ESPHomeLogStore implements IPanelsStore{
    readonly dataPath = "Log";

    constructor(readonly device: TDevice) {
    }
    async loadIfNeeded() {}
}
