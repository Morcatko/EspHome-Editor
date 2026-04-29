import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Alert, Anchor } from "@mantine/core";
import { ExtLink } from "./ext-link";
import { usePanelsStore } from "./panels/panels-store";
import { InfoIcon } from "@primer/octicons-react";

export const Watermark = () => {

    const panelsStore = usePanelsStore();
    return <div className="text-center h-full flex flex-col items-center justify-center space-y-4 px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Welcome to the Editor for ESPHome
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            Easily build and manage devices by writing or generating YAML files.
        </p>
        <p>
            Check <ExtLink href="https://editor-4-esphome.github.io/">the documentation</ExtLink> for quick start and more information.
        </p>
        <p>
            <Alert variant="light" color="blue" title="Fleet Management" icon={<InfoIcon />} >
                <div>Try new <b>Fleet Management</b> feature by clicking on the logo in top left corner.</div>
                <Anchor className="flex-grow" href="#" onClick={() => panelsStore.addPanel({ operation: "devices-panel" })} underline="never">
                    <Image className="mt-2" src={logo} alt="ESPHome Editor" width="32" height="32" />
                </Anchor>
            </Alert>
        </p>
    </div>;
}