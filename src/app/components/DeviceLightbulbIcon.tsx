import { LightBulbIcon } from "@primer/octicons-react";
import { useDevicesColor } from "../stores/devices-store";
import { TDevice } from "@/server/devices/types";

export const DeviceLightbulbIcon = ({ device }: { device: TDevice }) => {
    const { getDeviceColor } = useDevicesColor();
    return <LightBulbIcon fill={getDeviceColor(device)} />;
}