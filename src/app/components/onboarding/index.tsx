import { color_esphome, color_gray, color_local, color_offline, color_online } from "@/app/utils/const";
import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";
import { useState } from "react";

export const Onboarding = () => {
    const [hiddenSections, setHiddenSections] = useState<any>({});

    const toggleSection = (section: any) => {
        setHiddenSections((prev: any) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to the ESPHome Editor</h1>
                    <p className="text-gray-600 mt-2">
                        Get started by learning how to use this tool to build and manage your ESPHome devices effortlessly.
                    </p>
                </div>

                {/* Section: Introduction */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Introduction</h2>
                        <label>
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={() => toggleSection("introduction")}
                            />
                            Complete
                        </label>
                    </div>
                    {!hiddenSections.introduction && (
                        <p className="text-gray-700 mt-2">
                            With the ESPHome Editor, you can combine multiple YAML files to create robust configurations for your devices. YAML files can either be written manually or generated using the Etajs template engine.
                        </p>
                    )}
                </div>

                {/* Section: Device Status */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Understanding Device Status</h2>
                        <label>
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={() => toggleSection("deviceStatus")}
                            />
                            Complete
                        </label>
                    </div>
                    {!hiddenSections.deviceStatus && (
                        <>
                            <p className="text-gray-700 mt-2">
                                On the left panel, you’ll see all your ESPHome devices. The status of each device is indicated by the color of the light bulb:
                            </p>
                            <ul className="list-disc ml-8 mt-3 text-gray-700 space-y-2">
                                <li><span style={{ color: color_gray }} className="font-semibold">Gray</span> - Editor-only device</li>
                                <li><span style={{ color: color_online }} className="font-semibold">Online</span>/<span style={{ color: color_offline }} className="font-semibold">Offline</span> - status of ESPHome device</li>
                            </ul>
                        </>
                    )}
                </div>

                {/* Section: Device Toolbar */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Device Toolbar</h2>
                        <label>
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={() => toggleSection("deviceToolbar")}
                            />
                            Complete
                        </label>
                    </div>
                    {!hiddenSections.deviceToolbar && (<>
                        <p className="text-gray-700 mt-2">
                            Expand a device to access its toolbar. The available actions depend on the device status:
                        </p>
                        <ul className="mt-4 space-y-3">
                            <li><DownloadIcon className="inline mr-2" fill={color_local} /> Import configuration from ESPHome instance</li>
                            <li><CodeIcon className="inline mr-2" fill={color_local} /> View the compiled local ESPHome configuration</li>
                            <li><GitCompareIcon className="inline mr-2" fill={color_gray} /> Compare local vs. ESPHome configuration</li>
                            <li><UploadIcon className="inline mr-2" fill={color_gray} /> Upload local configuration to ESPHome</li>
                            <li><CodeIcon className="inline mr-2" fill={color_esphome} /> View ESPHome configuration</li>
                            <li><BeakerIcon className="inline mr-2" fill={color_esphome} /> Compile ESPHome configuration</li>
                            <li><UploadIcon className="inline mr-2" fill={color_esphome} /> Install configuration to a device</li>
                            <li><LogIcon className="inline mr-2" fill={color_esphome} /> View log stream</li>
                        </ul>
                    </>
                    )}
                </div>

                {/* Section: YAML Configuration */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">How YAML Configurations Work</h2>
                        <label>
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={() => toggleSection("yamlConfig")}
                            />
                            Complete
                        </label>
                    </div>
                    {!hiddenSections.yamlConfig && (<>
                        <p className="text-gray-700 mt-2">
                            The final YAML configuration is a combination of multiple YAML files. Here's how it works:
                        </p>
                        <ul className="list-disc ml-8 mt-3 text-gray-700 space-y-2">
                            <li>Use the <code>.lib</code> folder for shared code, with optional device-specific local <code>.lib</code> folders.</li>
                            <li>The compiler processes all <code>.eta</code> files in the root folder, converting them into YAML files.</li>
                            <li>It merges manually created YAML files and compiled YAML files into a single final configuration file.</li>
                        </ul>
                    </>
                    )}
                </div>

                {/* Section: Getting Started */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Getting Started</h2>
                        <label>
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={() => toggleSection("gettingStarted")}
                            />
                            Complete
                        </label>
                    </div>
                    {!hiddenSections.gettingStarted && (<>
                        <p className="text-gray-700 mt-2">
                            Let’s start building configurations. Choose between creating multiple devices (e.g., humidity sensors for flowers) or a single device with multiple components (e.g., a PLC with multiple inputs).
                        </p>
                        <div className="flex justify-around mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Flowers</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">PLC</button>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}