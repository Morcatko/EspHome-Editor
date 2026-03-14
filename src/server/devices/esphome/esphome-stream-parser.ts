import { removeAnsiControlSequences } from "@/shared/string-utils";
import { ManifestUtils, TCompilationInfo, TDeviceInfo } from "../local/manifest-utils";

export class EspHomeStreamParser {
    readonly deviceInfo: TDeviceInfo = {
        esphome_version: null,
        chip: null,
        compiled_on: null,
        ip_address: null,
        _updated_at: new Date(),
    }

    readonly compilationInfo: TCompilationInfo = {
        status: "running",
        _updated_at: new Date(),
    }

    public compilationInfoFinished = false;
    public deviceInfoFinished = false;

    constructor(
        private device_id: string,
    ) { }

    private async setCompilationInfo(status: TCompilationInfo["status"], finished: boolean) {
        this.compilationInfo._updated_at = new Date();
        this.compilationInfo.status = status;
        this.compilationInfoFinished = finished;
        return ManifestUtils.setCompilationInfo(this.device_id, this.compilationInfo);
    }

    public async processLine(line: string) {
        const message = removeAnsiControlSequences(line);

        if (!this.compilationInfoFinished) {
            if (message.startsWith("INFO Generating C++ source...")) {
                await this.setCompilationInfo("running", false);
            } else  if (message === "Failed config") {
                await this.setCompilationInfo("failed", true);
            } else if (message.startsWith("========================== [FAILED] Took ")) {
                await this.setCompilationInfo("failed", true);

            } else if (message === "INFO Successfully compiled program.") {
                // message.startsWith("========================= [SUCCESS] Took ")
                await this.setCompilationInfo("success",true);
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
                    this.deviceInfo.compiled_on = new Date(compiledOnMatch[1]);
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
                    this.deviceInfo._updated_at = new Date();
                    this.deviceInfoFinished = true;
                    await ManifestUtils.setDeviceInfo(this.device_id, this.deviceInfo);
                }
            }
        }
    }
}