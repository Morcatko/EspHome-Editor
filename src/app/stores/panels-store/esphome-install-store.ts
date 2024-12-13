import { TDevice } from "@/server/devices/types";
import { makeAutoObservable } from "mobx";
import { IPanelsStore } from "./utils/IPanelsStore";
import { StreamingStore } from "./utils/streaming-store";
import { api } from "@/app/utils/api-client";


export class ESPHomeInstallStore implements IPanelsStore{
    readonly dataPath =  "Install";
    readonly data: StreamingStore;

    constructor(readonly device: TDevice) {
        makeAutoObservable(this);
        this.data = new StreamingStore(api.url_device(device.id, "esphome/install"));
    }

    async loadIfNeeded() {
        await this.data.loadIfNeeded();
    }
}
