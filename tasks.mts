import { exit } from 'node:process';
import 'zx/globals'
import { input, select } from '@inquirer/prompts';

const image_name = "morcatko/esphome-editor";

const getTag = () => input({ message: 'Enter tag', default: 'latest' });

const dockerBuild = async () => {
    const tag = await getTag();
    console.log('Building docker image - ', image_name, tag);
}

const dockerPush = async () => {
    const tag = await getTag();
    console.log('Pushing docker image', image_name, tag);
}

const mainLoop = async () => {
    const answer = await select({
        message: 'Select a package manager',
        choices: [
            {
                name: `Build Docker (${image_name})`,
                value: 'docker_build',
            },
            {
                name: `Push Docker (${image_name})`,
                value: 'docker_push',
            }
        ],
    });


    switch (answer) {
        case 'docker_build':
            await dockerBuild();
            break;
        case 'docker_push':
            await dockerPush();
            break;
    };
}

//await mainLoop();
await $`dir`;


exit(0);