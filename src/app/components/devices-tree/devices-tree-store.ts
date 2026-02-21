import { queryClient } from "@/app/stores";
import { useDevicesQuery } from "@/app/stores/devices-store";
import { notifications } from "@mantine/notifications";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { openCreateFileDialog, openInputTextDialog } from "../dialogs/input-text-dialog";
import { api } from "@/app/utils/api-client";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { events } from "@/app/stores/events";
import { openConfirmationDialog } from "../dialogs/confirmation-dialog";

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
    onSuccess?: () => void,) {
    const notificationId = notifications.show({ title: loading, message: null, loading: true, autoClose: false, withCloseButton: false });
    try {
        await call();
        for (const invalidateKey of invalidateKeys) {
            await queryClient.invalidateQueries({ queryKey: invalidateKey });
        }
        notifications.update({ id: notificationId, title: success, message: null, loading: false, autoClose: 1000, withCloseButton: true });
        onSuccess?.();
    } catch (e) {
        notifications.update({ id: notificationId, title: error, message: e?.toString(), loading: false, color: "red", withCloseButton: true });
    }
}

async function localDevice_create() {
    const device_name = await openInputTextDialog({
        title: "Add New Device",
        subtitle: "Enter Device Name",
        placeholder: "Enter device name",
        defaultValue: "",
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
        defaultValue: "",
        placeholder: "Enter directory name",
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
        defaultValue: "",
        defaultExtension: ".yaml",
    });
    if (file_name) {
        const file_path = parent_path + "/" + file_name;
        await showToast(
            () => api.local_path_save(device.id, file_path, ""),
            [["devices"],
            ["device", device.id, "local"]],
            "Creating...",
            "Created!",
            "Failed to Create",
            () => events.emit("File_Created", device.id, file_path),
        );
    }
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

async function local_renameFoD(device: TDevice, fod: TLocalFileOrDirectory) {
    const newName = await openInputTextDialog({
        title: "Rename",
        subtitle: `${device.name} - ${fod.path}`,
        defaultValue: '',
        placeholder: "Enter new name",
    });

    if (newName) {
        const parts = fod.path.split("/");
        parts[parts.length - 1] = newName;

        await showToast(
            () => api.local_path_rename(device.id, fod.path, newName),
            [["devices"],
            ["device", device.id, "local"],
            ["device", device.id, "local-file", fod.path],
            ["device", device.id, "local-file", fod.path, "compiled"]],
            "Renaming...",
            "Renamed!",
            "Failed to Rename",
            () => events.emit("FoD_Renamed", device.id, fod, parts.join("/")),
        );
    }
}

async function local_toggleEnabled(device: TDevice, fod: TLocalFileOrDirectory) {
    const disabled = fod.disabled
    await showToast(
        () => api.local_path_toggleEnabled(device.id, fod.path),
        [["devices"],
        ["device", device.id, "local"]],
        disabled ? "Enabling..." : "Disabling...",
        disabled ? "Enabled!" : "Disabled!",
        disabled ? "Failed to Enable" : "Failed to Disable"
    );
}

async function local_deleteFoD(device: TDevice, fod: TLocalFileOrDirectory) {
    const del = await openConfirmationDialog({
        title: "Delete",
        subtitle: `${device.name} - ${fod.path}`,
        text: "Are you sure you want to delete this file or directory?",
        danger: true
    });
    if (del)
        showToast(
            () => api.local_path_delete(device.id, fod.path),
            [["devices"],
            ["device", device.id, "local"],
            ["device", device.id, "local-file", fod.path],
            ["device", device.id, "local-file", fod.path, "compiled"]
            ],
            "Deleting...",
            "Deleted!",
            "Failed to Delete",
            () => events.emit("FoD_Deleted", device.id, fod),
        );
}

async function device_delete(device: TDevice) {
    const del = await openConfirmationDialog({
        title: `Delete ${device.name}`,
        subtitle: "Are you sure you want to delete this device?",
        text: "This will remove the device also from ESPHome Builder.",
        danger: true
    });
    if (del)
        showToast(
            () => api.device_delete(device.id),
            [["devices"]],
            "Deleting...",
            "Deleted!",
            "Failed to Delete",
            () => events.emit("Device_Deleted", device.id),
        );
}

export const useDevicesTreeStore = () => {
    return {
        query: useDevicesQuery(),
        expanded: useDeviceExpandedStore(),
        localDevice_create,
        localDevice_addDirectory,
        localDevice_addFile,
        localDevice_import,
        espHome_upload,
        local_renameFoD,
        local_deleteFoD,
        local_toggleEnabled,
        device_delete
    }
};