import Image from 'next/image';
import { color_esphome, color_gray, color_local, color_offline, color_online } from "@/app/utils/const";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";
import map from "@/assets/onboarding/map.png";
import type { TPage } from '.';
import { Code, Heading, Section, Ul } from './components';
import { Button } from '@mui/joy';

type THomeProps = {
    onCLick: (page: TPage) => void;
}

export const Home = (props: THomeProps) => {
    return (<>
        <Heading
            title="Welcome to the Editor for ESPHome"
            subtitle="Get started with the Editor for ESPHome to easily build and manage devices by writing or generating YAML files." />

        <Section step="device_status" title="Understanding Device Status">
            <p>
                On the Devices Panel, you'll see all your ESPHome devices. The status of each device is indicated by the color of the light bulb
            </p>
            <Ul>
                <li><span style={{ color: color_gray }} className="font-semibold">Gray</span> - Editor-only device</li>
                <li><span style={{ color: color_online }} className="font-semibold">Online</span>/<span style={{ color: color_offline }} className="font-semibold">Offline</span> - status of ESPHome device</li>
            </Ul>
        </Section>

        <Section step="device_toolbar" title="Device Toolbar">
            <p>
                Expand a device to access its toolbar. (Available actions depend on the device status)
            </p>
            <ul className="mt-4 ml-8 space-y-3">
                <li><DownloadIcon className="inline mr-2" fill={color_local} /> Import configuration from ESPHome instance</li>
                <li><CodeIcon className="inline mr-2" fill={color_local} /> View the compiled local ESPHome configuration</li>
                <li><GitCompareIcon className="inline mr-2" fill={color_gray} /> Compare local vs. ESPHome configuration</li>
                <li><UploadIcon className="inline mr-2" fill={color_gray} /> Upload local configuration to ESPHome</li>
                <li><CodeIcon className="inline mr-2" fill={color_esphome} /> View ESPHome configuration</li>
                <li><BeakerIcon className="inline mr-2" fill={color_esphome} /> Compile ESPHome configuration</li>
                <li><UploadIcon className="inline mr-2" fill={color_esphome} /> Install configuration to a device</li>
                <li><LogIcon className="inline mr-2" fill={color_esphome} /> View log stream</li>
            </ul>
        </Section>

        <Section step="yaml" title="How YAML Configurations Work">
            <p>
                The final YAML configuration is a combination of multiple YAML files.
            </p>
            <Image className='dark:invert' src={map} alt="etajs template" unoptimized style={{ margin: '-30px' }} />
            <Ul>
                <li>Use the <Code>.lib</Code> folder for shared code, with optional device-specific local <Code>.lib</Code> folders.</li>
                <li>The compiler processes all <Code>.eta</Code> files in the device folder, converting them into <Code>.yaml</Code> files.</li>
                <li>It merges manually created <Code>.yaml</Code> files and compiled <Code>.yaml</Code> files into a single final configuration file.</li>
            </Ul>
        </Section>

        <Section step="getting_Started" title="Getting Started">
            <p>
                Let�s try building your first configuration. Choose between creating multiple devices (e.g., humidity sensors for flowers) or a single device with multiple components (e.g., a PLC with multiple inputs).
            </p>
            <div className="flex justify-around mt-4">
                <Button  onClick={() => props.onCLick("flowers")}>Flowers</Button>
                <Button >PLC</Button>
            </div>
        </Section>
    </>);
}