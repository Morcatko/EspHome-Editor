import { createNanoEvents } from "nanoevents";

interface TEvents {
    File_Created: (device_id: string, path: string) => void;
    File_Deleted: (device_id: string, path: string) => void;
    File_Renamed: (device_id: string, old_path: string, new_path: string) => void;
}

export const events = createNanoEvents<TEvents>();