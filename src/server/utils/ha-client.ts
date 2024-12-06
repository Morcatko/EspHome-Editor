import { assertResponseAndJsonOk } from "@/shared/http-utils";
import { log } from "@/shared/log";

const ha_getJson = async (haUrl: string, haToken: string, path: string) => {
    const url = `${haUrl}/${path}`;
    log.info("Fetching", url, `Bearer ${haToken}`);
    const response = await fetch(url,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )
    return await assertResponseAndJsonOk(response);
}

const findEspHomeAddon = async (haUrl: string, haToken: string) => {
    const responseJson = await ha_getJson(haUrl, haToken, "addons");
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Compiler");
    //log.info(espHomeAddon);
    return espHomeAddon;
}

// const getDiscovery = async (haUrl: string, haToken: string) => {
//     const responseJson = await ha_getJson(haUrl, haToken, "discovery");
//     log.info("discovery", responseJson);
//     const discoveries = responseJson.data.discovery as any[];
//     const espHomeDiscovery = discoveries.find(a => a.service === "esphome");

//     const config = espHomeDiscovery.config;
//     return `http://${config.host}:${config.port}`;
// }

export const getEspHomeUrl = async (haUrl: string, haToken: string) => {
    log.info("Getting ESPHome URL");
    try {
        const espHomeAddon = await findEspHomeAddon(haUrl, haToken);
        const espHomeSlug = espHomeAddon.slug;

        const addon = await ha_getJson(haUrl, haToken, `addons/${espHomeSlug}/info`);
        const port = addon.data.ingress_port
        return `http://localhost:${port}`;
    } catch (e) {
        log.error("Error finding ESPHome addon", e);
    }
    return null;    
}