export type TEditorFileProps = {
    value: {
        pending: boolean;
        error: boolean;
        content: string;
    },
    language: string;
    onValueChange?: (v: string) => void;
}


type TPanel_DeviceBase = {
    device_id: string;
}


export type TPanel_DeviceLocalFile = {
    operation: "local_file";
    path: string;
}

export type TPanel_DeviceOperation = {
    operation: "local_device" | "esphome_device" | "diff" | "esphome_compile" | "esphome_install" | "esphome_log";
}

export type TPanel_Device = TPanel_DeviceBase & (TPanel_DeviceLocalFile | TPanel_DeviceOperation);

export type TPanel_Onboarding = {
    operation: "onboarding";
    step?: "home" | "flowers";
}

type TPanel_Devices = {
    operation: "devices_tree";
}

export type TPanel = (TPanel_Device | TPanel_Onboarding | TPanel_Devices);

export type TPanelWithClick = TPanel & { last_click: string };