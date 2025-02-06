import { useEspHomeCompileStore } from "@/app/stores/panels-store/esphome-compile-store";
import { LogStream } from "../editors/log-stream";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { LogIcon, SyncIcon, UploadIcon } from "@primer/octicons-react";
import { usePanelsStore } from "@/app/stores/panels-store";

type TProps = {
    device_id: string;
}
export const EspHomeCompileToolbar = ({ device_id }: TProps) => {
    const panelsStore = usePanelsStore();
    

    const allProps = {
        variant: "subtle" as ActionIconProps["variant"],
    }

    return <ActionIcon.Group>
        <ActionIcon {...allProps} onClick={(e) => panelsStore.addPanel(e, { operation: "esphome_compile", device_id })}><SyncIcon /></ActionIcon>
        <ActionIcon  {...allProps} onClick={(e) => panelsStore.addPanel(e, { operation: "esphome_log", device_id})} ><LogIcon /></ActionIcon>
    </ActionIcon.Group>;
}

export const EspHomeCompilePanel = ({ device_id }: TProps) => {
    const data = useEspHomeCompileStore(device_id);
    return <LogStream data={data} />;
}