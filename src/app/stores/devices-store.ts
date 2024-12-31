"use client";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import toast from "react-hot-toast";
import { api } from "../utils/api-client";
import { type RootStore } from ".";
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

export const useDevicesStore = () => {
    //const queryClient = useQueryClient();
    const devicesQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => api.callGet_json<TDevice[]>("/api/device")
    });

    return {
        expanded: useDeviceExpandedStore(),
        query: devicesQuery,
    }
};

export class DevicesStore {
    constructor(private readonly rootStore: RootStore) {
    }

    public async reload(silent: boolean) {
    }

    public async localDevice_import(device: TDevice) {
        await toast.promise(
            (async () => { 
                await api.callPost(api.url_device(device.id, "local"), null);
                await this.reload(true);
            })(),
            {
                loading: null,
                success: "Created!",
                error: "Failed to create",
            },
        );
    }

    public async espHome_upload(device: TDevice) {
        await toast.promise(
            (async () => {
                await api.callPost(api.url_device(device.id, "esphome"), null);
                await this.reload(true);
            })(),
            {
                loading: null,
                success: "Uploaded!",
                error: "Failed to upload",
            },
        );
    }

    public async localDevice_addDirectory(device: TDevice, parent_path: string) {
        const directory_name = await this.rootStore.inputTextDialog.tryShowModal({
            title: "Create new directory",
            subtitle: `${device.name} - ${parent_path}/`,
            defaultValue: "new directory",
        });

        if (directory_name) {
            await toast.promise(
                (async () => {
                    await api.local_createDirectory(device.id, parent_path + "/" + directory_name,);
                    await this.reload(true);
                })(),
                {
                    loading: "Creating...",
                    success: "Created!",
                    error: "Failed to create",
                },
            );
        }
    }

    public async localDevice_addFile(device: TDevice, parent_path: string) {
        const file_name = await this.rootStore.inputTextDialog.tryShowModal({
            title: "Create new file",
            subtitle: `${device.name} - ${parent_path}/`,
            defaultValue: "newfile.yaml",
        });

        if (file_name) {
            await toast.promise(
                (async () => {
                    await api.local_save(device.id, parent_path + "/" + file_name, "");
                    await this.reload(true);
                })(),
                {
                    loading: "Creating...",
                    success: "Created!",
                    error: "Failed to create",
                },
            );
        }
    }

    public async local_renameFoD(device: TDevice, file: TLocalFileOrDirectory) {
        const newName = await this.rootStore.inputTextDialog.tryShowModal({
            title: "Rename",
            subtitle: `${device.name} - ${file.path}`,
            defaultValue: file.name,
        });

        if (newName) {
            await toast.promise(
                (async () => {
                    await api.local_rename(device.id, file.path, newName);
                    await this.reload(true);
                })(),
                {
                    loading: "Renaming...",
                    success: "Renamed!",
                    error: "Failed to rename",
                },
            );
        }
    }

    public async local_deleteFoD(device: TDevice, file: TLocalFileOrDirectory) {
        const del = await this.rootStore.confirmationDialog.tryShowModal({
            title: "Delete",
            subtitle: `${device.name} - ${file.path}`,
            text: "Are you sure you want to delete this file or directory?",
        });
        if (del) {
            toast.promise(
                (async () => {
                    await api.local_delete(device.id, file.path);
                    await this.reload(true);
                })(),
                {
                    loading: "Deleting...",
                    success: "Deleted!",
                    error: "Failed to delete",
                },
            );
        }
    }
}
