import Enquirer from "enquirer";
import { categories, listCategoryItems, listCategories } from "./utils.js";
import {
  log,
  error,
  displayTimestamp,
  displayAmount,
  displayID,
  displayCategory,
  displayInfo,
  displayKey,
  displayName,
  displayRRP,
  displaySuccess,
  displayText,
} from "./displays.js";
//Import the Enquirer types
const { prompt } = Enquirer;

const orderQuestions = [
  //...categoryQuestions,
  {
    type: "input",
    name: "id",
    message: "ID",
  },
  {
    type: "input",
    name: "name",
    message: "Name",
  },
  {
    type: "input",
    name: "amount",
    message: "Amount",
  },
  {
    type: "input",
    name: "info",
    message: "Info",
  },
];

export const promptAddOrder = async () => {
  const { category, id, name, amount, info } = await prompt(orderQuestions);
  return add(category, id, name, amount, info);
};

const updateQuestions = [
  {
    type: "input",
    name: "id",
    message: "ID",
  },
  {
    type: "input",
    name: "amount",
    message: "Amount",
  },
];
const categoryQuestions = [
  {
    type: "autocomplete",
    name: "category",
    message: "Category",
    choices: categories,
  },
];

export const promptUpdate = async () => {
  const { id, amount } = await prompt(updateQuestions);
  return update(id, amount);
};

const commandList = ["add", "update", "list by ID's", "help", "exit"];
const commandQuestions = [
  {
    type: "autocomplete",
    name: "command",
    message: "Command",
    choices: commandList,
  },
];
export const promptCommand = async () => {
  const { command } = await prompt(commandQuestions);
  return command;
};

export const promptListIds = async () => {
  const { category } = await prompt(categoryQuestions);
  return listCategoryItems(category);
};

export const interactiveApp = async (cmd) => {
  log(displayText(`Back office for My App`));
  log(displayInfo(`Interactive Mode`));
  try {
    const command = cmd ?? (await promptCommand());
    switch (command) {
      case "add":
        log(displayInfo(`Add Order`));
        await promptAddOrder();
        return interactiveApp();
      case "update":
        log(displayInfo(`Update Order`));
        await promptUpdate();
        return interactiveApp();
      case "list":
        log(displayInfo(`List Categories`));
        await listCategories();
        return interactiveApp();
      case "list by ID's":
        log(displayInfo(`List Category Items`));
        await promptListIds();
        return interactiveApp();
      case "help":
        program.help();
      case "exit":
        process.exit(0);
      // default:
      //     error(`Invalid command: ${command}`);
      //     return interactiveApp();
    }
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
};

await interactiveApp();
