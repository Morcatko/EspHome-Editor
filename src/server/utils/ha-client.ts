import { assertResponseAndJsonOk } from "@/shared/http-utils";
import { log } from "@/shared/log";

const ha_getJson = async (haUrl: string, haToken: string, path: string) => {
    const url = `${haUrl}/${path}`;
    log.debug("Fetching", url);
    const response = await fetch(url,
        {
            headers: {
                Authorization: `Bearer ${haToken}`
            }
        }
    )
    return await assertResponseAndJsonOk(response);
}

const getAddonPortViaAddonInfo = async (haUrl: string, haToken: string, addonSlug: string) => {
    const addon = await ha_getJson(haUrl, haToken, `addons/${addonSlug}/info`);
    return addon.data.ingress_port;
}


const getEspHomeViaAddons = async (haUrl: string, haToken: string) => {
    const responseJson = await ha_getJson(haUrl, haToken, "addons");
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Builder")
        || addons.find(a => a.name === "ESPHome Device Compiler")
        || addons.find(a => a.url === "https://esphome.io/");
    
    const port = getAddonPortViaAddonInfo(haUrl, haToken, espHomeAddon.slug);
    
    return {
        slug: espHomeAddon.slug,
        port: port,
    }
}

/*
Discovery does not work, because it requries the caller to be "Home Assistant" itself
const getEspHomeViaDiscovery = async (haUrl: string, haToken: string) => {
    const responseJson = await ha_getJson(haUrl, haToken, "discovery");
    const discoveries = responseJson.data.discovery as any[];
    const espHomeDiscovery = discoveries.find(a => a.service === "esphome");
    return null;
}*/

const getEspHomeViaSupervisorInfo = async (haUrl: string, haToken: string) => {
    const responseJson = await ha_getJson(haUrl, haToken, "supervisor/info");
    const addons = responseJson.data.addons as any[];
    const espHomeAddon = addons.find(a => a.name === "ESPHome Device Builder")
        || addons.find(a => a.name === "ESPHome Device Compiler");

    const port = await getAddonPortViaAddonInfo(haUrl, haToken, espHomeAddon.slug);

    return {
        slug: espHomeAddon.slug,
        port: port,
    };
}

const getEspHomeAddon = async (haUrl: string, haToken: string) => {
    try {
        log.debug("Getting ESPHome addon via supervisor info");
        return await getEspHomeViaSupervisorInfo(haUrl, haToken);
    } catch (e) {
        log.error("Error getting ESPHome addon via supervisor info", e);
    }
    
    /*try {
        return await getEspHomeViaAddons(haUrl, haToken);
    } catch (e) {
        log.error("Error getting ESPHome addon via addons", e);
    }*/

    return null;
}

export const getEspHomeUrls = async (haUrl: string, haToken: string) => {
    log.debug("Getting ESPHome URL");
    const addonInfo = await getEspHomeAddon(haUrl, haToken);
    if (addonInfo) {
        const port = addonInfo.port;
        return {
            apiUrl: `http://localhost:${port}`,
            webUrl: `/${addonInfo.slug}`
        };
    }
    log.error("Failed to get ESPHome URLs, no addon info found");
    return null;
}