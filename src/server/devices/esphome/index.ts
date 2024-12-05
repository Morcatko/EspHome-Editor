import { c } from "@/server/config";
import type { TDevice } from "../types";
import { esphome_stream, type StreamEvent } from "./client";
import { log } from "@/shared/log";

type TEspHomeDevice = {
    name: string;
    friendly_name: string;
    configuration: string;
};

type TEspHomeDevicesResponse = {
    configured: TEspHomeDevice[];
    importable: any;
};

export namespace espHome {
    export const tryGetDevices = async (): Promise<TDevice[]> => {
        const url = `${c.espHomeUrl}/devices`
        log.debug("Getting ESPHome devices", c.espHomeUrl ? url : "skipping - no url");

        if (!c.espHomeUrl)
            return [];

        try {
            const devicesResponse: TEspHomeDevicesResponse =
                await (await fetch(url)).json();
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

    const getDevice = async (device_id: string) =>
        (await tryGetDevices()).find((d) => d.id === device_id);

    export const getConfiguration = async (device_id: string) => {
        const device = await getDevice(device_id);
        const url = `${c.espHomeUrl}/edit?configuration=${device.esphome_config}`;
        log.debug("Getting ESPHome configuration", url);
        const response = await fetch(url);
        return await response.text();
    };

    export const saveConfiguration = async (device_id: string, content: string) => {
        const device = await getDevice(device_id);
        const url = `${c.espHomeUrl}/edit?configuration=${device.esphome_config}`;
        log.debug("Saving ESPHome configuration", url);
        await fetch(url, {
            method: "POST",
            body: content,
        });
    }

    export const stream = (
        device_id: string,
        path: string,
        spawnParams: Record<string, any> | null,
        onEvent: (event: StreamEvent) => void,
    ) => esphome_stream(path, { ...spawnParams, configuration: device_id }, onEvent);
}