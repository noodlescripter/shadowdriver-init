#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to create a project folder and files with content
function createProjectFolder(projectName) {
    const projectPath = `./${projectName}`;

    // Create the project folder in the current directory if it doesn't exist
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        fs.mkdirSync(`${projectPath}/e2e`);
    } else {
        console.error(chalk.red(`The project folder "${projectName}" already exists. Aborting.`));
        process.exit(1);
    }

    // Create files with content
    const fileContents = {
        'shadow.conf.js': 'module.exports = {\n' +
            '    browserName: \'chrome\',\n' +
            '    mochaTimeout: 90000,\n' +
            '    reportName: \'report.html\',\n' +
            '    baseURL: \'https://google.com/\',\n' +
            '    specs: [\n' +
            '        \'e2e/sample.spec.js\'\n' +
            '    ],\n' +
            '    onPrepare: () => {\n' +
            '        browser.manage().window().maximize();\n' +
            '    }\n' +
            '};\n',
        'package.json': '{ "name": "' + projectName + '", "version": "1.0.0", "description": "shadowdriverJS testing library, built on top of WebdriverJS. Built with respect to ProtractorJS", "main": "", "scripts": { "shadow": "node ./node_modules/shadowdriverjs/shadow.js" }, "author": "", "license": "ISC" }',
        'jsconfig.json': '{ "compilerOptions": { "target": "ES6" } }'
    };

    const e2eSampleSpec = `describe('Sample Test Suite', async function () {

    it('should perform a sample test case', async function () {
        await browser.get(baseURL);
        await browser.sleep(3000);
        await element(by.xpath('//*[@title="Search"]')).sendKeys("Hello");
        await browser.sleep(3000);
        await element(by.xpath('//*[@title="Search"]')).clear();
        await element(by.xpath('//*[@title="Search"]')).sendKeys("tor mare chudi");
        await browser.sleep(3000);
        const windows = await browser.getAllWindowHandles();
        if (windows.length > 2) {
            console.info("Many windows found");
        } else {
            console.info("No window is here, only one");
        }
        await browser.quit();
    });
});
`;

    for (const fileName in fileContents) {
        fs.writeFileSync(`${projectPath}/${fileName}`, fileContents[fileName]);
    }
    fs.writeFileSync(`${projectPath}/e2e/sample.spec.js`, e2eSampleSpec);
    console.log(chalk.green(`Project folder "${projectName}" created with files and content in the current directory.`));
}

rl.question('Enter the project name: ', (projectName) => {
    createProjectFolder(projectName);
    rl.question('Do you want to run "npm install"? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y' || answer.toLowerCase() === null || answer.toLowerCase() === '') {
            exec(`cd ${projectName} && npm install shadowdriverjs`, (error, stdout, stderr) => {
                if (error) {
                    console.error(chalk.red(`Error running npm install: ${error}`));
                } else {
                    console.log(chalk.green(stdout));
                    console.log(chalk.magenta('The developer of this library is looking for a good job: github@noodlescripter, hamim.alam.personal@gmail.com, hamimalam@outlook.com'));
                    console.log(chalk.yellow('Thank you for installing @shadowdriverJS. Know that it is still in BETA..... Happy Coding!'));
                }
                rl.close();
            });
        } else {
            console.log(chalk.green('Skipping npm install. Help yourself by doing it manually!'));
            rl.close();
        }
    });
});
