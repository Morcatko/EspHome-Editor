"use client";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import toast from "react-hot-toast";
import { api } from "../utils/api-client";
import { queryClient, rootStore, type RootStore } from ".";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useMemo } from "react";

const useDeviceExpandedStore = () => {
    const [value, setValue] = useLocalStorage<string[]>('devices.expanded', [], {
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

async function localDevice_addDirectory(device: TDevice, parent_path: string) {
    const directory_name = await rootStore.inputTextDialog.tryShowModal({
        title: "Create new directory",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "new directory",
    });

    if (directory_name) {
        await toast.promise(
            (async () => {
                await api.local_createDirectory(device.id, parent_path + "/" + directory_name,);
                await queryClient.invalidateQueries({ queryKey: ["devices"]});
            })(),
            {
                loading: "Creating...",
                success: "Created!",
                error: "Failed to create",
            },
        );
    }
}

async function localDevice_addFile(device: TDevice, parent_path: string) {
    const file_name = await rootStore.inputTextDialog.tryShowModal({
        title: "Create new file",
        subtitle: `${device.name} - ${parent_path}/`,
        defaultValue: "newfile.yaml",
    });

    if (file_name) {
        await toast.promise(
            (async () => {
                await api.local_save(device.id, parent_path + "/" + file_name, "");
                await queryClient.invalidateQueries({ queryKey: ["devices"]});
            })(),
            {
                loading: "Creating...",
                success: "Created!",
                error: "Failed to create",
            },
        );
    }
}

async function localDevice_import(device: TDevice) {
    await toast.promise(
        (async () => { 
            await api.callPost(api.url_device(device.id, "local"), null);
            await queryClient.invalidateQueries({ queryKey: ["devices"]});
        })(),
        {
            loading: null,
            success: "Created!",
            error: "Failed to create",
        },
    );
}

async function espHome_upload(device: TDevice) {
    await toast.promise(
        (async () => {
            await api.callPost(api.url_device(device.id, "esphome"), null);
            await queryClient.invalidateQueries({ queryKey: ["device", device.id, "esphome"]});
        })(),
        {
            loading: null,
            success: "Uploaded!",
            error: "Failed to upload",
        },
    );
}

async function local_renameFoD(device: TDevice, file: TLocalFileOrDirectory) {
    const newName = await rootStore.inputTextDialog.tryShowModal({
        title: "Rename",
        subtitle: `${device.name} - ${file.path}`,
        defaultValue: file.name,
    });

    if (newName) {
        await toast.promise(
            (async () => {
                await api.local_rename(device.id, file.path, newName);
                await queryClient.invalidateQueries({ queryKey: ["devices"]});
            })(),
            {
                loading: "Renaming...",
                success: "Renamed!",
                error: "Failed to rename",
            },
        );
    }
}

async function local_deleteFoD(device: TDevice, file: TLocalFileOrDirectory) {
    const del = await rootStore.confirmationDialog.tryShowModal({
        title: "Delete",
        subtitle: `${device.name} - ${file.path}`,
        text: "Are you sure you want to delete this file or directory?",
    });
    if (del) {
        toast.promise(
            (async () => {
                await api.local_delete(device.id, file.path);
                await queryClient.invalidateQueries({ queryKey: ["devices"]});
            })(),
            {
                loading: "Deleting...",
                success: "Deleted!",
                error: "Failed to delete",
            },
        );
    }
}

export const useDevicesStore = () => {
    //const queryClient = useQueryClient();
    const devicesQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => api.callGet_json<TDevice[]>("/api/device")
    });

    return {
        expanded: useDeviceExpandedStore(),
        query: devicesQuery,
        localDevice_addDirectory,
        localDevice_addFile,
        localDevice_import,
        espHome_upload,
        local_renameFoD,
        local_deleteFoD
    }
};
