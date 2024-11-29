import { TDevice } from "@/server/devices/types";

export interface IPanelsStore {
     device: TDevice;
     dataPath: string;

     loadIfNeeded(): Promise<void>;
}