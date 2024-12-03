import { exit, env } from "node:process";
import { execaCommand } from "execa";
import { confirm, input, select, Separator } from "@inquirer/prompts";

const image_name_prod = "morcatko/esphome-editor";
const image_name_dev = env.IMAGE_NAME_DEV;

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

const docker = async (imageName: string) => {
    const tag = await getDockerTag();
    console.log(`Building ${imageName}:${tag}`);
    await exec(`docker build -t ${imageName}:${tag} -f dockerfile .`);
    const push = await confirm({ message: "Push?" });
    if (push) {
        await exec(`docker push ${imageName}:${tag}`);
    }
};

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
            await docker(image_name_dev);
            break;
        case "docker_prod":
            await docker(image_name_prod);
            break;
    }
};

await mainLoop();

//await exec("ls -la");
//await execa_pipe`ls -la`;
//console.log(list.stdout);
//await $.sync`dir`;

exit(0);
