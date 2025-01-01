import { createMonacoFileStore_url, MonacoFileStore } from "./utils/monaco-file-store";
import { api } from "@/app/utils/api-client";
import { PanelStoreBase, TPanel } from "./types";

export class ESPHomeDeviceStore extends PanelStoreBase {
    readonly monaco_file: MonacoFileStore;

    constructor(device_id: string) {
        super({
            device_id,
            operation: "esphome_device",
        });
        this.monaco_file = createMonacoFileStore_url(true, "yaml", api.url_device(device_id, "esphome"));
    }

    async loadIfNeeded() {
        await this.monaco_file.loadIfNeeded();
    }
}