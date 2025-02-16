import { promises as fs } from 'fs';

async function copyFile(source: string, destination: string): Promise<void> {
    try {
        await fs.copyFile(source, destination);
        console.log(`File copied from ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error copying file: ${error}`);
    }
}
