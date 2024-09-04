#!/usr/bin/env node
import { got } from "got";
import { Command } from "commander";
import { listCategories } from "../src/utils.js";
import { update } from "../src/utils.js";
import { listCategoryItems } from "../src/utils.js";

//create a new Command Program
const program = new Command();
const API = "http://localhost:3000";

//Log the usage of the command to the console
const usage = (msg = "Back office for My App") => {};

//Create a new Program
program
  .name("my-cli") //set the name of the program
  .description("Back office for My App") //Set the description
  .version("1.0.0"); //Set the version

//Create a command for adding a new order
program
  //Set the command name
  .command("update")
  //Set the argument ID to be required
  .argument("<ID>", "Order ID")
  //Set the argument AMOUNT to be required
  .argument("<AMOUNT>", "Order Amount")
  //Set the action to be executed when the command is run
  .action(async (id, amount) => await updateItem(id, amount));

//Create command for listing categories
program
  //Set the command name
  .command("list")
  //Set the command description
  .description("List categories")
  //Set the category to be optional
  .argument("[CATEGORY]", "Category to list IDs for")
  //Set the option to list all categories
  .option("-a, --all", "List all categories")
  //Set the action to be executed when the command is run
  .action(async (args, opts) => {
    if (args && opts.all)
      throw new Error("Cannot specify both category and 'all'");
    if (opts.all || args === "all") {
      listCategories();
    } else if (args === "confectionery" || args === "electronics") {
      await listCategoryItems(args);
    } else {
      throw new Error("Invalid category specified");
    }
  });

//Create command for listing categories by IDs
program
  //Set the command name
  .command("add")
  //Set the command description
  .description("Add product by ID to a Category")
  //Set the category to be required
  .argument("<CATEGORY>", "Product Category")
  //Set the argument ID to be required
  .argument("<ID>", "Product ID")
  //Set the argument NAME to be required
  .argument("<NAME>", "Product Name")
  //Set the argument AMOUNT to be required
  .argument("<AMOUNT>", "Product RRP")
  //Set the argument INFO to be optional
  .argument("[INFO...]", "Product Information")
  //Set the action to be executed when the command is run
  .action(
    async (category, id, name, amount, info) =>
      await add(category, id, name, amount, info)
  );
//Parse the arguments from process.argv
program.parse();
