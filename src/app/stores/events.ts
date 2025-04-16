import { TLocalFileOrDirectory } from "@/server/devices/types";
import { createNanoEvents } from "nanoevents";

interface TEvents {
    File_Created: (device_id: string, path: string) => void;
    FoD_Deleted: (device_id: string, fod: TLocalFileOrDirectory) => void;
    FoD_Renamed: (device_id: string, fod: TLocalFileOrDirectory, new_path: string) => void;
    Device_Deleted: (device_id: string) => void;
}

export const events = createNanoEvents<TEvents>();