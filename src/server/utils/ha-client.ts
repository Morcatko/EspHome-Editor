import { haToken, haUrl } from "../config"

export const getAddons = async () => {
    const response = await fetch(`${haUrl}/${"addons"}`,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )

    const responseJson = await response.json()
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Compiler");

    const slug = espHomeAddon.slug;
    console.log(espHomeAddon);
}

export const getEspHomeUrl = async () => {
    const response = await fetch(`${haUrl}/${"discovery"}`,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )

    const responseJson = await response.json()
    const discoveries = responseJson.data.discovery as any[];
    const espHomeDiscovery = discoveries.find(a => a.service === "esphome");

    const config = espHomeDiscovery.config;
    return `http://${config.host}:${config.port}`;
}