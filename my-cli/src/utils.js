//Import GOT to make HTTP requests
import { got } from "got";
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
//Set the API URL
const API = "http://localhost:3000";
//Set the categories
export const categories = ["confectionery", "electronics"];

//Update the order with the given ID
export async function update(id, amount) {
  log(`${displayTimestamp()}`);
  log(
    `${displayInfo(`Updating order`)} ${displayID(id)} ${displayText(
      "with amount"
    )} ${displayAmount(amount)}`
  );
  try {
    if (isNaN(+amount)) {
      error("must be a number");
      process.exit(1);
    }
    //Use GOT to make a POST request to the API
    await got.post(`${API}/orders/${id}`, {
      json: { amount: +amount },
    });
    //Log the result to the console
    log(
      `${displaySuccess()} ${displayText("Order")} ${displayID(
        id
      )} ${displayText("updated with amount")} ${displayAmount(amount)}`
    );
  } catch (err) {
    //If there is an error, log it to the console and exit
    console.log(err.message);
    process.exit(1);
  }
  //my-cli list A1 30
}

//Add a new order
export async function add(...args) {
  //Destructure the arguments
  let [category, id, name, amount, info] = args;
  log(`${displayTimestamp()}`);
  log(
    `${displayInfo(`Request to add item to category`)} ${displayCategory(
      category
    )}`
  );
  log(
    `${displayText("Adding item")} ${displayID(id)} ${displayText(
      "with amount"
    )} ${displayAmount(amount)}`
  );
  try {
    if (isNaN(+amount)) {
      error(`<AMOUNT> must be a number`);
      process.exit(1);
    }
    //Use GOT to make a POST request to the API
    await got.post(`${API}/${category}`, {
      json: { id, name, rrp: +amount, info: info.join(" ") },
    });
    //Log the result to the console
    log(
      `${displaySuccess("Product Added! :")} ${displayID(id)}:${displayName(
        name
      )} ${displayText("has been added to the")} ${displayCategory(
        category
      )} ${displayText(category)}`
    );
  } catch (err) {
    //If there is an error, log it to the console and exit
    error(err.message);
    process.exit(1);
  }
  //my-cli add electronics A3 Server 999 A super powerful server to run all your node applications on
}

//List the categories
export function listCategories() {
  log(displayTimestamp());
  log(displayInfo("Listing categories"));
  try {
    //Loop through the categories and log them to the console and exit
    log(displayText("Categories received from API:"));
    for (const cat of categories) log(displayCategory(cat));
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

//List the IDs for the given category
export async function listCategoryItems(category) {
  log(displayTimestamp());
  log(
    `${displayInfo("Listing IDs for category")} ${displayCategory(category)}`
  );
  try {
    //Use GOT to make a GET request to the API
    const result = await got(`${API}/${category}/`).json();
    //Log the result to the console
    log(`${displaySuccess("IDs received from API:")}`);
    for (const item of result) {
      log(
        `${displayKey("ID:")}\t${displayID(item.id)}
        ${displayKey("Name:")}\t${displayName(item.name)} 
        ${displayKey("RRP:")}\t${displayRRP(item.rrp)}
        ${"Product Info:"}\n\t${displayText(item.info)}`
      );
    }
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}
