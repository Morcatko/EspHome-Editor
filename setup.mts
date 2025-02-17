import { promises as fs } from 'fs';

async function copyFile(source: string, destination: string): Promise<void> {
    try {
        await fs.copyFile(source, destination);
        console.log(`File copied from ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error copying file: ${error}`);
    }
}

const prepareDir = async (dir: string) => {
    try {
        await fs.rm(dir, { recursive: true, force: true });
        await fs.mkdir(dir , { recursive: true });
    } catch (error) {
        console.error(`Error preparing directory: ${dir} ${error}`);
    }
}

const downloadFile = async (url: string, destinationFile: string) => {
    const content = await (await fetch(url)).text();
    await fs.writeFile(destinationFile, content);
}

const downloadEspHomeSchemas = async () => {
    const fileList: any[] = await (await fetch("https://api.github.com/repos/esphome/dashboard/contents/schema")).json();

    await prepareDir("./public/schema");

    const promises = fileList.map((file) => downloadFile(file.download_url, `./public/schema/${file.name}`));

    await Promise.all(promises)
    console.log(`Downloaded ${promises.length} EspHome schema files`);
}

const downloadEspHomeMonacoFiles = async () => {
    const downloadSrcEditor = async (fileName: string) =>
        downloadFile(`https://raw.githubusercontent.com/esphome/dashboard/main/src/editor/${fileName}`, `./src/3rd-party/esphome-dashboard/src/editor/${fileName}`);

    await prepareDir("./src/3rd-party/esphome-dashboard/src/editor");
    await prepareDir("./src/3rd-party/esphome-dashboard/src/editor/utils");

    const promises = [
        "completions-handler.ts",
        "editor-shims.ts",
        "esphome-document.ts",
        "esphome-schema.ts",
        "hover-handler.ts",
        "utils/objects.ts",
        "utils/text-buffer.ts",
    ]
        .map((file) => downloadSrcEditor(file));

    await Promise.all(promises)
    console.log(`Downloaded ${promises.length} EspHome Monaco-Editor files`);
}

//await downloadEspHomeSchemas();
await downloadEspHomeMonacoFiles();
