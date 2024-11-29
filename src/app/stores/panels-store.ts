import { TDevice, TLocalFile } from "@/server/devices/types";
import { makeAutoObservable } from "mobx";
import { ESPHomeDeviceStore } from "./panels-store/esphome-device-store";
import { LocalFileStore } from "./panels-store/local-file-store";
import { LocalDeviceStore } from "./panels-store/local-device-store";
import { DeviceDiffStore } from "./panels-store/device-diff-store";
import { ESPHomeCompileStore } from "./panels-store/esphome-compile-store";
import { IPanelsStore } from "./panels-store/utils/IPanelsStore";
import { ESPHomeLogStore } from "./panels-store/esphome-log-store";
import { ESPHomeInstallStore } from "./panels-store/esphome-install-store";

export class PanelsStore {
    tab: IPanelsStore | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    private add = (tab: IPanelsStore) => {
        this.tab = tab;
    }

    add_localDevice = (device: TDevice) => this.add(new LocalDeviceStore(device));
    add_localFile = (device: TDevice, file: TLocalFile) => this.add(new LocalFileStore(device, file));
    add_diff = (device: TDevice) => this.add(new DeviceDiffStore(device));
    add_espHomeDevice = (device: TDevice) => this.add(new ESPHomeDeviceStore(device));
    add_espHomeCompile = (device: TDevice) => this.add(new ESPHomeCompileStore(device));
    add_espHomeInstall = (device: TDevice) => this.add(new ESPHomeInstallStore(device));
    add_espHomeLog = (device: TDevice) => this.add(new ESPHomeLogStore(device));
}
