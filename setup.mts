import { promises as fs } from 'fs';

const prepareDir = async (dir: string) => {
    try {
        await fs.rm(dir, { recursive: true, force: true });
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error(`Error preparing directory: ${dir} ${error}`);
    }
}

const downloadFile = async (url: string, destinationFile: string) => {
    const content = await (await fetch(url)).text();
    await fs.writeFile(destinationFile, content);
}

const modifyFile = async (file: string, callback: (content: string) => string) => {
    const content = (await fs.readFile(file)).toString();
    const newContent = callback(content);
    await fs.writeFile(file, newContent);
}

const downloadEspHomeSchemas = async () => {
    console.log("Downloading EspHome schema files...");
    const fileList: any[] = await (await fetch("https://api.github.com/repos/esphome/esphome-schema/contents/schema?ref=release")).json();

    const targetRoot = "./public/esphome_schemas";
    await prepareDir(targetRoot);

    const promises = fileList.map((file) => downloadFile(file.download_url, `${targetRoot}/${file.name}`));

    await Promise.all(promises)
    console.log(` Done. ${promises.length} files`);
}

const downloadEspHomeMonacoFiles = async () => {
    console.log("Downloading EspHome Monaco-Editor files...");
    const downloadSrcEditor = async (fileName: string) =>
        downloadFile(`https://raw.githubusercontent.com/esphome/dashboard/main/src/editor/${fileName}`, `${targetRoot}/${fileName}`);
    
    const targetRoot = "./src/3rd-party/esphome-dashboard/src/editor";
    await prepareDir(`${targetRoot}`);
    await prepareDir(`${targetRoot}/utils`);

    const promises = [
        "completions-handler.ts",
        "definition-handler.ts",
        "editor-shims.ts",
        "esphome-document.ts",
        "esphome-schema.ts",
        "hover-handler.ts",
        "utils/objects.ts",
        "utils/text-buffer.ts",
    ]
        .map((file) => downloadSrcEditor(file));
        
    await Promise.all(promises)
       console.log(` Done. ${promises.length} files`);

    await modifyFile(`${targetRoot}/editor-shims.ts`, (content) =>
            content.replace("static/schema/${name}.json", "./esphome_schemas/${name}.json")
    );
}

await downloadEspHomeSchemas();
await downloadEspHomeMonacoFiles();
