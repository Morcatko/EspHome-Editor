import { useDevicesQuery, useDevicesStore } from "@/app/stores/devices-store"
import { useCallback, useMemo, useState } from "react";
import { TDevice } from "@/server/devices/types";
import { api, TStreamEvents } from "@/app/utils/api-client";
import { useMap } from "@mantine/hooks";
import { TCompilationInfo } from "@/server/devices/local/manifest-utils";

export type TDeviceRecord = {
    id: string;
    device: TDevice;
    upload_status: "" | "planned" | "running" | "success" | "failed";
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

const compileDevices = async (
    device_ids: string[],     
    updateDeviceRecord: (device_id: string, state: Partial<TDeviceRecord>) => void) => {

    for (const device_id of device_ids) {
        updateDeviceRecord(device_id, { compilation_status: "planned" });
    }

    for (const device_id of device_ids) {
        await compileDevice(device_id, {
            onMessage: (message) => updateDeviceRecord(device_id, { compilation_status: "running", last_message: message }),
            onCompleted: () => {
                //devices_query.refetch();
                updateDeviceRecord(device_id, { compilation_status: "success", last_message: "Compilation succeeded" });
            },
            onError: (errorMessage) => {
                //devices_query.refetch();
                updateDeviceRecord(device_id, { compilation_status: "failed", last_message: errorMessage });
            }
        });
    }
}

const uploadConfigsToEspHome = async (
    devices: TDevice[], 
    updateDeviceRecord: (device_id: string, state: Partial<TDeviceRecord>) => void, 
    deviceAction: (device: TDevice) => Promise<void>
) => {
    for (const device of devices) {
        updateDeviceRecord(device.id, { upload_status: "planned" });
    }

    for (const device of devices) {
        updateDeviceRecord(device.id, { upload_status: "running", last_message: "Uploading..." });
        try {
            await deviceAction(device);
            updateDeviceRecord(device.id, { upload_status: "success", last_message: "Upload succeeded" });
        } catch (e) {
            updateDeviceRecord(device.id, { upload_status: "failed", last_message: e?.toString?.() });
            continue;
        }
    }
};


export const useDevicesPanelStore = () => {
    const devices_query = useDevicesQuery();
    const devicesStore = useDevicesStore();


    const [selectedRecords, setSelectedRecords] = useState<TDeviceRecord[]>([]);

    const compilationStore = useMap<string, TDeviceRecord>(
        useMemo(() =>
            (devices_query?.data ?? [])
                .filter(d => d.name !== ".lib")
                .map(d =>
                    [d.id, {
                        id: d.id,
                        device: d,
                        upload_status: "",
                        compilation_status: d.compilationInfo?.status ?? "",
                        last_message: null
                    }]), [devices_query?.data])
    );

    const updateDeviceRecord = useCallback((device_id: string, deviceRecord: Partial<TDeviceRecord>) => {
        compilationStore.set(device_id, {
            ...compilationStore.get(device_id)!,
            ...deviceRecord
        });
    }, [compilationStore]);

    const upload = () => uploadConfigsToEspHome(selectedRecords.map(r => r.device), updateDeviceRecord, devicesStore.espHome_upload);
    const compile = () => compileDevices(selectedRecords.map(r => r.device.id), updateDeviceRecord);   

    const toggleSelection = () => {
        const selectedIds = new Set(selectedRecords.map(r => r.id));
        const newSelected = [...compilationStore.values()].filter(r => !selectedIds.has(r.id));
        setSelectedRecords(newSelected);
    }

    return {
        selectionStore: [selectedRecords, setSelectedRecords, toggleSelection] as const,
        devices_query: useDevicesQuery(),
        devices: compilationStore,
        uploadSelected: upload,
        compileSelected: compile
    };
}