import { TDeviceInfo } from '../local/manifest-utils';

const ansiRegex = /\\033\[[0-9;]*m/g;

/*
INFO ESPHome 2026.1.4
INFO Reading configuration /config/plc-shift.yaml...¨
INFO Detected timezone 'Etc/UTC'
INFO Starting log output from plc-shift.local using esphome API
INFO Successfully resolved plc-shift.local in 0.009s
INFO Successfully connected to plc-shift @ 192.168.0.232 in 0.032s
INFO Successful handshake with plc-shift @ 192.168.0.232 in 0.017s
[14:46:28.660][I][app:206]: ESPHome version 2026.1.4 compiled on 2026-02-04 15:42:41 +0000
[14:46:28.664][I][app:213]: ESP32 Chip: ESP32-S3 r0.1, 2 core(s)
*/

export const processLogMessage = (
    deviceInfoCollector: TDeviceInfo,
    data: string,
) => {
    const message = data.trim().replaceAll(ansiRegex, '');

    if (message.startsWith('INFO Successfully connected to ')) {
        const ipMatch = message.match(/Successfully connected to .+ @ ([\d\.]+)/);
        if (ipMatch) {
            deviceInfoCollector.ip_address = ipMatch[1];
        }
    } else if (message.indexOf('][I][app:') > -1) {
        const versionMatch = message.match(/ESPHome version ([\d\.]+)/);
        const compiledOnMatch = message.match(/compiled on (.+)/);
        const chipMatch = message.match(/ESP32 Chip: (.+)/);

        if (versionMatch) {
            deviceInfoCollector.esphome_version = versionMatch[1];
        }

        if (compiledOnMatch) {
            deviceInfoCollector.compiled_on = compiledOnMatch[1];
        }

        if (chipMatch) {
            deviceInfoCollector.chip = chipMatch[1];
        }
    }
};
