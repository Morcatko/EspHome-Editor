import { createMonacoFileStore_url, MonacoFileStore } from "./utils/monaco-file-store";
import { api } from "@/app/utils/api-client";
import { PanelStoreBase, TPanel } from "./types";

export class DeviceDiffStore extends PanelStoreBase {
    readonly left_file: MonacoFileStore;
    readonly right_file: MonacoFileStore;
    
    constructor(device_id: string) {
        super({
            device_id,
            operation: "diff",
        });
        this.left_file = createMonacoFileStore_url(true, "yaml", api.url_device(device_id, "esphome"));
        this.right_file = createMonacoFileStore_url(true, "yaml", api.url_device(device_id, "local"));
    }

    async loadIfNeeded() {
        await Promise.all([
            this.left_file.loadIfNeeded(),
            this.right_file?.loadIfNeeded()
        ]);
    }
}