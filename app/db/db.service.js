let knexConfig;
let knex = require("knex");
let config = require("../../knexfile.js");

module.exports = knex(config.development);
