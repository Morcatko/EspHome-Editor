import { createMonacoFileStore_url, MonacoFileStore } from "./utils/monaco-file-store";
import { api } from "@/app/utils/api-client";
import { PanelStoreBase } from "./types";

export class LocalDeviceStore extends PanelStoreBase {
    readonly monaco_file: MonacoFileStore;

    constructor(device_id: string) {
        super({
            device_id,
            operation: "local_device",
        });
        this.monaco_file = createMonacoFileStore_url(true, "yaml", api.url_device(device_id, "local"));
    }

    async loadIfNeeded() {
        await this.monaco_file.loadIfNeeded();
    }
}