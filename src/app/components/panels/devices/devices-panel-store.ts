import { useDevicesQuery } from "@/app/stores/devices-store"
import { useCallback, useMemo, useState } from "react";
import { TDevice } from "@/server/devices/types";
import { api, TStreamEvents } from "@/app/utils/api-client";
import { useMap } from "@mantine/hooks";
import { TCompilationInfo } from "@/server/devices/local/manifest-utils";

export type TDeviceRecord = {
    id: string;
    device: TDevice;
    compilation_status: "" | "planned" | TCompilationInfo["status"];
    last_message: string | null;
}

const compileDevice = async (device_id: string, events: TStreamEvents) =>
    new Promise<void>(async (resolve, reject) =>
        await api.stream(api.url_esphome_compile(device_id), {
            onMessage: events.onMessage,
            onCompleted: () => { events.onCompleted?.(); resolve(); },
            onError: (error) => { events.onError?.(error); reject(error); }
        }));

export const useDevicesPanelStore = () => {
    const devices_query = useDevicesQuery()

    const [selectedRecords, setSelectedRecords] = useState<TDeviceRecord[]>([]);

    const compilationStore = useMap<string, TDeviceRecord>(
        useMemo(() =>
            (devices_query?.data ?? [])
                .filter(d => d.name !== ".lib")
                .map(d =>
                    [d.id, {
                        id: d.id,
                        device: d,
                        compilation_status: d.compilationInfo?.status ?? "",
                        last_message: null
                    }]), [devices_query?.data])
    );

    const compile = useCallback(async () => {
        for (const r of selectedRecords) {
            compilationStore.set(r.device.id, {
                ...compilationStore.get(r.device.id)!,
                compilation_status: "planned",
                last_message: null,
            });
        }
        
        for (const r of selectedRecords) {
            await compileDevice(r.device.id, {
                onMessage: (message) => {
                    compilationStore.set(r.device.id, {
                        ...compilationStore.get(r.device.id)!,
                        compilation_status: "running",
                        last_message: message,
                    });
                },
                onCompleted: () => {
                    devices_query.refetch();
                    compilationStore.set(r.device.id, {
                        ...compilationStore.get(r.device.id)!,
                        compilation_status: "success",
                        last_message: null,
                    } );
                },
                onError: (errorMessage) => {
                    devices_query.refetch();
                    compilationStore.set(r.device.id, {
                        ...compilationStore.get(r.device.id)!,
                        compilation_status: "failed",
                        last_message: errorMessage
                    });
                }
            });
        }
    }, [selectedRecords]);

    return {
        selectionStore: [selectedRecords, setSelectedRecords] as const,
        devices_query: useDevicesQuery(),
        devices: compilationStore,
        compile
    };
}