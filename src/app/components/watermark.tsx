import { ExtLink } from "./ext-link";

export const Watermark = () => 
        <div className="text-center h-full flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Welcome to the Editor for ESPHome
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            Easily build and manage devices by writing or generating YAML files.
        </p>
        <p>
            Check <ExtLink href="https://editor-4-esphome.github.io/">the documentation</ExtLink> for quick start and more information.
        </p>
    </div>;