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

export namespace espHome {
    export const tryGetDevices = async (): Promise<TDevice[]> => {
        const url = `${c.espHomeUrl}/devices`
        log.debug("Getting ESPHome devices", c.espHomeUrl ? url : "skipping - no url");

        if (!c.espHomeUrl)
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

    const getDevice = async (device_id: string) => {
        const device = (await tryGetDevices()).find((d) => d.id === device_id);
        if (!device || !device.esphome_config) {
            throw new Error(`ESPHome Device not found: ${device_id}`);
        }
        return device;
    }

    export const getConfiguration = async (device_id: string) => {
        const device = await getDevice(device_id);
        const url = `${c.espHomeUrl}/edit?configuration=${device.esphome_config}`;
        log.debug("Getting ESPHome configuration", url);
        const response = await fetch(url);
        assertResponseOk(response);
        return await response.text();
    };

    export const saveConfiguration = async (device_id: string, content: string) => {
        const device = await getDevice(device_id);
        const url = `${c.espHomeUrl}/edit?configuration=${device.esphome_config}`;
        log.debug("Saving ESPHome configuration", url);
        const response = await fetch(url, {
            method: "POST",
            body: content,
        });
        assertResponseOk(response);
    }

    export const getPing = async () => {
        const url = `${c.espHomeUrl}/ping`;
        //log.debug("Pinging ESPHome", url);
        const response = await fetch(url);
        return await assertResponseAndJsonOk(response);
    }

    export const stream = async (
        device_id: string,
        path: string,
        spawnParams: Record<string, any> | null,
        onEvent: (event: StreamEvent) => void,
    ) => {
        const device = await getDevice(device_id);
        await esphome_stream(path, { ...spawnParams, configuration: device.esphome_config }, onEvent);
    }
}