#!/usr/bin/env node
import { Command } from "commander";
import {
  listCategories,
  add,
  update,
  listCategoryItems,
} from "../src/utils.js";

//create a new Command Program
const program = new Command();

//Create a new Program
// program
//   .name("my-cli") //set the name of the program
//   .description("Back office for My App") //Set the description
//   .version("1.0.0"); //Set the version

//Create a command for adding a new order
// program
//   //Set the command name
//   .command("update")
//   //Set the command description
//   .description("Update order amount")
//   //Set the argument ID to be required
//   .argument("<ID>", "Order ID")
//   //Set the argument AMOUNT to be required
//   .argument("<AMOUNT>", "Order Amount")
//   //Set the action to be executed when the command is run
//   .action(async (id, amount) => await update(id, amount));

//Create command for listing categories
// program
//   //Set the command name
//   .command("list")
//   //Set the command description
//   .description("List categories")
//   //Set the category to be optional
//   .argument("[CATEGORY]", "Category to list IDs for")
//   //Set the option to list all categories
//   .option("-a, --all", "List all categories")
//   //Set the action to be executed when the command is run
//   .action(async (args, opts) => {
//     if (args && opts.all)
//       throw new Error("Cannot specify both category and 'all'");
//     if (opts.all || args === "all") {
//       listCategories();
//     } else if (args === "confectionery" || args === "electronics") {
//       await listCategoryItems(args);
//     } else {
//       throw new Error("Invalid category specified");
//     }
//   });

//Create command for listing categories by IDs
// program
//   //Set the command name
//   .command("add")
//   //Set the command description
//   .description("Add product by ID to a Category")
//   //Set the category to be required
//   .argument("<CATEGORY>", "Product Category")
//   //Set the argument ID to be required
//   .argument("<ID>", "Product ID")
//   //Set the argument NAME to be required
//   .argument("<NAME>", "Product Name")
//   //Set the argument AMOUNT to be required
//   .argument("<AMOUNT>", "Product RRP")
//   //Set the argument INFO to be optional
//   .argument("[INFO...]", "Product Information")
//   //Set the action to be executed when the command is run
//   .action(
//     async (category, id, name, amount, info) =>
//       await add(category, id, name, amount, info)
//   );

// Create a new Command Program const program = new Command();

// Create a new Program
program
  // Set the name of the program
  .name("my-cli")
  // Set the description
  .description("Back office for My App")
  // Set the version
  .version("1.0.0")
  // Set the option to run application in interactive mode
  .option("-i, --interactive", "Run App in interactive mode")
  // Set the primary program action to be executed when no commands are specified
  .action(() => {
    // No-operation (noop)
  });

// Create a command for updating an order
program
  .command("update")
  .description("Update an order")
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[ID]", "Order ID")
  .argument("[AMOUNT]", "Order Amount");

// Create a command for listing categories by IDs
program
  .command("add")
  .description("Add Product by ID to a Category")
  // Set the option to run command in interactive mode
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[CATEGORY]", "Product Category")
  .argument("[ID]", "Product ID")
  .argument("[NAME]", "Product Name")
  .argument("[AMOUNT]", "Product RRP")
  .argument("[INFO...]", "Product Info");

// Create a command for listing categories
program
  .command("list")
  .description("List categories")
  // Set the option to run command in interactive mode
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .option("-a, --all", "List all categories")
  .argument("[CATEGORY]", "Category to list IDs for");

// Main function to run the program
async function main(program) {
  // Get the command, process.args and options
  const command = program?.args.at(0) || "";
  const cliArgs = program?.args.slice(1) || [];
  const options = program?.opts() || {};

  // Guard clauses
  if (!command && !options.interactive) {
    // Display the help
    program.help();
  }
  if (!command && options.interactive) {
    // Run the interactive app
    return interactiveApp();
  }
  if (command && options.interactive) {
    // Run the interactive app with the command
    return interactiveApp(command);
  }
  if (options.interactive && cliArgs.length > 0) {
    throw new Error("Cannot specify both interactive and command");
    process.exit(1);
  }
  // Execute the command
  switch (command) {
    case "add": {
      const [category, id, name, amount, info] = cliArgs;
      if (
        !categories.includes(category) ||
        !category ||
        !id ||
        !name ||
        !amount
      ) {
        throw new Error("Invalid arguments specified");
      }
      await add(category, id, name, amount, info);
      break;
    }
    case "update": {
      const [id, amount] = cliArgs;
      if (!id && !amount) {
        throw new Error("Invalid arguments specified");
      }
      await update(id, amount);
      break;
    }
    case "list": {
      const { all } = options;
      const [category] = cliArgs;
      if (category && all)
        throw new Error("Cannot specify both category and 'all'");
      if (all || category === "all") {
        listCategories();
      } else if (categories.includes(category)) {
        await listCategoryItems(category);
      } else {
        throw new Error("Invalid category specified");
      }
      break;
    }
    default:
      await interactiveApp();
  }
}

//Parse the arguments from process.argv
//program.parse();

// Run the main function
main(program);
