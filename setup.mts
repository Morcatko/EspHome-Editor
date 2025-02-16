import { promises as fs } from 'fs';

async function copyFile(source: string, destination: string): Promise<void> {
    try {
        await fs.copyFile(source, destination);
        console.log(`File copied from ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error copying file: ${error}`);
    }
}


const downloadEspHomeSchemas = async () => {
    const fileList: any[] = await (await fetch("https://api.github.com/repos/esphome/dashboard/contents/schema")).json();

    await fs.rm("./public/schema", { recursive: true });
    await fs.mkdir("./public/schema");

    const promises = fileList.map(async (file) => {
        const content = await (await fetch(file.download_url)).text();
        await fs.writeFile(`./public/schema/${file.name}`, content);
    });

    await Promise.all(promises)
    console.log(`Downloaded ${fileList.length} EspHome schema files`);
}

await downloadEspHomeSchemas();