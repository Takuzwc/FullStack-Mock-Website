"use strict";

import fp from "fastify-plugin";
import { promisify } from "node:util";

//Promisify setTimeout
const timeout = promisify(setTimeout);

const orders = {
  A1: { total: 3 },
  A2: { total: 7 },
  B1: { total: 101 },
};

const catToPrefix = {
  electronics: "A",
  confectionery: "B",
};

async function* realtimeOrdersSimulator() {
  const ids = Object.keys(orders);
  while (true) {
    const delta = Math.floor(Math.random() * 7) + 1;
    const id = ids[Math.floor(Math.random() * ids.length)];
    orders[id].total += delta;
    const { total } = orders[id];
    yield JSON.stringify({ id, total });
    await timeout(1500);
  }
}

function* currentOrders(category) {
  const idPrefix = catToPrefix[category];
  if (!idPrefix) return;
  const ids = Object.keys(orders).filter((id) => id[0] === idPrefix);
  for (const id of ids) {
    yield JSON.stringify({ id, ...orders[id] });
  }
}
const calculateID = (idPrefix, data) => {
  const sorted = [...new Set(data.map(({ id }) => id))];
  const next = Number(sorted.pop().slice(1)) + 1;
  return `${idPrefix}${next}`;
};

export default fp(async function (fastify, opts) {
  fastify.decorate("mockDataInsert", function (request, category, data) {
    const idPrefix = catToPrefix[category];
    const id = calculateID(idPrefix, data);
    data.push({ id, ...request.body });
    return data;
  });
});

// An async function produces a promise. A generator function produces an iterable.
//This is an object with a next function that can be called to make the function
//progress to the next yield keyword in that function and returns the value of whatever
//is yielded. An iterable can be looped over with a for of loop. An async generator function
// is a combination of both async functions and generator functions, and it is useful for
// asynchronously producing continuous state changes. It returns an async iterable, which
//is an object with a next function that returns a promise which resolves to the value of
// whatever is yielded from the async function generator. Async iterables can be looped
// over with a for await of loop. See JavaScript Demo: Statement - For Await...Of
// for more insight.
// The upshot is we can use the async generator function here to output a randomly
//incremented total for a randomly selected order every 1500 milliseconds.
//We do this by awaiting the timeout function, passing 1500 to it at the end of the
//infinite while loop. Just above that, we yield a stringified object containing the
//product ID and the new total. We also keep a running total by modifying the orders
// object each time; this means we can provide consistent totals for each product to every
//WebSocket client.
// Since each item total is randomly incremented, we need a way for a client
// to get all the current order totals so it can populate the initial values
//(instead of each order count staging "pending" until it's randomly incremented).
// For this, we will add another function to mock-srv/plugins/data-utils.mjs.
// This time we will add a synchronous generator function:

//

//The currentOrders generator function takes a category name and maps it to an ID prefix.
//Then it gets all products in the orders object with that ID prefix, loops over them,
//and yields a serialized object containing the ID and order total for that ID. By
//spreading the object in the orders[id] object (...orders[id]) into the object being
//stringified, every key in the orders[id] object is copied. Currently, there is only a
//totals key, but the objects in the order object could be extended, and any extra
// properties would also be in the JSON string that's yielded from currentOrders. If,
//for any reason, an unknown category was passed to currentOrders it would have no corresponding
//ID prefix and, therefore would finish without yielding any values at all.
//For more information on non-async generators, see the following article, Generator.
