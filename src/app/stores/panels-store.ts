import { TDevice, TLocalFile } from "@/server/devices/types";
import { makeAutoObservable } from "mobx";
import { TPanel } from "./panels-store/types";

export class PanelsStore {
    tab: TPanel | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    private add = (tab: TPanel) => {
        this.tab = tab;
    }

    add_localDevice = (device: TDevice) => this.add({ device_id: device.id, operation: "local_device" });
    add_localFile = (device: TDevice, file: TLocalFile) => this.add({ device_id: device.id, operation: "file", path: file.path });
    add_diff = (device: TDevice) => this.add({device_id: device.id, operation: "diff"});  
    add_espHomeDevice = (device: TDevice) => this.add({device_id: device.id, operation: "esphome_device"});
    add_espHomeCompile = (device: TDevice) => this.add({device_id: device.id, operation: "compile"});
    add_espHomeInstall = (device: TDevice) => this.add({device_id: device.id, operation: "install"});
    add_espHomeLog = (device: TDevice) => this.add({device_id: device.id, operation: "log"});
}
