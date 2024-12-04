"use client";
import { TDevice, TLocalFileOrDirectory } from "@/server/devices/types";
import { makeAutoObservable, runInAction } from "mobx";
import toast from "react-hot-toast";
import { type AsyncState } from "./utils";
import { api } from "../utils/api-client";
import { type RootStore } from ".";

export class DevicesStore {
    public devices: TDevice[] = [];
    public asyncState: AsyncState = "none";

    readonly expanded = new class {
        private readonly expanded: string[] = [];
        constructor() {
            makeAutoObservable(this);
            if (typeof window !== "undefined") {
                this.expanded = JSON.parse(
                    localStorage.getItem("devices.expanded") || "[]",
                );
            }
        }
        public get(id: string) {
            return this.expanded.includes(id);
        }
        public set(id: string, expanded: boolean) {
            if (expanded) {
                this.expanded.push(id);
            } else {
                this.expanded.splice(this.expanded.indexOf(id), 1);
            }
            localStorage.setItem(
                "devices.expanded",
                JSON.stringify(this.expanded),
            );
        }
    }();

    constructor(private readonly rootStore: RootStore) {
        makeAutoObservable(this);
    }

    public async reload(silent: boolean) {
        if (!silent) {
            this.asyncState = "loading";
        }
        const json = await api.callGet_json<TDevice[]>("/api/device");
        runInAction(() => {
            this.asyncState = "loaded";
            this.devices = json;
        });
    }

    public async loadIfNeeded() {
        if ((this.asyncState === "none") || (this.asyncState === "error")) {
            await this.reload(false);
        }
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
