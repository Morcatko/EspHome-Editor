import { createWriteStream, promises as fs } from 'fs';
import * as fs_old from 'fs';
import { Readable } from 'stream';
import AdmZip from 'adm-zip';

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

const downloadEspHomeSchemasFromGithub = async () => {
    console.log("Downloading EspHome schema files...");
    const lastRelase = await (await fetch("https://api.github.com/repos/esphome/esphome-schema/releases/latest")).json();
    
    console.log(`Latest release: ${lastRelase.tag_name}`);
    
    const schemaZipUrl = lastRelase.assets.find((asset: any) => asset.name === "schema.zip")?.browser_download_url;

    await prepareDir("./.temp");

    const schemaZipFile = "./.temp/schema.zip";

    const response = await fetch(schemaZipUrl);

    const readableNodeStream = Readable.fromWeb(response.body as any);
    const fileStream = createWriteStream(schemaZipFile);
    await new Promise((resolve, reject) => {
	    readableNodeStream.pipe(fileStream);
        readableNodeStream.on('error', reject);
        fileStream.on('finish', resolve as any);
    });

    processSchemaZip();
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

const processSchemaZip = async () => {
    const schemaZipFile = "./.temp/schema.zip";

    if (!fs_old.existsSync(schemaZipFile)) {
        console.error("Schema zip file does not exist. Please download it from the GitHub Actions artifacts.");
        //https://github.com/esphome/esphome-schema/actions/runs/16282708589/job/45975319823
    }

    console.log("Processing schema.zip file...");
    const targetRoot = "./public/esphome_schemas";
    await prepareDir(targetRoot);

    const zip = new AdmZip(schemaZipFile);
    zip.extractAllTo(targetRoot, true);
    console.log("Done.");
}

//await processSchemaZip();
await downloadEspHomeSchemasFromGithub()
await downloadEspHomeMonacoFiles();
