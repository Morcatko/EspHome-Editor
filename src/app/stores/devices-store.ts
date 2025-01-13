"use client";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import toast from "react-hot-toast";
import { api } from "../utils/api-client";
import { queryClient, rootStore } from ".";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { useCallback } from "react";

const useDeviceExpandedStore = () => {
    const [value, setValue] = useLocalStorage<string[]>('e4e.devices.expanded', [], {
        serializer: JSON.stringify,
        deserializer: JSON.parse,
    });

    return {
        get: useCallback((id: string) => value.includes(id), [value]),
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
    error: string | null) {
    await toast.promise(
        (async () => {
            await call();
            for (const invalidateKey of invalidateKeys) {
                await queryClient.invalidateQueries({ queryKey: invalidateKey });
            }
        })(),
        {
            loading: loading,
            success: success,
            error: error,
        },
    );
}

async function localDevice_create() {
    const device_name = await rootStore.inputTextDialog.tryShowModal({
        title: "Add new device",
        subtitle: "Enter device name",
        defaultValue: "new-device",
    });

    if (device_name)
        await showToast(
            () => api.local_createDevice(device_name),
            [["devices"]],
            "Creating...",
            "Created!",
            "Failed to create",
        );
}

async function localDevice_addDirectory(device: TDevice, parent_path: string) {
    const directory_name = await rootStore.inputTextDialog.tryShowModal({
        title: "Create new directory",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "new directory",
    });

    if (directory_name)
        await showToast(
            () => api.local_createDirectory(device.id, parent_path + "/" + directory_name),
            [["devices"]],
            "Creating...",
            "Created!",
            "Failed to create",
        );
}

async function localDevice_addFile(device: TDevice, parent_path: string) {
    const file_name = await rootStore.inputTextDialog.tryShowModal({
        title: "Create new file",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "newfile.yaml",
    });

    if (file_name)
        await showToast(
            () => api.local_save(device.id, parent_path + "/" + file_name, ""),
            [["devices"]],
            "Creating...",
            "Created!",
            "Failed to create",
        );
}

async function localDevice_import(device: TDevice) {
    await showToast(
        () => api.local_importDevice(device.id),
        [["devices"]],
        "Creating...",
        "Created!",
        "Failed to create",
    );
}

async function espHome_upload(device: TDevice) {

    await showToast(
        () => api.callPost(api.url_device(device.id, "esphome"), null),
        [["device", device.id, "esphome"], device.esphome_config ? ["devices"] : []],
        "Uploading...",
        "Uploaded!",
        "Failed to upload",
    );
}

async function local_renameFoD(device: TDevice, file: TLocalFileOrDirectory) {
    const newName = await rootStore.inputTextDialog.tryShowModal({
        title: "Rename",
        subtitle: `${device.name} - ${file.path}`,
        defaultValue: file.name,
    });

    if (newName)
        await showToast(
            () => api.local_rename(device.id, file.path, newName),
            [["devices"]],
            "Renaming...",
            "Renamed!",
            "Failed to rename",
        );
}

async function local_deleteFoD(device: TDevice, file: TLocalFileOrDirectory) {
    const del = await rootStore.confirmationDialog.tryShowModal({
        title: "Delete",
        subtitle: `${device.name} - ${file.path}`,
        text: "Are you sure you want to delete this file or directory?",
        confirmButtonColor: "danger",
    });
    if (del)
        showToast(
            () => api.local_delete(device.id, file.path),
            [["devices"]],
            "Deleting...",
            "Deleted!",
            "Failed to delete",
        );
}

export const useDevicesStore = () => {
    const devicesQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => api.callGet_json<TDevice[]>("/api/device")
    });

    return {
        expanded: useDeviceExpandedStore(),
        query: devicesQuery,
        localDevice_create,
        localDevice_addDirectory,
        localDevice_addFile,
        localDevice_import,
        espHome_upload,
        local_renameFoD,
        local_deleteFoD
    }
};
