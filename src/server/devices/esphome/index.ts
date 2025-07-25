import { c } from "@/server/config";
import type { TDevice } from "../types";
import { esphome_stream, type StreamEvent } from "./client";
import { log } from "@/shared/log";
import { assertResponseAndJsonOk, assertResponseOk } from "@/shared/http-utils";

type TEspHomeDevice = {
    name: string;
    friendly_name: string;
    configuration: string;
};

type TEspHomeDevicesResponse = {
    configured: TEspHomeDevice[];
    importable: any;
};

const tryGetDevices = async (): Promise<TDevice[]> => {
    const url = `${c.espHomeApiUrl}/devices`
    log.debug("Getting ESPHome devices", c.espHomeApiUrl ? url : "skipping - no url");

    if (!c.espHomeApiUrl)
        return [];

    try {
        const devicesResponse = await assertResponseAndJsonOk<TEspHomeDevicesResponse>(await fetch(url))

        return devicesResponse
            .configured
            .map((d) => <TDevice>({
                id: d.name,
                name: d.name,
                files: null,
                type: "device",
                esphome_config: d.configuration,
            }));
    }
    catch (e) {
        log.error("Failed to get ESPHome devices", e);
        return [];
    }
};

const tryGetDevice = async (device_id: string) =>
    (await tryGetDevices()).find((d) => d.id === device_id);

const getDevice = async (device_id: string) => {
    const device = await tryGetDevice(device_id);
    if (!device || !device.esphome_config) {
        throw new Error(`ESPHome Device not found: ${device_id}`);
    }
    return device;
}

const getConfiguration = async (device_id: string) => {
    const device = await getDevice(device_id);
    const url = `${c.espHomeApiUrl}/edit?configuration=${device.esphome_config}`;
    log.debug("Getting ESPHome configuration", url);
    const response = await fetch(url);
    assertResponseOk(response);
    return await response.text();
};

const saveConfiguration = async (device_id: string, content: string) => {
    let device = await tryGetDevice(device_id);

    if ((!device || !device.esphome_config)) {
        log.info("Device not found in ESPHome, creating", device_id);
        //Create device in ESPHome
        await fetch(`${c.espHomeApiUrl}/wizard`, {
            method: "POST",
            body: JSON.stringify({
                ssid: "!secret wifi_ssid",
                psk: "!secret wifi_password",
                name: device_id,
                board: "esp32-s3-devkitc-1"
            })
        });
        device = await getDevice(device_id.toLowerCase());
    }

    //Create device if it does not exist???
    const url = `${c.espHomeApiUrl}/edit?configuration=${device.esphome_config}`;
    log.debug("Saving ESPHome configuration", url);
    const response = await fetch(url, {
        method: "POST",
        body: content,
    });
    assertResponseOk(response);
}

const deleteDevice = async (device_id: string) => {
    let device = await tryGetDevice(device_id);

    if ((!device || !device.esphome_config)) {
        log.warn("Device not found in ESPHome, cannot delete", device_id);
        return;
    }

    const url = `${c.espHomeApiUrl}/delete?configuration=${device.esphome_config}`
    log.debug("Deleting ESPHome device", url);
    const response = await fetch(url, {
        method: "POST",
    });
    assertResponseOk(response);
}

const getPing = async () => {
    if (!c.espHomeApiUrl)
        return null;

    const url = `${c.espHomeApiUrl}/ping`;
    //log.debug("Pinging ESPHome", url);
    const response = await fetch(url);
    return await assertResponseAndJsonOk(response);
}

const stream = async (
    device_id: string,
    path: string,
    spawnParams: Record<string, any> | null,
    onEvent: (event: StreamEvent) => void,
    onClose: (code: number) => void,
    onError: (data: any) => void,
) => {
    const device = await getDevice(device_id);
    return esphome_stream(
        path,
        { ...spawnParams, configuration: device.esphome_config },
        onEvent,
        onClose,
        onError);
}

export const espHome = {
    tryGetDevices,
    getConfiguration,
    saveConfiguration,
    deleteDevice,
    getPing,
    stream,
}