import { exit, env } from "node:process";
import *as fs from "node:fs/promises";
import { execaCommand } from "execa";
import { confirm, input, select, Separator } from "@inquirer/prompts";
import YAML from 'yaml'

const image_name_prod = "morcatko/esphome-editor";
const image_name_dev = "morcatko/esphome-editor-dev";
const addon_path = env.TASKS_ADDON_PATH;

const exec = (command: string) => {
    console.log(`Command: ${command}`);
    const promise = execaCommand(command, {
        stdout: "inherit",
        stdin: "pipe",
        stderr: "inherit",
    });
    promise.finally(() => {
        console.log("\n");
    });
    return promise;
};

const getVersion = async () => (await import("./package.json")).version;

const dockerBuild = async (
    image_name: string,
    tags: string[],
    platforms: string[],
    ) => {

    console.log("=========================================");
    console.log(`Building\n ${image_name}\ntags:\n ${tags.join("\n ")}\nplatforms:\n -${platforms.join("\n -")}`);
    console.log("=========================================");
    await exec(`docker buildx build --platform=${platforms.join(",")} --load ${tags.map(t => `-t ${image_name}:${t}`).join(" ")} -f dockerfile .`);
    if (await confirm({ message: `Push ${image_name}:(${tags.join(", ")})`})) {
        for (const tag of tags) {
            await exec(`docker push ${image_name}:${tag}`);
        }
    }
}

const createNewVersion = async () => {
    const version = await input({ message: "Enter version" });
    await exec(`npm pkg set version=${version}`);

    console.log("Updating config.yaml version");
    const yaml = YAML.parse(await fs.readFile(addon_path + '/config.yaml', 'utf8'), { keepSourceTokens: true });
    yaml["version"] = version
    await fs.writeFile(addon_path + '/config.yaml', YAML.stringify(yaml, { keepSourceTokens: true }));
}


const mainLoop = async () => {
    const version = await getVersion();
    const answer = await select({
        message: "Select a task",
        choices: [
            {
                name: `Docker Dev - Build (${image_name_dev}:latest)`,
                value: "docker_dev_build",
            },
            {
                name: `Docker Dev - Run (${image_name_dev}:latest)`,
                value: "docker_dev_run",
            },
            new Separator(),
            {
                name: `Create New Version`,
                value: "create_new_version",
            },
            {
                name: `Docker Prod - Build (${image_name_prod}:${version})`,
                value: "docker_prod_build",
            },
        ],
    });

    switch (answer) {
        case "docker_dev_build":
            await dockerBuild(image_name_dev, ["latest"], ["linux/amd64"]);
            break;
        case "docker_dev_run":
            await exec(`docker run --rm -p 8080:3000 -e ESPHOME_URL=http://192.168.0.15:6052/ ${image_name_dev}:latest`);
            break;
        case "create_new_version":
            await createNewVersion();
            break;
        case "docker_prod_build":
            //https://github.com/home-assistant/supervisor/blob/main/supervisor/data/arch.json
            //"raspberrypi4-64": ["aarch64", "armv7", "armhf"],
            // MAP_ARCH in https://github.com/home-assistant/supervisor/blob/main/supervisor/docker/interface.py
            // MAP_ARCH = {
            //     CpuArch.ARMV7: "linux/arm/v7",
            //     CpuArch.ARMHF: "linux/arm/v6",
            //     CpuArch.AARCH64: "linux/arm64",
            //     CpuArch.I386: "linux/386",
            //     CpuArch.AMD64: "linux/amd64",
            // }
            const platforms = [
                "linux/amd64",
                "linux/arm64",
            ]
            const tags = [
                "latest",
                await getVersion()
            ];
            await dockerBuild(image_name_prod, tags, platforms);
            break;
    }
};

await mainLoop();
exit(0);
