import { TDevice } from "@/server/devices/types";
import { makeAutoObservable } from "mobx";
import { createMonacoFileStore_url, MonacoFileStore } from "./utils/monaco-file-store";
import { IPanelsStore } from "./utils/IPanelsStore";
import { api } from "@/app/utils/api-client";

export class LocalDeviceStore implements IPanelsStore {
    readonly dataPath = "Local";
    readonly monaco_file: MonacoFileStore;

    constructor(readonly device: TDevice) {
        this.monaco_file = createMonacoFileStore_url(true, "yaml", api.url_device(device.id, "local"));
        makeAutoObservable(this);
    }

    async loadIfNeeded() {
        await this.monaco_file.loadIfNeeded();
    }
}