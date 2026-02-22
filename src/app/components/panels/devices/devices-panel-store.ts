import { useDevicesQuery, useDevicesStore2 } from "@/app/stores/devices-store"
import { api } from "@/app/utils/api-client";
import { removeAnsiControlSequences } from "@/shared/string-utils";
import { useState } from "react";

type CompileState = {
    finished_at: Date | null;
    last_message: string;
    status: "unknown" | "compiling" | "success" | "error";
}

const useCompileStore = () => {
    const [compileState, setCompileState] = useState<Record<string, CompileState>>({});

    const compile = (device_id: string) => {
        setCompileState((prev) => ({
            ...prev,
            [device_id]: {
                finished_at: null,
                last_message: "Starting compilation...",
                status: "compiling"
            }
        }));

        api.stream(api.url_esphome_compile(device_id), (data) => {
            const text = removeAnsiControlSequences(data);
            
            const patch: Partial<CompileState> = {
                last_message: text,
                status: "compiling"
            };

            if (text === "INFO Successfully compiled program.") {
                patch.status = "success";
                patch.finished_at = new Date();
            }

            setCompileState((prev) => ({
                ...prev,
                [device_id]: {
                    ...compileState[device_id],
                    ...patch,
                }
            }));
        });
    };

    return {
        getCompileState: (device_id: string) => compileState[device_id] ?? { status: "unknown", last_message: "", finished_at: null },
        compile
    }
}


export const useDevicesPanelStore = () => {
    const { getCompileState, compile } = useCompileStore();




    return {
        devices_query: useDevicesQuery(),
        getCompileState,
        compile
    };
}