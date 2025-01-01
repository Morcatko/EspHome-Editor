import { StreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";
import { PanelStoreBase, TPanel } from "./types";


export class ESPHomeCompileStore extends PanelStoreBase{
    readonly data: StreamingStore;

    constructor(device_id: string) {
        super({
            device_id,
            operation: "esphome_compile",
        });
        this.data = new StreamingStore(api.url_device(device_id, "esphome/compile"));
    }

    async loadIfNeeded() {
        await this.data.loadIfNeeded();
    }
}
