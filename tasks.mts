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
    build_cmd: string,
    image_name: string) => {

    const tag = await getVersion();
    console.log(`Building ${image_name}:${tag}`);
    await exec(`${build_cmd} -t ${image_name}:${tag} -f dockerfile .`);
    const push = await confirm({ message: `Push (${image_name}:${tag}) ?` });
    if (push) {
        await exec(`docker push ${image_name}:${tag}`);
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
                name: `Docker Dev - Build (${image_name_dev}:${version})`,
                value: "docker_dev_build",
            },
            {
                name: `Docker Dev - Run (${image_name_dev}:${version})`,
                value: "docker_dev_run",
            },
            new Separator(),
            {
                name: `Create New Version`,
                value: "create_new_version",
            },
            {
                name: `Docker Prod - Build (${image_name_dev}:${version})`,
                value: "docker_prod_build",
            },
        ],
    });

    switch (answer) {
        case "docker_dev_build":
            await dockerBuild("docker build", image_name_dev);
            break;
        case "docker_dev_run":
            await exec(`docker run --rm -p 8080:3000 -e ESPHOME_URL=http://192.168.0.15:6052/ ${image_name_dev}:${version}`);
            break;
        case "create_new_version":
            await createNewVersion();
            break;
        case "docker_prod_build":
            await dockerBuild("docker buildx build --platform=linux/amd64,linux/arm64 --load", image_name_prod);
            break;
    }
};

await mainLoop();
exit(0);
