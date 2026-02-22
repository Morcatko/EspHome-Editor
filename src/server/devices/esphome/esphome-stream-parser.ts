import { removeAnsiControlSequences } from "@/shared/string-utils";
import { ManifestUtils, TCompilationResult, TDeviceInfo } from "../local/manifest-utils";

export class EspHomeStreamParser {
    readonly deviceInfo: TDeviceInfo = {
        esphome_version: null,
        chip: null,
        compiled_on: null,
        ip_address: null,
        deviceInfoUpdatedAt: new Date().toISOString(),
    }

    readonly compilationResult: TCompilationResult = {
        success: false,
        compilationResultUpdatedAt: new Date().toISOString(),
    }

    private compilationFinished = false;
    private deviceInfoFinished = false;

    constructor(
        private device_id: string,
    ) { }


    public async processLine(line: string) {
        const message = removeAnsiControlSequences(line);

        if (!this.compilationFinished) {
            if (message === "INFO Successfully compiled program.") {
                this.compilationResult.success = true;
                this.compilationResult.compilationResultUpdatedAt = new Date().toISOString();
                this.compilationFinished = true;
                await ManifestUtils.setCompilationResult(this.device_id, this.compilationResult);
            }
        }
        if (!this.deviceInfoFinished) {
            if (message.startsWith('INFO Successfully connected to ')) {
                const ipMatch = message.match(/Successfully connected to .+ @ ([\d\.]+)/);
                if (ipMatch) {
                    this.deviceInfo.ip_address = ipMatch[1];
                }
            } else if (message.indexOf('][I][app:') > -1) {
                const versionMatch = message.match(/ESPHome version ([\d\.]+)/);
                const compiledOnMatch = message.match(/compiled on (.+)/);
                const chipMatch = message.match(/ESP32 Chip: (.+)/);

                if (versionMatch) {
                    this.deviceInfo.esphome_version = versionMatch[1];
                }

                if (compiledOnMatch) {
                    this.deviceInfo.compiled_on = compiledOnMatch[1];
                }

                if (chipMatch) {
                    this.deviceInfo.chip = chipMatch[1];
                }

                const isCompleted =
                    this.deviceInfo.esphome_version !== null &&
                    this.deviceInfo.chip !== null &&
                    this.deviceInfo.compiled_on !== null &&
                    this.deviceInfo.ip_address !== null;

                if (isCompleted && !this.deviceInfoFinished) {
                    this.deviceInfoFinished = true;
                    await ManifestUtils.setDeviceInfo(this.device_id, this.deviceInfo);
                }
            }


        }

    }
}