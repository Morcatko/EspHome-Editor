"use client";
import { TDevice } from "@/server/devices/types";
import { api } from "../utils/api-client";
import { useQuery } from "@tanstack/react-query";

export const useDevicesQuery = () =>
    useQuery({
        queryKey: ["devices"],
        queryFn: async () => api.callGet_json<TDevice[]>("/api/device")
    });

export const useDevice = (device_id?: string) => {
    const devices = useDevicesQuery().data;
    const device = devices?.find(d => d.id === device_id);
    return device;
}

export const useDevicesStore2 = () => {
    console.log("useDevicesStore2");
    const devicesQuery = useDevicesQuery();
    const devices = (devicesQuery.data ?? [])
        .map(d => ({
            device: d,
            compileStreamUrl: api.url_esphome_compile(d.id),
        }));

    return {
        query: devicesQuery,
        devices: devices,
        findDevice: (device_id: string) => devices.find(d => d.device.id === device_id),
    };
}