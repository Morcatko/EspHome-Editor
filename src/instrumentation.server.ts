import fs from 'node:fs/promises';

import { devicesDir, espHomeUrl, workFolder } from "./server/config";
import { directoryExists } from "./server/utils/dir-utils";
import { log } from "./shared/log";

export async function init() {
    log.info('Config:', { 
        WORK_FOLDER: workFolder,
        DEVICES_DIR: devicesDir,
        ESPHOME_URL: espHomeUrl });
        
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
}
