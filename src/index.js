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
import chalkAnimation from "chalk-animation";
import fs from "fs";
import exec from "exec-sh";
import { createSpinner } from "nanospinner";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var configs = [];
var config = {};

async function load(ms, message) {
  const spinner = createSpinner(message);
  spinner.start();
  await sleep(ms);
  spinner.stop();
}
async function welcome() {
  var welcomeTitle = chalkAnimation.rainbow("Welcome to web.cli");
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
      choices: ["fullstack", "frotend", "backend", "app", "load-config"],
    },
  ]);
  config.webType = webTypePrompt.webType;
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
  config.frontend = frontendPrompt.frontend;
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
  config.backend = backendPrompt.backend;
  return backendPrompt.backend;
}
async function appSelector() {
  const appPrompt = await inquirer.prompt([
    {
      type: "list",
      name: "app",
      message: "What framework do you want to use to create your application?",
      choices: ["react native", "ionic", "electron"],
    },
  ]);
  config.app = appPrompt.app;
  return appPrompt.app;
}
async function saveConfigPrompt() {
  var saveConfigPrompt = await inquirer.prompt([
    {
      type: "confirm",
      name: "saveConfig",
      message: "Do you want to save this configuration?",
      default: false,
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
  config.name = configName.configName;
  var configString = JSON.stringify(config);
  var configFile = `./src/configs/${configName.configName}.json`;
  if (fs.existsSync(configFile))
    console.log(
      chalk.red(`Configuration ${configName.configName} already exists.`)
    );
  fs.writeFile(configFile, configString, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.green("Configuration saved!"));
  });
}
async function getConfig() {
  await getConfigs();
  if (configs.length <= 0) {
    console.log(chalk.red("No configurations found. Please create one."));
    process.exit();
  }
  var configName = await inquirer.prompt([
    {
      type: "list",
      name: "config",
      message: "Select a config",
      choices: configs.map((config) => config.name),
    },
  ]);
  var configFile = `./src/configs/${configName.config}.json`;
  if (!fs.existsSync(configFile))
    console.log(
      chalk.red(`Configuration ${configName.config} does not exist.`)
    );
  var configString = fs.readFileSync(configFile, "utf8");
  config = JSON.parse(configString);
  console.log(chalk.green(`Configuration ${configName.config} loaded!`));
}
async function getConfigs() {
  var configFiles = fs.readdirSync("./src/configs/");
  configFiles.forEach(function (file) {
    if (file.endsWith(".json")) {
      var fileContent = fs.readFileSync("./src/configs/" + file, "utf8");
      configs.push(JSON.parse(fileContent));
    }
  });
}
async function initProject() {
  if (config.backend) {
    if (config.backend == "express") {
      await load(100, "Creating server folder...");
      fs.mkdirSync("./server");
      await load(100, "Creating server src folder...");
      fs.mkdirSync("./server/src");
      await load(100, "Creating server package.json file...");
      fs.writeFileSync(
        "./server/package.json",
        '{\n  "name": "server",\n  "version": "1.0.0",\n  "description": "",\n  "main": "src/index.js",\n  "scripts": {},\n  "author": "",\n  "license": "ISC"\n}'
      );
      await load(100, "Creating server .env file...");
      fs.writeFileSync("./server/.env", "NODE_ENV=development\nPORT=3000");
      await load(100, "Creating server index.js file...");
      fs.writeFileSync(
        "./server/src/index.js",
        `const express = require("express");\nconst app = express();\nconst morgan = require("morgan");\nrequire("dotenv").config();\n\napp.use(morgan("dev"));\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\napp.set("PORT", process.env.PORT || 3000);\napp.use("/", require("./routes/routes"));\n\napp.listen(app.get("PORT"), () => {\n    console.log("Server running on port " + app.get("PORT"));\n});`
      );
      await load(100, "Creating server src/routes folder...");
      fs.mkdirSync("./server/src/routes");
      await load(100, "Creating server src/controllers folder...");
      fs.mkdirSync("./server/src/controllers");
      await load(100, "Creating server routes file...");
      fs.writeFileSync(
        "./server/src/routes/routes.js",
        `const express = require("express");\nconst router = express.Router();\n\nrouter.get('/', async(req, res) =>{\nres.send('hello world')\n})\n\n module.exports = router;`
      );
      await load(100, "Creating server controllers file...");
      fs.writeFileSync(
        "./server/src/controllers/controllers.js",
        `module.exports = {};`
      );
      await load(100, "Creating .gitignore file...");
      fs.writeFileSync(
        "./server/.gitignore",
        "node_modules\n.env\npackage-lock.json\n"
      );
      await load(100, "Installing dependencies with npm...");
      await exec(`cd server && npm i express dotenv morgan`);
      console.log(chalk.green("Server project created!"));
    }
    if (config.backend == "nest") {
      await load(100, "Starting nest project with nest cli");
      await exec("npm i -g @nestjs/cli");
      await sleep(20000);
      await exec("nest new server");
    }
    if (config.backend == "fastify") {
      await load(100, "Starting fastify project with fastify cli");
      await exec("npm install fastify-cli --global");
      await sleep(15000);
      await exec("fastify generate server");
    }
    if (config.backend == "koa") {
      await load(100, "Starting koa project with koa cli");
      await exec("npm i -g koa");
      await sleep(15000);
      await exec("koa new server");
    }
  }
  if (config.frontend) {
    if (config.frontend == "react") {
      await load(100, "Starting react project with create-react-app...");
      await exec("npm install -g create-react-app");
      await sleep(10000);
      await exec(`create-react-app client`);
    }
    if (config.frontend == "vue") {
      await load(100, "Starting vue project with vue-cli...");
      await exec("npm install -g vue-cli");
      await sleep(10000);
      await exec(`vue init webpack client`);
    }
    if (config.frontend == "angular") {
      await load(100, "Starting angular project with ng new...");
      await exec("npm install -g @angular/cli");
      await sleep(15000);
      await exec(`ng new client`);
    }
    if (config.frontend == "next") {
      await load(100, "Creating next proyect...");
      await exec(`npx create-next-app@latest`);
    }
    if (config.frontend == "svelte") {
      await load(100, "Starting svelte project with svelte init...");
      await exec("npm install -g @svel/cli");
      await sleep(30000);
      await exec(`svelte create client`);
    }
  }
  if (config.app) {
    if (config.app == "react native") {
      await load(100, "Starting react native project with expo-cli...");
      await exec("npm install -g expo-cli");
      await sleep(50000);
      await exec(`expo init app`);
    }
    if (config.app == "ionic") {
      await load(100, "Starting ionic project with ionic cli...");
      await exec("npm install -g @ionic/cli");
      await sleep(20000);
      await exec(`ionic start app`);
    }
    if (config.app == "electron") {
      await load(100, "Starting electron project with electron cli...");
      await exec("npm install -g electron-cli");
      await sleep(30000);
      await exec(`electron-cli init app`);
    }
  }
}

console.clear();
await welcome();
await webTypeSelector();
await load(500, "Loading...");
console.clear();
if (config.webType == "load-config") {
  await getConfig();
}
if (config.webType == "app") {
  await appSelector();
  console.clear();
}
if (
  config.webType == "fullstack" ||
  (config.webType == "frotend" && config.webType != "loadConfig")
) {
  await frontendSelector();
  console.clear();
}
if (
  config.webType == "fullstack" ||
  (config.webType == "backend" && config.webType != "loadConfig")
) {
  await backendSelector();
  console.clear();
}
if (config.webType != "load-config") {
  await saveConfigPrompt();
}
console.clear();
await initProject();
