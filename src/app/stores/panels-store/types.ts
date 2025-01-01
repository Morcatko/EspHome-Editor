type TPanelBase = {
    device_id: string;
}

type TPanel_localFile = {
    operation: "local_file";
    path: string;
}

type TPanel_Others = {
    operation: "local_device" | "esphome_device" | "diff" | "esphome_compile" | "esphome_install" | "esphome_log" ;
}

export type TPanel = TPanelBase & (TPanel_localFile | TPanel_Others);


import { TDevice } from "@/server/devices/types";

export interface IPanelsStore {
     loadIfNeeded(): Promise<void>;
}

export abstract class PanelStoreBase implements IPanelsStore {
    constructor(readonly panel: TPanel) {
    }

    abstract loadIfNeeded(): Promise<void>;
}