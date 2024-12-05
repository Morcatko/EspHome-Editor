import { log } from "@/shared/log";

const supervisor_getJson = async (haUrl: string, haToken: string, path: string) => {
    const url = `${haUrl}/${path}`;
    log.info("Fetching", url, `Bearer ${haToken}`);
    const response = await fetch(url,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )
    if (!response.ok) {
        log.info("call", url, response.status,  await response.text());
        throw new Error("Failed to call home assistant");
    }
        
    return await response.json();
}

const findEspHomeAddon = async (haUrl: string, haToken: string) => {
    const responseJson = await supervisor_getJson(haUrl, haToken, "addons");
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Compiler");
    log.info(espHomeAddon);
    return espHomeAddon;
}

const getDiscovery = async (haUrl: string, haToken: string) => {
    const responseJson = await supervisor_getJson(haUrl, haToken, "discovery");
    log.info("discovery", responseJson);
    const discoveries = responseJson.data.discovery as any[];
    const espHomeDiscovery = discoveries.find(a => a.service === "esphome");

    const config = espHomeDiscovery.config;
    return `http://${config.host}:${config.port}`;
}

export const getEspHomeUrl = async (haUrl: string, haToken: string) => {
    log.info("Getting ESPHome URL");
    try {
        const path = await getDiscovery(haUrl, haToken);
        log.info("discovery path", path);        
    } catch (e) {
        log.error(e);
    }

    try {
        const espHomeAddon = await findEspHomeAddon(haUrl, haToken);
        const espHomeSlug = espHomeAddon.slug;

        const addon = await supervisor_getJson(haUrl, haToken, `addons/${espHomeSlug}/info`);
        log.info("addon", addon);
        const port = addon.data.ingress_port
        const path = `http://localhost:${port}`
        log.info("addon path", path);
        return path;
    } catch (e) {
        log.error(e);
    }

    return "not found";    
}