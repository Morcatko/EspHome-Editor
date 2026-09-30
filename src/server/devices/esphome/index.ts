import { c } from "@/server/config";
import type { TDevice } from "../types";
import { esphome_stream, type StreamEvent } from "./client";
import { log } from "@/shared/log";
import { assertResponseAndJsonOk, assertResponseOk } from "@/shared/http-utils";
import { EspHomeStreamParser } from "./esphome-stream-parser";
import { getWsClient } from "./ws-client";

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

    log.debug("Getting ESPHome configuration", device.esphome_config);
    const response = await getWsClient().call("devices/get_config", {configuration: device.esphome_config});
    return response;
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

    log.debug("Saving ESPHome configuration", device.esphome_config);
    await getWsClient().call("devices/update_config", {
        configuration: device.esphome_config,
        content: content
    });
}

const deleteDevice = async (device_id: string) => {
    let device = await tryGetDevice(device_id);

    if ((!device || !device.esphome_config)) {
        log.warn("Device not found in ESPHome, cannot delete", device_id);
        return;
    }

    log.debug("Deleting ESPHome device", device.esphome_config);
    await getWsClient().call("devices/delete", { configuration:  device.esphome_config});
}

const getPing = async () => {
    if (!c.espHomeApiUrl)
        return null;

    const url = `${c.espHomeApiUrl}/ping`;
    //log.debug("Pinging ESPHome", url);
    const response = await fetch(url);
    return await assertResponseAndJsonOk(response);
}

export type TStreamEvents = {
    onEvent: (event: StreamEvent) => void;
    onClose?: (code: number) => void;
    onError?: (data: any) => void;
}
const stream = async (
    device_id: string,
    path: string,
    spawnParams: Record<string, any> | null,
    events: TStreamEvents,
    parser?: EspHomeStreamParser
) => {
    const device = await getDevice(device_id);
    const _parser = parser ?? new EspHomeStreamParser(device_id);

    return esphome_stream(
        path,
        { ...spawnParams, configuration: device.esphome_config },
        async (e) => {
            events.onEvent(e);
            await _parser.processLine(e.data);
        },
        events.onClose,
        events.onError);
};

const streamLogs = (device_id: string, events: TStreamEvents, parser?: EspHomeStreamParser) => stream(device_id, "logs", { port: "OTA" }, events, parser);
const streamCompile = (device_id: string, events: TStreamEvents, parser?: EspHomeStreamParser) => stream(device_id, "compile", null, events, parser);
const streamInstall = (device_id: string, events: TStreamEvents, parser?: EspHomeStreamParser) => stream(device_id, "run", { port: "OTA" }, events, parser);

export const espHome = {
    tryGetDevices,
    getConfiguration,
    saveConfiguration,
    deleteDevice,
    getPing,
    streamLogs: (device_id: string, events: TStreamEvents) => streamLogs(device_id, events),
    streamCompile: (device_id: string, events: TStreamEvents) => streamCompile(device_id, events),
    streamInstall: (device_id: string, events: TStreamEvents) => streamInstall(device_id, events),
}