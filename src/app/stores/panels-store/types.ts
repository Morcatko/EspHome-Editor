export type TEditorFileProps = {
    value: {
        pending: boolean;
        error: boolean;
        content: string;
    },
    language: string;
    onValueChange?: (v: string) => void;
}


type TPanelBase = {
    device_id: string;
    last_click?: string;
}


type TPanel_localFile = {
    operation: "local_file";
    path: string;
}

type TPanel_Others = {
    operation: "local_device" | "esphome_device" | "diff" | "esphome_compile" | "esphome_install" | "esphome_log" ;
}
export type TPanel = TPanelBase & (TPanel_localFile | TPanel_Others);