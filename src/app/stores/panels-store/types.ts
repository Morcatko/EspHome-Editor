import type { TOperationResult } from "@/server/devices/types";

export type TEditorFileProps = {
    query?: {
        pending: boolean;
        success: boolean;
        logs: TOperationResult["logs"]
    }
    value: string;
    language: string;
    onValueChange?: (v: string) => void;
}


type TPanel_DeviceBase = {
    device_id: string;
}


type TPanel_DeviceLocalFile = {
    operation: "local_file";
    path: string;
}

export type TPanel_DeviceOperation = {
    operation: "local_device" | "esphome_device" | "diff" | "esphome_compile" | "esphome_install" | "esphome_log";
}

export type TPanel_Device = TPanel_DeviceBase & (TPanel_DeviceLocalFile | TPanel_DeviceOperation);

export type TPanel = TPanel_Device;

export type TPanelWithClick = TPanel & { last_click: string };