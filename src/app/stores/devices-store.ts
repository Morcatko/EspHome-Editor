"use client";
import { TDevice, TLocalFile, TLocalFileOrDirectory } from "@/server/devices/types";
import { api } from "../utils/api-client";
import { queryClient } from ".";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useMemo } from "react";
import { openConfirmationDialog } from "../components/dialogs/confirmation-dialog";
import { openCreateFileDialog, openInputTextDialog } from "../components/dialogs/input-text-dialog";
import { notifications } from "@mantine/notifications";
import { usePanelsStore } from "./panels-store";

const useDeviceExpandedStore = () => {
    const [value, setValue] = useLocalStorage<string[]>('e4e.devices.expanded', [], {
        serializer: JSON.stringify,
        deserializer: JSON.parse,
    });

    return {
        expanded: useMemo<Record<string, boolean>>(() => value.reduce((acc, id) => { acc[id] = true; return acc }, {} as any), [value]),
        set: useCallback((id: string, expanded: boolean) => {
            if (expanded) {
                setValue([...value, id]);
            } else {
                setValue(value.filter((i) => i !== id));
            }
        }, [value, setValue]),
    }
}

async function showToast(
    call: () => Promise<any>,
    invalidateKeys: string[][],
    loading: string | null,
    success: string | null,
    error: string | null,
    onSuccess?: () => void) {
    const notificationId = notifications.show({ title: loading, message: null, loading: true, autoClose: false, withCloseButton: false });
    try {
        await call();
        for (const invalidateKey of invalidateKeys) {
            await queryClient.invalidateQueries({ queryKey: invalidateKey });
        }
        notifications.update({ id: notificationId, title: success, message: null, loading: false, autoClose: 1500 });
        onSuccess?.();
    } catch (e) {
        notifications.update({ id: notificationId, title: error, message: e?.toString(), loading: false, color: "red", withCloseButton: true });
    }
}

async function localDevice_create() {
    const device_name = await openInputTextDialog({
        title: "Add New Device",
        subtitle: "Enter Device Name",
        defaultValue: "new-device",
    });

    if (device_name)
        await showToast(
            () => api.local_createDevice(device_name),
            [["devices"]],
            "Creating...",
            "Created!",
            "Failed to Create",
        );
}

async function localDevice_addDirectory(device: TDevice, parent_path: string) {
    const directory_name = await openInputTextDialog({
        title: "Create New Directory",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "new directory",
    });

    if (directory_name)
        await showToast(
            () => api.local_createDirectory(device.id, parent_path + "/" + directory_name),
            [["devices"]],
            "Creating...",
            "Created!",
            "Failed to Create",
        );
}

async function localDevice_addFile(device: TDevice, parent_path: string) {
    const file_name = await openCreateFileDialog({
        title: "Create New File",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "newfile",
        defaultExtension: ".yaml",
    });
    if (file_name)
        await showToast(
            () => api.local_path_save(device.id, parent_path + "/" + file_name, ""),
            [["devices"],
            ["device", device.id, "local"]],
            "Creating...",
            "Created!",
            "Failed to Create",
        );
}

async function localDevice_import(device_id: string) {
    await showToast(
        () => api.local_importDevice(device_id),
        [["devices"],
        ["device", device_id, "local"]],
        "Creating...",
        "Created!",
        "Failed to Create",
    );
}

async function espHome_upload(device: TDevice) {
    await showToast(
        () => api.callPost(api.url_device(device.id, "esphome"), null),
        [["device", device.id, "esphome"], device.esphome_config ? ["devices"] : []],
        "Uploading...",
        "Uploaded!",
        "Failed to Upload",
    );
}
type TPanelsStore = ReturnType<typeof usePanelsStore>;
async function local_renameFoD(panelsStore: TPanelsStore, device: TDevice, file: TLocalFileOrDirectory) {
    const newName = await openInputTextDialog({
        title: "Rename",
        subtitle: `${device.name} - ${file.path}`,
        defaultValue: file.name,
    });

    if (newName)
        await showToast(
            () => api.local_path_rename(device.id, file.path, newName),
            [["devices"],
            ["device", device.id, "local"],
            ["device", device.id, "local-file", file.path],
            ["device", device.id, "local-file", file.path, "compiled"]],
            "Renaming...",
            "Renamed!",
            "Failed to Rename",
            () => panelsStore.replacePanel(
                    { operation: "local_file", device_id: device.id, path: file.path },
                    { operation: "local_file", device_id: device.id, path: newName }),
        );
}

async function local_enableDisableFile(panelsStore: TPanelsStore, device: TDevice, file: TLocalFile) {
    const enabled = file.enabled
        await showToast(
            () => api.local_path_toggleEnabled(device.id, file.path),
            [["devices"],
            ["device", device.id, "local"],
            ["device", device.id, "local-file", file.path],
            ["device", device.id, "local-file", file.path, "compiled"]],
            enabled ? "Disabling..." : "Enabling...",
            enabled ? "Disabled!" : "Enabled!",
            enabled ? "Failed to Disable": "Failed to Enable",
        );
}

async function local_deleteFoD(panelsStore: TPanelsStore, device: TDevice, file: TLocalFileOrDirectory) {
    const del = await openConfirmationDialog({
        title: "Delete",
        subtitle: `${device.name} - ${file.path}`,
        text: "Are you sure you want to delete this file or directory?",
        danger: true
    });
    if (del)
        showToast(
            () => api.local_path_delete(device.id, file.path),
            [["devices"],
            ["device", device.id, "local"],
            ["device", device.id, "local-file", file.path],
            ["device", device.id, "local-file", file.path, "compiled"]
            ],
            "Deleting...",
            "Deleted!",
            "Failed to Delete",
            () => panelsStore.replacePanel({ operation: "local_file", device_id: device.id, path: file.path }),
        );
}

export const useDevice = (device_id: string) => {
    const devices = useDevicesStore().query.data;
    const device = devices?.find(d => d.id === device_id);
    return device;
}

export const useDevicesQuery = () =>
    useQuery({
        queryKey: ["devices"],
        queryFn: async () => api.callGet_json<TDevice[]>("/api/device")
    });

export const useDevicesStore = () => {
    const panelStore = usePanelsStore();
    return {
        expanded: useDeviceExpandedStore(),
        query: useDevicesQuery(),
        localDevice_create,
        localDevice_addDirectory,
        localDevice_addFile,
        localDevice_import,
        espHome_upload,
        local_renameFoD: (device: TDevice, file: TLocalFileOrDirectory) => local_renameFoD(panelStore, device, file),
        local_deleteFoD: (device: TDevice, file: TLocalFileOrDirectory) => local_deleteFoD(panelStore, device, file),
        local_enableDisableFile: (device: TDevice, file: TLocalFile) => local_enableDisableFile(panelStore, device, file),
    }
};
