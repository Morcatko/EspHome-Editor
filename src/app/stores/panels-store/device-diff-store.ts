import { makeAutoObservable } from "mobx";
import { TDevice } from "@/server/devices/types";
import { createMonacoFileStore_url, MonacoFileStore } from "./utils/monaco-file-store";
import { IPanelsStore } from "./utils/IPanelsStore";
import { api } from "@/app/utils/api-client";

export class DeviceDiffStore implements IPanelsStore{
    readonly dataPath = "diff";
    readonly left_file: MonacoFileStore;
    readonly right_file: MonacoFileStore;
    
    constructor(readonly device: TDevice) {
        this.left_file = createMonacoFileStore_url(true, "yaml", api.url_device(device.id, "esphome"));
        this.right_file = createMonacoFileStore_url(true, "yaml", api.url_device(device.id, "local"));
        makeAutoObservable(this);
    }

    async loadIfNeeded() {
        await Promise.all([
            this.left_file.loadIfNeeded(),
            this.right_file?.loadIfNeeded()
        ]);
    }
}