import fs from 'node:fs/promises';
import { directoryExists } from "./server/utils/dir-utils";
import { log } from "./shared/log";
import { c, initConfig } from './server/config';

export async function init() {
    log.info("Initializing...");

    await initConfig();

    if (!await directoryExists(c.devicesDir)) {
        log.info('Creating devices directory');
        await fs.mkdir(c.devicesDir);
    }
    if (!await directoryExists(c.devicesDir + "/.lib"))
    {
        log.info('Creating .lib directory');
        await fs.mkdir(c.devicesDir + "/.lib");    
    }

    log.info("Config:", {
        devicesDir: c.devicesDir,
        espHomeUrl: c.espHomeUrl,
        version: c.version,
    });

    log.success("Initialization complete");
}
