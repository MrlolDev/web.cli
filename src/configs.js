#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import { createSpinner } from "nanospinner";
var configs = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var selectedConfig = null;

async function getConfigs() {
  var configFiles = fs.readdirSync("./src/configs/");
  configFiles.forEach(function (file) {
    if (file.endsWith(".json")) {
      var fileContent = fs.readFileSync("./src/configs/" + file, "utf8");
      var config = {
        name: file.replace(".json", ""),
        webType: JSON.parse(fileContent).webType,
        frontend: JSON.parse(fileContent).frontend,
        backend: JSON.parse(fileContent).backend,
      };
      configs.push(config);
    }
  });
}
async function welcome() {
  var welcomeTitle = chalkAnimation.rainbow("Welcome to web.cli");
  welcomeTitle.start();
  await sleep(500);
  welcomeTitle.stop();
}
async function showConfigs() {
  var configSelector = await inquirer.prompt([
    {
      type: "list",
      name: "config",
      message: "Select a config",
      choices: configs.map((config) => config.name),
    },
  ]);
  selectedConfig = configSelector.config;
}
async function load(ms, message) {
  const spinner = createSpinner(message);
  spinner.start();
  await sleep(ms);
  spinner.stop();
}
async function configOptions() {
  var configOptions = await inquirer.prompt([
    {
      type: "list",
      name: "configOption",
      message: "Select a config option",
      choices: ["info", "delete"],
    },
  ]);
  if (configOptions.configOption === "info") {
    console.clear();
    var name = configs.find((config) => config.name === selectedConfig).name;
    var webType = configs.find(
      (config) => config.name === selectedConfig
    ).webType;
    var frontend = configs.find(
      (config) => config.name === selectedConfig
    ).frontend;
    var backend = configs.find(
      (config) => config.name === selectedConfig
    ).backend;
    console.log(chalk.cyan(`Name:`), chalk.white(name));
    console.log(chalk.cyan(`Web Type:`), chalk.white(webType));
    console.log(chalk.cyan(`Frontend:`), chalk.white(frontend));
    console.log(chalk.cyan(`Backend:`), chalk.white(backend));
  } else if (configOptions.configOption === "delete") {
    var confirmDelete = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmDelete",
        message: "Are you sure you want to delete this config?",
      },
    ]);
    if (confirmDelete.confirmDelete) {
      fs.unlinkSync("./src/configs/" + selectedConfig + ".json");
      console.log(chalk.red("Config deleted!"));
    }
  }
}

console.clear();
await welcome();
await getConfigs();
await showConfigs();
console.clear();
await load(1000, "Loading...");
await configOptions();
