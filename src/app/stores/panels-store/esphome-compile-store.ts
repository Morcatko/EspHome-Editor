import { TDevice } from "@/server/devices/types";
import { IPanelsStore } from "./utils/IPanelsStore";
import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEspHomeCompileStore = (device_id: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/compile"));

export class ESPHomeCompileStore implements IPanelsStore {
    readonly dataPath = "Compile";

    constructor(readonly device: TDevice) {
    }

    async loadIfNeeded() {}
}
