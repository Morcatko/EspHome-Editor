import { useAppStores } from "@/app/stores";
import { TDevice } from "@/server/devices/types";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

export const registerDeviceActions = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
    appStores: ReturnType<typeof useAppStores>,
    device: TDevice) => { 

    editor.addAction({
        id: "editor4esphome.upload",
        label: "Upload to ESPHome",
        contextMenuGroupId: "esphome",
        contextMenuOrder: 0,
        keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: async () => await appStores.devices.espHome_upload(device)
    });

    editor.addAction({
        id: "editor4esphome.upload_and_install",
        label: "Upload & Install to device",
        contextMenuGroupId: "esphome",
        contextMenuOrder: 1,
        keybindings: [ monaco.KeyCode.F6],
        run: async () => {
            await appStores.devices.espHome_upload(device);
            appStores.panels.addDevicePanel("floating", device.id, "esphome_compile");
        }
    });
};