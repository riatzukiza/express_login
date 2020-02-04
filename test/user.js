const test = require("ava");
const fetch = require("node-fetch");

const app = require("../app");

app.start();

test.todo("can create user");
test.todo("User can login");
