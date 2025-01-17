import { espHome } from "./esphome";
import { local } from "./local";

export const getTreeData = async () => {
    const esphome_data = await espHome.tryGetDevices();
    const local_data = await local.getDevices();

    const esphome_map = new Map(esphome_data.map((d) => [d.name, d]));
    const local_map = new Map(local_data.map((d) => [d.name, d]));

    const all_names = Array.from(
        new Set(
            esphome_data.map((d) => d.name)
                .concat(local_data.map((d) => d.name)),
        ),
    );

    const data = all_names
        .map((n) => {
            const esphome_device = esphome_map.get(n);
            const local_device = local_map.get(n);
            return {
                ...esphome_device,
                ...local_device,
            };
        })
        .sort((a, b) => a.name!.localeCompare(b.name!));

    return data;
};

export const importEspHomeToLocalDevice = async (device_id: string) => {
    await local.createDevice(device_id);
    const configuration = await espHome.getConfiguration(device_id);
    await local.saveFileContent(device_id, "configuration.yaml", configuration);
}