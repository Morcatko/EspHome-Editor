import { useDevicesQuery, useDevicesStore2 } from "@/app/stores/devices-store"
import { api } from "@/app/utils/api-client";
import { useState } from "react";

export const useDevicesPanelStore = () => {
    const ds2 = useDevicesStore2();
    
    const [compileState, setCompileState] = useState<Record<string, string>>({});

    const compile = (device_id: string) => {
        api.stream(ds2.findDevice(device_id)?.compileStreamUrl!, (data) => {
            setCompileState((prev) => ({
                ...prev,
                [device_id]: data
            }));
        });
    };

    return {
        devices_query: useDevicesQuery(),
        compileState,
        compile
    };
}