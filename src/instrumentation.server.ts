import fs from 'node:fs/promises';

import { devicesDir, espHomeUrl, haToken, haUrl, workFolder } from "./server/config";
import { directoryExists } from "./server/utils/dir-utils";
import { log } from "./shared/log";
import { getEspHomeUrl } from './server/utils/ha-client';

export async function init() {
    log.info('Config:', { 
        WORK_FOLDER: workFolder,
        DEVICES_DIR: devicesDir,
        ESPHOME_URL: espHomeUrl,
        HA_URL: haUrl,
        HA_TOKEN: haToken
     });
        
    log.info('Initializing...');
    if (!await directoryExists(devicesDir)) {
        log.fatal('Devices directory does not exist:', devicesDir);
        return;
    }
    if (!await directoryExists(devicesDir + "/.lib"))
    {
        log.info('Creating .lib directory');
        await fs.mkdir(devicesDir + "/.lib");    
    }

    log.success('Initialization complete');

    console.log('ESPHome Url', await getEspHomeUrl());
}
