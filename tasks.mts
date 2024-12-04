import { exit, env } from "node:process";
import { execaCommand } from "execa";
import { confirm, input, select, Separator } from "@inquirer/prompts";

const image_name_prod = "morcatko/esphome-editor";
const image_name_dev = env.IMAGE_NAME_DEV ?? "esphome-editor-dev";

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

const getDockerTag = () => input({ message: "Enter tag", default: "latest" });


const docker = async (
    build_cmd: string,
    image_name: string) => {

    const tag = await getDockerTag();
    console.log(`Building ${image_name}:${tag}`);
    await exec(`${build_cmd} -t ${image_name}:${tag} -f dockerfile .`);
    const push = await confirm({ message: `Push (${image_name}:${tag}) ?` });
    if (push) {
        await exec(`docker push ${image_name}:${tag}`);
    }
}


const mainLoop = async () => {
    const answer = await select({
        message: "Select a task",
        choices: [
            {
                name: "Docker Dev",
                value: "docker_dev",
            },
            new Separator(),
            {
                name: "Docker Prod",
                value: "docker_prod",
            },
        ],
    });

    switch (answer) {
        case "docker_dev":
            await docker("docker build", image_name_dev);
            break;
        case "docker_prod":
            await docker("docker buildx build --platform=linux/amd64,linux/arm64 --load", image_name_prod);
            break;
    }
};

await mainLoop();
exit(0);
