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


type TPanel_DeviceLocalFile = {
    operation: "local_file";
    path: string;
}

export type TPanel_Device = {
    operation: "local_device" | "esphome_device" | "diff" | "esphome_compile" | "esphome_install" | "esphome_log";
}

type TPanel_DeviceAll = TPanel_DeviceBase & (TPanel_DeviceLocalFile | TPanel_Device);

export type TPanel_Onboarding = {
    operation: "onboarding";
    step?: "home" | "flowers";
}


export type TPanel = (TPanel_DeviceAll | TPanel_Onboarding)

export type TPanelWithClick = TPanel & { last_click: string };