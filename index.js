#!/usr/bin/env node

/**
 * Project Initialization Script for ShadowdriverJS
 * 
 * This script helps in creating a new project folder with the necessary files
 * and content for running tests with ShadowdriverJS. It also provides an option
 * to run `npm install` to install the required dependencies.
 * 
 * Usage:
 * - Run this script using Node.js
 * - Follow the prompts to enter the project name and decide whether to run `npm install`
 * 
 * Note: Ensure that this script has executable permissions.
 */

/**
 * Module dependencies.
 */
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const chalk = require('chalk');
const { log, info, error } = require('console')



/**
 * Create a readline interface for user input.
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Function to create a project folder and files with content.
 * 
 * @param {string} projectName - The name of the project folder to create.
 */
function createProjectFolder(projectName) {
    const projectPath = `./${projectName}`;
    // Create the project folder in the current directory if it doesn't exist
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        fs.mkdirSync(`${projectPath}/e2e`);
    } else {
        console.error(chalk.red(`The project folder "${projectName}" already exists. Aborting in peace.`));
        process.exit(1);
    }
    // Write the content to the respective files
    const confFile = fs.readFileSync(`./client_files/shadow.conf.txt`, 'utf-8');
    const packageJson = fs.readFileSync(`./client_files/package.json`, 'utf-8');
    const sampleSpec = fs.readFileSync(`./client_files/sample.spec.txt`, 'utf-8');

    //
    fs.writeFileSync(`${projectPath}/shadow.conf.js`, confFile);

    let packageContent = packageJson.replace(`"name": "DemoProject"`, `"name": "${projectName}"`);
    fs.writeFileSync(`${projectPath}/package.json`, packageContent);

    fs.writeFileSync(`${projectPath}/e2e/sample.spec.js`, sampleSpec);
    console.log(chalk.green(`Project folder "${projectName}" created with files and content in the current directory.`));
}

/**
 * Main function to handle user input and project creation.
 */
rl.question('Enter the project name: ', (projectName) => {
    createProjectFolder(projectName);
    rl.question('Do you want to run "npm install"? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y' || answer.toLowerCase() === null || answer.toLowerCase() === '') {
            //I am changing for local testing
            info("Please wait ..................");
            exec(`cd ${projectName} && npm link`, (error, stdout, stderr) => {
                if (error) {
                    console.error(chalk.red(`Error running npm install: ${error}`));
                } else {
                    const fileStream = fs.createReadStream('./client_files/bot_ansi.txt');
                    const rl = readline.createInterface({
                        input: fileStream,
                        crlfDelay: Infinity
                    });

                    rl.on('line', (line) => {
                        console.log(chalk.yellow(line)); // Print each line
                    });

                    rl.on('close', () => {
                        //console.log('File reading completed.');
                        console.log(chalk.green(stdout));
                        console.log(chalk.red(':::::::::::::::::::::: ATTENTION ::::::::::::::::::::::', '\n'))
                        console.log(chalk.magenta('The developer of this library is looking for a good job: github@noodlescripter, hamim.alam.personal@gmail.com, hamimalam@outlook.com', '\n'));
                        console.log(chalk.red(':::::::::::::::::::::: THANKS ::::::::::::::::::::::', '\n'))
                        console.log(chalk.yellow('Thank you for installing @shadowdriverJS. Know that it is still in BETA..... Happy Coding!'));
                    });
                }
                rl.close();
            });
        } else {
            console.log(chalk.green('Skipping npm install. Help yourself by doing it manually!'));
            rl.close();
        }
    });
});
