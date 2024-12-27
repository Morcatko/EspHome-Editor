import { color_esphome, color_gray, color_local, color_offline, color_online } from "@/app/utils/const";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";

export const Onboarding = () => {

    return <div className="md:w-3/5 md:mx-auto m-8">
        <div>
            Welcome to Editor for ESPHome. Here you can learn how to use it.
            You can build each ESPHome device by combining multiple YAML files together.
            The YAML file can be writtern manually or generated using etajs template.
        </div>

        <p>
            On the left side you can see all your ESPHome devices, The color of a loght bulb indicates its status
            <ul>
                <li><span style={{ color: color_gray }}>gray</span> - Editor only Device</li>
                <li>colored - Device exists in your ESPHome instance and is currently<span style={{ color: color_offline }}>offline</span>/<span style={{ color: color_online }}>online</span></li>
            </ul>
        </p>
        <p>
            Now try expanding one of the devices. (Or create a new one - no imtplemented yet)
            Each device has its own toolbar with quick actions (available actions depend on the device status)
        </p>
        <ul>
            <li><DownloadIcon className="inline" fill={color_local} /> - Import configuration from ESPHome instance</li>
            <li><CodeIcon className="inline" fill={color_local} /> - Show final compiled local version of ESPHome config</li>
            <li><GitCompareIcon className="inline" fill={color_gray} /> - Compare local vs ESPHome config</li>
            <li><UploadIcon className="inline" fill={color_gray} /> - Upload local configuration to ESPHome</li>
            <li><CodeIcon className="inline" fill={color_esphome} />- Show ESPHome configration</li>
            <li><BeakerIcon className="inline" fill={color_esphome} />- Compile ESPHome configration</li>
            <li><UploadIcon className="inline" fill={color_esphome} /> - Install ESPHome configuration to a device</li>
            <li><LogIcon className="inline" fill={color_esphome} /> - Show log stream</li>
        </ul>
    <p>
        You can use .lib fodler for your shared code. Each device can hav its own local .lib fodler as well.
        Compiler will find all .eta files and compile it into .yaml files in devices root folder.
        Then it will look for all .yaml file (both manually created and result of repvisou compilations) and merge them together into singe configuration yaml file.
    </p>

        <p>
            Lets making some configurations. You can make multiple same devices like a humidity sensor for each of your flowers or one device with multiple same components. Something like a PLC with tens of inputs connected via modbus extension board. 
            You can combine both approaches together but for now lets try one of them.
        </p>
        <div className="flex flex-wrap">
            <div className="flex-1">
                Flowers
            </div>
            <div className="flex-1">
                PLC
            </div>
        </div>
    </div>;
}