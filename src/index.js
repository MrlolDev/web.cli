#!/usr/bin/env node
/*
                         /$$                    /$$ /$$
                        | $$                   | $$|__/
 /$$  /$$  /$$  /$$$$$$ | $$$$$$$      /$$$$$$$| $$ /$$
| $$ | $$ | $$ /$$__  $$| $$__  $$    /$$_____/| $$| $$
| $$ | $$ | $$| $$$$$$$$| $$  \ $$   | $$      | $$| $$
| $$ | $$ | $$| $$_____/| $$  | $$   | $$      | $$| $$
|  $$$$$/$$$$/|  $$$$$$$| $$$$$$$//$$|  $$$$$$$| $$| $$
 \_____/\___/  \_______/|_______/|__/ \_______/|__/|__/
*/
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import fs from "fs";
import exec from "exec-sh";
import { createSpinner } from "nanospinner";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var webType = null;
var frontend = null;
var backend = null;

async function load(ms, message) {
  const spinner = createSpinner(message);
  spinner.start();
  await sleep(ms);
  spinner.stop();
}
async function welcome() {
  var welcomeTitle = chalkAnimation.rainbow(
    figlet.textSync("Welcome to web.cli", {
      font: "Big Money-ne",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  );
  welcomeTitle.start();
  await sleep(500);
  welcomeTitle.stop();
}
async function webTypeSelector() {
    const webTypePrompt = await inquirer.prompt([
        {
        type: "list",
        name: "webType",
        message: "What type of web do you want to create?",
        choices: ["fullstack", "frotend", "backend", "loadConfig"],
        },
    ]);
    webType = webTypePrompt.webType;
    return webTypePrompt.webType;
}
async function frontendSelector() {
    const frontendPrompt = await inquirer.prompt([
        {
        type: "list",
        name: "frontend",
        message: "What frontend framework do you want to use?",
        choices: ["react", "vue", "angular", "next", "svelte"],
        },
    ]);
    frontend = frontendPrompt.frontend;
    return frontendPrompt.frontend;
}
async function backendSelector() {
    const backendPrompt = await inquirer.prompt([
        {
        type: "list",
        name: "backend",
        message: "What backend framework do you want to use?",
        choices: ["express", "nest", "fastify", "koa"],
        },
    ]);
    backend = backendPrompt.backend;
    return backendPrompt.backend;
}
async function saveConfigPrompt() {
    var saveConfigPrompt = await inquirer.prompt([
        {
        type: "confirm",
        name: "saveConfig",
        message: "Do you want to save this configuration?",
        },
    ]);
    if (saveConfigPrompt.saveConfig) {
        await load(1000, "Saving configuration...");
        await saveConfig();
    }
}
async function saveConfig() {
    var configName = await inquirer.prompt([
        {
        type: "input",
        name: "configName",
        message: "What do you want to name your configuration?",
        },
    ]);
    var config = {
        webType: webType,
        frontend: frontend,
        backend: backend,
    }
    var configString = JSON.stringify(config);
    var configFile = `./src/configs/${configName.configName}.json`;
    if(fs.existsSync(configFile)) console.log(chalk.red(`Configuration ${configName.configName} already exists.`));
    fs.writeFile(configFile, configString, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(chalk.green("Configuration saved!"));
    });
}
async function getConfig() {
    var configName = await inquirer.prompt([
        {
        type: "input",
        name: "configName",
        message: "What is the name of your configuration?",
        },
    ]);
    var configFile = `./src/configs/${configName.configName}.json`;
    if(!fs.existsSync(configFile)) console.log(chalk.red(`Configuration ${configName.configName} does not exist.`));
    var configString = fs.readFileSync(configFile, "utf8");
    var config = JSON.parse(configString);
    frontend = config.frontend;
    backend = config.backend;
    console.log(chalk.green(`Configuration ${configName.configName} loaded!`));
}
async function initProject() {
    if(frontend) {
        if(frontend == "react") {
            await load(100, "Starting react project with create-react-app...");
            await exec('npm install -g create-react-app');
            await load(15000, 'Waiting for create-react-app to finish installation...');
            await exec(`create-react-app client`);
        }
        if(frontend == "vue") {
            await load(100, "Starting vue project with vue-cli...");
            await exec('npm install -g vue-cli');
            await load(15000, 'Waiting for vue-cli to finish installation...');
            await exec(`vue init webpack client`);
        }
        if(frontend == "angular") {
            await load(100, "Starting angular project with ng new...");
            await exec('npm install -g @angular/cli');
            await load(15000, 'Waiting for ng new to finish installation...');
            await exec(`ng new client`);
        }
        if(frontend == "next") {
            await load(100, "Starting next project with next create...");
            await exec('npm install -g next');
            await load(15000, 'Waiting for next create to finish installation...');
            await exec(`next create client`);
        }
        if(frontend == "svelte") {
            await load(100, "Starting svelte project with svelte init...");
            await exec('npm install -g svelte');
            await load(15000, 'Waiting for svelte init to finish installation...');
            await exec(`svelte init client`);
        }
    }
    if(backend) {
        if(backend == "express") {
            await load(100, "Creating server folder...")
            fs.mkdirSync("./server");
            await load(100, "Creating server src folder...")
            fs.mkdirSync("./server/src");
            await load(100, "Creating server package.json file...")
            fs.writeFileSync("./server/package.json", '{\n  "name": "server",\n  "version": "1.0.0",\n  "description": "",\n  "main": "src/index.js",\n  "scripts": {},\n  "author": "",\n  "license": "ISC"\n}');
            await load(100, "Creating server .env file...")
            fs.writeFileSync("./server/.env", 'NODE_ENV=development\nPORT=3000');
            await load(100, "Creating server index.js file...")
            fs.writeFileSync("./server/src/index.js", `const express = require("express");\nconst app = express();\nconst morgan = require("morgan");\nrequire("dotenv").config();\n\napp.use(morgan("dev"));\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\napp.set("PORT", process.env.PORT || 3000);\napp.use("/", require("./routes/routes"));\n\napp.listen(app.get("PORT"), () => {\n    console.log("Server running on port " + app.get("PORT"));\n});`);
            await load(100, "Creating server src/routes folder...")
            fs.mkdirSync("./server/src/routes");
            await load(100, "Creating server src/controllers folder...")
            fs.mkdirSync("./server/src/controllers");
            await load(100, "Creating server routes file...")
            fs.writeFileSync("./server/src/routes/routes.js", `const express = require("express");\nconst router = express.Router();\n\nrouter.get('/', async(req, res) =>{\nres.send('hello world')\n})\n\n module.exports = router;`);
            await load(100, "Creating server controllers file...")
            fs.writeFileSync("./server/src/controllers/controllers.js", `module.exports = {};`);
            await load(100, "Installing dependencies with npm...")
            await exec(`cd server && npm i express dotenv morgan`);
            console.log(chalk.green("Server project created!"));
        }
        if(backend == "nest") {
            await load(100, "Starting nest project with nest cli")
            await exec('npm i -g @nestjs/cli')
            await load(15000, 'Waiting for nest cli to finish installation...');
            await exec('nest new server')
        }
        if(backend == "fastify") {
            await load(100, "Starting fastify project with fastify cli")
            await exec('npm i -g fastify')
            await load(15000, 'Waiting for fastify cli to finish installation...');
            await exec('fastify new server')
        }
        if(backend == "koa") {
            await load(100, "Starting koa project with koa cli")
            await exec('npm i -g koa')
            await load(15000, 'Waiting for koa cli to finish installation...');
            await exec('koa new server')
        }
    }
}

console.clear();
await welcome();
await webTypeSelector();
await load(500, "Loading...");
console.clear();
if (webType == "loadConfig") {
    await getConfig();
}
if(webType == "fullstack" || webType == "frotend" && webType != "loadConfig") {
    await frontendSelector();
    console.clear();
}
if(webType == "fullstack" || webType == "backend" && webType != "loadConfig") {
    await backendSelector();
    console.clear();
}
if(webType != "loadConfig") {
    await saveConfigPrompt()
}
console.clear();
await initProject();