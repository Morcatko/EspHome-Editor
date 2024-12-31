import { TDevice } from "@/server/devices/types";
import { IPanelsStore } from "./utils/IPanelsStore";
import { useStreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";

export const useEsphomeInstallStore = (device_id: string) =>
    useStreamingStore(api.url_device(device_id, "esphome/install"));

export class ESPHomeInstallStore implements IPanelsStore{
    readonly dataPath =  "Install";
    
    constructor(readonly device: TDevice) {
    }

    async loadIfNeeded() {
    }
}
