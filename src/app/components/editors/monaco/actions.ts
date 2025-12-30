import { useAppStores } from "@/app/stores";
import { useDevice } from "@/app/stores/devices-store";
import { TDevice } from "@/server/devices/types";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

type TEditor = editor.IStandaloneDiffEditor | editor.IStandaloneCodeEditor

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
        //keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: async () => await appStores.devices.espHome_upload(device)
    });

    editor.addAction({
        id: "editor4esphome.upload_and_compile",
        label: "Upload to ESPHome & Compile",
        contextMenuGroupId: "esphome",
        contextMenuOrder: 1,
        //keybindings: [monaco.KeyCode.F6],
        run: async () => {
            await appStores.devices.espHome_upload(device);
            appStores.panels.addDevicePanel("floating", device.id, "esphome_compile");
        }
    });
};

export const useMonacoActions = (device_id?: string) => {
    const appStores = useAppStores();
    const device = useDevice(device_id);

    const onMount = (editor: TEditor, monaco: Monaco) => {
        if (!device) return;

        const originalEditor = (editor as editor.IStandaloneDiffEditor).getOriginalEditor?.();
        const modifiedEditor = (editor as editor.IStandaloneDiffEditor).getModifiedEditor?.();
        if (originalEditor && modifiedEditor) {
            registerDeviceActions(originalEditor, monaco, appStores, device!);
            registerDeviceActions(modifiedEditor, monaco, appStores, device!);
        }
        else
            registerDeviceActions(editor as editor.IStandaloneCodeEditor, monaco, appStores, device!);
    }

    return {
        onMount
    };
}