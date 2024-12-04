import { haToken, haUrl } from "../config"

const supervisor_getJson = async (path: string) => {
    const url = `${haUrl}/${path}`;
    console.log("Fetching", url)
    console.log("Token",  `Bearer ${haToken}`)
    const response = await fetch(url,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )
    if (!response.ok) {
        console.log("call", url, response.status,  await response.text());
        throw new Error("Failed to call home assistant");
    }
        
    return await response.json();
}

const findEspHomeAddon = async () => {
    const responseJson = await supervisor_getJson("addons");
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Compiler");
    console.log(espHomeAddon);
    return espHomeAddon;
}

const getDiscovery = async () => {
    const responseJson = await supervisor_getJson("discovery");

    const discoveries = responseJson.data.discovery as any[];
    const espHomeDiscovery = discoveries.find(a => a.service === "esphome");

    const config = espHomeDiscovery.config;
    return `http://${config.host}:${config.port}`;
}

export const getEspHomeUrl = async () => {
    const espHomeAddon = await findEspHomeAddon();
    const espHomeSlug = espHomeAddon.slug;

    const addon = await supervisor_getJson(`addons/${espHomeSlug}/info`);
    console.log("addon", addon);
    const port = addon.data.ingress_port
    return `http://localhost:${port}`;
}