#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const chalk = require('chalk');
const { log, info, error } = require('console');

const ASCII_LOGO = `
  _____ _   _    _    _   _ _  __    __   _____  _   _                        
 |_   _| | | |  / \  | \\ | | |/ /    \\ \\ / / _ \\| | | |                       
   | | | |_| | / _ \\ |  \\| | ' /      \\ V / | | | | | |                       
   | | |  _  |/ ___ \\| |\\  | . \\       | || |_| | |_| |                       
   |_| |_| |_/_/   \\_\\_| \\_|_|\\_\\__    |_| \\___/ \\___/                        
                   |  ___/ _ \\|  _ \\                                          
                   | |_ | | | | |_) |                                         
                   |  _|| |_| |  _ <                                          
    ___ _   _ ____ |_|__ \\___/|_| \\_\\_     ___ _   _  ____                    
   |_ _| \\ | / ___|_   _|/ \\  | |   | |   |_ _| \\ | |/ ___|                   
    | ||  \\| \\___ \\ | | / _ \\ | |   | |    | ||  \\| | |  _                    
    | || |\\  |___) || |/ ___ \\| |___| |___ | || |\\  | |_| |                   
   |___|_| \\_|____/ |_/_/   \\_\\_____|_____|___|_| \\_|\\____|         _ ____    
  ___| |__   __ _  __| | _____      ____| |_ __(_)_   _____ _ __   | / ___|   
 / __| '_ \\ / _\` |/ _\` |/ _ \\ \\ /\\ / / _\` | '__| \\ \\ / / _ \\ '__|  | \\___ \\   
 \\__ \\ | | | (_| | (_| | (_) \\ V  V / (_| | |  | |\\ V /  __/ | | |_| |___) |  
 |___/_| |_|\\__,_|\\__,_|\\___/ \\_/\\_/_\\__,_|_| _|_| \\_/ \\___|_|__\\___/|____/ _ 
 | | | |  / \\  |  _ \\|  _ \\ \\ / /  / ___/ _ \\|  _ \\_ _| \\ | |/ ___|    | | | |
 | |_| | / _ \\ | |_) | |_) \\ V /  | |  | | | | | | | ||  \\| | |  _     | | | |
 |  _  |/ ___ \\|  __/|  __/ | |   | |__| |_| | |_| | || |\\  | |_| |    |_|_|_|
 |_| |_/_/   \\_\\_|   |_|    |_|    \\____\\___/|____/___|_| \\_|\\____|    (_|_|_)
`;

const FUNNY_MESSAGES = [
    "🎯 You've just unlocked the secret testing weapon!",
    "🧙‍♂️ Welcome to the Hogwarts of Testing - Debugging made magical!",
    "🎮 Player 1 has entered the testing game! Press Start!",
    "🚀 Houston, we have a solution! Testing is now awesome!",
    "🎪 Welcome to the greatest show in testing!",
    "🦸‍♂️ Your testing superpower has been activated!",
    "🎭 Plot twist: Testing is now your favorite part!",
    "🌟 You're officially cooler than 98% of developers!",
    "🎨 Time to paint your code with awesome tests!",
    "🎸 Let's rock this testing world!"
];

const LOADING_MESSAGES = [
    "🔍 Initializing quantum bug detector...",
    "🏃 Teaching your tests parkour moves...",
    "🧪 Brewing some testing magic...",
    "🎮 Loading testing superpowers...",
    "🎯 Calibrating the awesome-meter...",
    "🎪 Training ninja testers...",
    "🎭 Preparing your testing arena...",
    "🚀 Fueling the testing rockets...",
    "🧙‍♂️ Casting testing spells...",
    "🦸‍♂️ Assembling the Testing Avengers..."
];

const ERROR_MESSAGES = [
    "🦹‍♂️ Even Batman has bad days...",
    "🚫 Error 404: Success not found (but we'll fix that!)",
    "😅 Oops! Our code monkeys need a coffee break...",
    "🎭 Plot twist: This wasn't supposed to happen!",
    "🎪 The circus is temporarily closed for maintenance..."
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomMessage(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function createBox(message, color = 'white') {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const horizontalBorder = '═'.repeat(maxLength + 4);
    
    return chalk[color](`
╔${horizontalBorder}╗
║  ${lines.join(`  ║\n║  `)}  ║
╚${horizontalBorder}╝
`);
}

function displayProgressBar(progress, total) {
    const barLength = 30;
    const filledLength = Math.round(barLength * progress / total);
    const empty = barLength - filledLength;
    const bar = '█'.repeat(filledLength) + '░'.repeat(empty);
    const loadingMessage = getRandomMessage(LOADING_MESSAGES);
    process.stdout.write(`\r${chalk.cyan(loadingMessage)} [${chalk.green(bar)}] ${Math.round(progress/total*100)}%`);
}

async function displayColorfulASCII() {
    console.clear();
    const lines = ASCII_LOGO.split('\n');
    const colors = ['blue', 'cyan', 'magenta', 'yellow'];

    for (let i = 0; i < lines.length; i++) {
        const color = colors[i % colors.length];
        process.stdout.write('\r' + chalk[color](lines[i]) + '\n');
        await sleep(50);
    }

    await sleep(200);
    console.log(chalk.cyan('\n' + '═'.repeat(80)));
    console.log(chalk.bold.yellow('\n' + ' '.repeat(10) + getRandomMessage(FUNNY_MESSAGES) + '\n'));
    console.log(chalk.magenta(' '.repeat(15) + "Side effects include: Excessive testing confidence and random high-fives! 😎"));
    console.log(chalk.cyan('═'.repeat(80) + '\n'));
}
async function initializeNpmProject(projectPath, projectName) {
    return new Promise((resolve, reject) => {
        exec(`cd ${projectPath} && npm init -y`, async (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                const packageJsonPath = `${projectPath}/package.json`;
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

                packageJson.name = projectName;
                packageJson.version = "1.0.0";
                packageJson.description = "Test automation project using ShadowdriverJS";
                packageJson.scripts = {
                    "test": "shadowdriver run",
                    "shadowdriver": "shadowdriver run"
                };
                packageJson.dependencies = {
                    "shadowdriverjs": "^2.0.0"
                };
                packageJson.keywords = ["testing", "automation", "shadowdriver", "e2e"];
                packageJson.author = "";
                packageJson.license = "MIT";

                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}


async function createProjectFolder(projectName) {
    console.log(chalk.cyan('\n📁 Time to create something awesome...'));
    const projectPath = `./${projectName}`;

    try {
        if (fs.existsSync(projectPath)) {
            console.log(createBox(
                `Hold up! "${projectName}" already exists!\nEven Doctor Strange can't handle parallel universes with the same project!`, 
                'red'
            ));
            process.exit(1);
        }

        fs.mkdirSync(projectPath);
        displayProgressBar(1, 5);
        await sleep(500);
        
        fs.mkdirSync(`${projectPath}/e2e`);
        displayProgressBar(2, 5);
        await sleep(500);

        await initializeNpmProject(projectPath, projectName);
        displayProgressBar(3, 5);
        await sleep(500);

        const confFile = fs.readFileSync(`./client_files/shadow.conf.txt`, 'utf-8');
        fs.writeFileSync(`${projectPath}/shadow.conf.js`, confFile);
        displayProgressBar(4, 5);
        await sleep(500);

        const sampleSpec = fs.readFileSync(`./client_files/sample.spec.txt`, 'utf-8');
        fs.writeFileSync(`${projectPath}/e2e/sample.spec.js`, sampleSpec);
        displayProgressBar(5, 5);
        await sleep(500);

        console.log('\n');
        console.log(createBox('🎉 Achievement Unlocked: Project Creation Master!', 'green'));
    } catch (err) {
        console.log(createBox(`${getRandomMessage(ERROR_MESSAGES)}\n${err.message}`, 'red'));
        process.exit(1);
    }
}

function displaySuccessMessage(projectName) {
    const successMessage = `
🎉 Level Up! Your Testing Journey Begins! 🎮

Quick Start Guide for Testing Heroes:
  1. cd ${projectName}         (Enter your new testing dimension)
  2. npm test                  (Unleash the testing magic)
  3. npm run shadowdriver      (Start your testing adventure)

🎓 Need the ancient scrolls of knowledge?
  https://github.com/noodlescripter/shadowdriverjs

Remember: Great testing comes with great reliability! 🦸‍♂️
    `;
    
    console.log(createBox(successMessage, 'green'));
}

async function displayDeveloperInfo() {
    console.log(createBox(`
╭────────────── About The Developer (Open for Work) ───────────────╮

👨‍💻 Hamim Alan
   Senior Software Engineer & Test Automation Architect

🛠️ Core Skills:
   ◆ Sr. Full Stack Development (Node.js, React, Java)
   ◆ Sr. Test Automation Architecture
   ◆ CI/CD & DevOps Engineering

📫 Connect With Me:
   ◆ Email: hamimalam@outlook.com
   ◆ GitHub: github@noodlescripter
   ◆ LinkedIn: https://www.linkedin.com/in/hamim-alam/

🎯 Open to Opportunities:
   ◆ Senior Software Engineering
   ◆ Test Automation Lead
   ◆ DevOps Engineering

"Passionate about creating robust, scalable solutions
 and building amazing testing frameworks!"

╰─────────────────────────────────────────────────╯
    `, 'cyan'));
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        await displayColorfulASCII();
        
        const projectName = await new Promise(resolve => {
            rl.question(chalk.cyan('\n🎭 What shall we name your testing masterpiece?: '), resolve);
        });

        await createProjectFolder(projectName);

        const installAnswer = await new Promise(resolve => {
            rl.question(chalk.cyan('\n📦 Ready to install the testing superpowers? (Y/n): '), resolve);
        });

        if (!/^n$/i.test(installAnswer)) {
            console.log(createBox('🧙‍♂️ Installing ShadowdriverJS... Please wait while we perform some magic...', 'cyan'));
            await new Promise((resolve, reject) => {
                exec(`cd ${projectName} && npm i shadowdriverjs`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(createBox('Failed to install ShadowdriverJS! The magic fizzled out!', 'red'));
                        reject(error);
                        return;
                    }
                    console.log(stdout);
                    resolve();
                });
            });
        }

        displaySuccessMessage(projectName);
        
        rl.close();

        await sleep(1000);
        console.clear();
        
        console.log(createBox(`
        🎉 Mission Accomplished! Installation Complete! 🎉
        
        Welcome to the Testing Elite Squad! 🦸‍♂️
        Your bugs don't stand a chance now!
        
        Remember: When in doubt, test it out! 
        
        Made with ❤️  and probably too much ☕ by ShadowdriverJS Team
        
        P.S. You're breathtaking! (Yes, you!) 🌟
        `, 'magenta'));

        await sleep(500);
        await displayDeveloperInfo();

    } catch (err) {
        console.log(createBox(`${getRandomMessage(ERROR_MESSAGES)}\n${err.message}`, 'red'));
        rl.close();
    }
}

main();